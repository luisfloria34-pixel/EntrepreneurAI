import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton, Badge, ProgressBar } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/services/supabase';
import { checkAndAwardBadges } from '../../src/services/badges';
import { useAuth } from '../../src/context/AuthContext';

const LESSON_XP = 50;

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  duration: string | null;
  order_index: number;
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [totalLessons, setTotalLessons] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const xpY = useState(new Animated.Value(0))[0];
  const xpOpacity = useState(new Animated.Value(0))[0];

  useEffect(() => { loadLesson(); }, [id, user]);

  async function loadLesson() {
    if (!user) return;
    const lessonId = Array.isArray(id) ? id[0] : id;

    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .maybeSingle();

    if (!data) return;
    setLesson(data);

    const [totalRes, progressRes] = await Promise.all([
      supabase.from('lessons').select('id', { count: 'exact', head: true }).eq('course_id', data.course_id),
      supabase.from('lesson_progress').select('id', { count: 'exact', head: true })
        .eq('user_id', user.id).eq('course_id', data.course_id),
    ]);
    setTotalLessons(totalRes.count ?? 0);
    setCompletedCount(progressRes.count ?? 0);
  }

  function showXPAnimation() {
    xpY.setValue(0);
    xpOpacity.setValue(1);
    Animated.parallel([
      Animated.timing(xpY, { toValue: -60, duration: 1200, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(700),
        Animated.timing(xpOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }

  async function handleMarkDone() {
    if (!user || !lesson || saving) return;
    setSaving(true);
    try {
      await supabase
        .from('lesson_progress')
        .upsert({ user_id: user.id, lesson_id: lesson.id, course_id: lesson.course_id });

      const newCompleted = completedCount + 1;
      const newProgress = totalLessons > 0 ? Math.round((newCompleted / totalLessons) * 100) : 0;

      await supabase.from('user_progress').upsert({
        user_id: user.id,
        course_id: lesson.course_id,
        completed_lessons: newCompleted,
        progress: newProgress,
        updated_at: new Date().toISOString(),
      });

      const { data: prof } = await supabase
        .from('profiles')
        .select('hustle_score, total_xp, lessons_completed, streak')
        .eq('id', user.id)
        .single();

      if (prof) {
        const newLessons = (prof.lessons_completed ?? 0) + 1;
        await supabase.from('profiles').update({
          hustle_score: (prof.hustle_score ?? 0) + LESSON_XP,
          total_xp: (prof.total_xp ?? 0) + LESSON_XP,
          lessons_completed: newLessons,
        }).eq('id', user.id);

        await supabase.from('xp_history').insert({
          user_id: user.id,
          xp: LESSON_XP,
          reason: `Completed: ${lesson.title}`,
        });

        await checkAndAwardBadges(user.id,
          { streak: prof.streak ?? 0, lessons_completed: newLessons },
          { lessonCompletedAt: new Date() }
        );
      }

      setIsCompleted(true);
      setCompletedCount(newCompleted);
      showXPAnimation();
    } catch {
      Alert.alert('Error', 'Could not save progress. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <ScreenWrapper edges={['top']} padded={false}>
      <View style={styles.headerContainer}>
        <AppHeader showBack onBack={() => router.back()} rightIcon="bookmark-outline" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={40} color={colors.text.inverse} />
            </TouchableOpacity>
            {lesson?.duration && (
              <Text style={styles.videoDuration}>{lesson.duration}</Text>
            )}
          </View>
          <View style={styles.videoProgress}>
            <View style={styles.videoProgressFill} />
          </View>
        </View>

        <View style={styles.lessonInfo}>
          <View style={styles.lessonMeta}>
            <Badge label={lesson ? `Lesson ${lesson.order_index}` : 'Lesson'} size="small" />
            {lesson?.duration && (
              <View style={styles.duration}>
                <Ionicons name="time-outline" size={14} color={colors.text.tertiary} />
                <Text style={styles.durationText}>{lesson.duration}</Text>
              </View>
            )}
          </View>
          <Text style={styles.lessonTitle}>{lesson?.title ?? '...'}</Text>
          {lesson?.description && (
            <Text style={styles.lessonDescription}>{lesson.description}</Text>
          )}
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Course Progress</Text>
            <Text style={styles.progressText}>{completedCount} of {totalLessons}</Text>
          </View>
          <ProgressBar progress={progress} height={6} showPercentage={false} />
        </View>

        <View style={styles.lessonContent}>
          <Text style={styles.contentTitle}>In This Lesson</Text>
          <View style={styles.contentList}>
            <ContentItem icon="checkmark-circle" text="Key concepts and fundamentals" completed />
            <ContentItem icon="checkmark-circle" text="Practical examples and case studies" completed />
            <ContentItem icon="ellipse-outline" text="Interactive exercises" />
            <ContentItem icon="ellipse-outline" text="Summary and key takeaways" />
          </View>
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Your Notes</Text>
          <TouchableOpacity style={styles.notesInput}>
            <Ionicons name="create-outline" size={20} color={colors.text.tertiary} />
            <Text style={styles.notesPlaceholder}>Tap to add notes for this lesson...</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Animated.View
        style={[styles.xpBubble, { transform: [{ translateY: xpY }], opacity: xpOpacity }]}
        pointerEvents="none"
      >
        <Text style={styles.xpBubbleText}>+{LESSON_XP} XP 🎉</Text>
      </Animated.View>

      <View style={styles.bottomCta}>
        {isCompleted ? (
          <PrimaryButton title="Back to Course" onPress={() => router.back()} />
        ) : (
          <PrimaryButton
            title={saving ? 'Saving...' : 'Mark as Complete'}
            onPress={handleMarkDone}
            disabled={saving}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const ContentItem = ({ icon, text, completed }: {
  icon: keyof typeof Ionicons.glyphMap; text: string; completed?: boolean;
}) => (
  <View style={styles.contentItem}>
    <Ionicons name={icon} size={20} color={completed ? colors.semantic.success : colors.text.tertiary} />
    <Text style={[styles.contentItemText, completed && styles.contentItemCompleted]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: { paddingHorizontal: spacing.lg },
  content: { paddingBottom: spacing.section },
  videoContainer: { aspectRatio: 16 / 9, backgroundColor: colors.background.secondary },
  videoPlaceholder: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.background.tertiary,
  },
  playButton: {
    width: 72, height: 72, borderRadius: radius.full,
    backgroundColor: colors.accent.primary, alignItems: 'center',
    justifyContent: 'center', paddingLeft: 4,
  },
  videoDuration: {
    ...typography.small, color: colors.text.secondary,
    position: 'absolute', bottom: spacing.lg, right: spacing.lg,
    backgroundColor: colors.background.overlay,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  videoProgress: { height: 4, backgroundColor: colors.background.tertiary },
  videoProgressFill: { width: '35%', height: '100%', backgroundColor: colors.accent.primary },
  lessonInfo: { padding: spacing.lg },
  lessonMeta: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: spacing.lg,
  },
  duration: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  durationText: { ...typography.small, color: colors.text.tertiary },
  lessonTitle: { ...typography.h1, color: colors.text.primary },
  lessonDescription: { ...typography.body, color: colors.text.secondary, marginTop: spacing.md, lineHeight: 24 },
  progressCard: {
    backgroundColor: colors.background.card, borderRadius: radius.lg,
    padding: spacing.lg, marginHorizontal: spacing.lg, marginBottom: spacing.xxl,
  },
  progressHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.md,
  },
  progressTitle: { ...typography.bodyMedium, color: colors.text.primary },
  progressText: { ...typography.small, color: colors.text.secondary },
  lessonContent: { paddingHorizontal: spacing.lg, marginBottom: spacing.xxl },
  contentTitle: { ...typography.h3, color: colors.text.primary, marginBottom: spacing.lg },
  contentList: { gap: spacing.lg },
  contentItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  contentItemText: { ...typography.body, color: colors.text.secondary },
  contentItemCompleted: { color: colors.text.primary },
  notesSection: { paddingHorizontal: spacing.lg, marginBottom: spacing.xxl },
  notesTitle: { ...typography.h3, color: colors.text.primary, marginBottom: spacing.md },
  notesInput: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.background.card, borderRadius: radius.lg, padding: spacing.lg,
  },
  notesPlaceholder: { ...typography.body, color: colors.text.tertiary },
  xpBubble: {
    position: 'absolute', bottom: 90, alignSelf: 'center',
    backgroundColor: colors.semantic.success,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  xpBubbleText: { ...typography.h3, color: colors.text.inverse },
  bottomCta: {
    padding: spacing.lg, borderTopWidth: 1,
    borderTopColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },
});
