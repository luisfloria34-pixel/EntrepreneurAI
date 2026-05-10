import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton, Badge, ProgressBar } from '../../src/components';
import { spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/services/supabase';
import { checkAndAwardBadges } from '../../src/services/badges';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import * as Haptics from 'expo-haptics';

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  content: string | null;
  video_url: string | null;
  pdf_url: string | null;
  duration: string | null;
  order_index: number;
  xp_reward: number;
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const { t } = useLanguage();

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

    const [totalRes, progressRes, completedRes] = await Promise.all([
      supabase.from('lessons').select('id', { count: 'exact', head: true }).eq('course_id', data.course_id),
      supabase.from('lesson_progress').select('id', { count: 'exact', head: true })
        .eq('user_id', user.id).eq('course_id', data.course_id),
      supabase.from('lesson_progress').select('id', { count: 'exact', head: true })
        .eq('user_id', user.id).eq('lesson_id', lessonId),
    ]);
    setTotalLessons(totalRes.count ?? 0);
    setCompletedCount(progressRes.count ?? 0);
    setIsCompleted((completedRes.count ?? 0) > 0);
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
    if (!user || !lesson || saving || isCompleted) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaving(true);
    try {
      await supabase.from('lesson_progress').upsert({
        user_id: user.id,
        lesson_id: lesson.id,
        course_id: lesson.course_id,
      });

      const newCompleted = completedCount + 1;
      const newProgress = totalLessons > 0 ? Math.round((newCompleted / totalLessons) * 100) : 0;

      await supabase.from('user_progress').upsert({
        user_id: user.id,
        course_id: lesson.course_id,
        completed_lessons: newCompleted,
        progress: newProgress,
        updated_at: new Date().toISOString(),
      });

      const xp = lesson.xp_reward ?? 50;
      const { data: prof } = await supabase
        .from('profiles')
        .select('hustle_score, total_xp, lessons_completed, streak')
        .eq('id', user.id)
        .single();

      if (prof) {
        const newLessons = (prof.lessons_completed ?? 0) + 1;
        await supabase.from('profiles').update({
          hustle_score: (prof.hustle_score ?? 0) + xp,
          total_xp: (prof.total_xp ?? 0) + xp,
          lessons_completed: newLessons,
        }).eq('id', user.id);

        await supabase.from('xp_history').insert({
          user_id: user.id,
          xp,
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
  const xp = lesson?.xp_reward ?? 50;

  return (
    <ScreenWrapper edges={['top']} padded={false}>
      <View style={{ paddingHorizontal: spacing.lg, backgroundColor: colors.background.primary }}>
        <AppHeader showBack onBack={() => router.back()} rightIcon="bookmark-outline" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Video area */}
        <View style={{ aspectRatio: 16 / 9, backgroundColor: colors.background.secondary }}>
          {lesson?.video_url ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.tertiary }}>
              <TouchableOpacity style={{ width: 72, height: 72, borderRadius: radius.full, backgroundColor: colors.accent.primary, alignItems: 'center', justifyContent: 'center', paddingLeft: 4 }}>
                <Ionicons name="play" size={36} color={colors.text.inverse} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.tertiary, gap: spacing.md }}>
              <View style={{ width: 64, height: 64, borderRadius: radius.full, backgroundColor: `${colors.accent.primary}20`, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="videocam-outline" size={32} color={colors.accent.primary} />
              </View>
              <Text style={{ ...typography.smallMedium, color: colors.text.secondary }}>Video coming soon</Text>
              <Text style={{ ...typography.caption, color: colors.text.muted }}>Upload via Supabase Storage</Text>
            </View>
          )}
          {lesson?.duration && (
            <View style={{ position: 'absolute', bottom: spacing.md, right: spacing.md, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.sm }}>
              <Text style={{ ...typography.caption, color: '#fff' }}>{lesson.duration}</Text>
            </View>
          )}
        </View>

        <View style={{ padding: spacing.lg }}>
          {/* Meta */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
            <Badge label={lesson ? `Lesson ${lesson.order_index}` : 'Lesson'} size="small" />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              {lesson?.duration && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                  <Ionicons name="time-outline" size={14} color={colors.text.tertiary} />
                  <Text style={{ ...typography.small, color: colors.text.tertiary }}>{lesson.duration}</Text>
                </View>
              )}
              <Badge label={`+${xp} XP`} variant="success" size="small" />
            </View>
          </View>

          <Text style={{ ...typography.h1, color: colors.text.primary }}>{lesson?.title ?? '...'}</Text>
          {lesson?.description && (
            <Text style={{ ...typography.body, color: colors.text.secondary, marginTop: spacing.md, lineHeight: 24 }}>
              {lesson.description}
            </Text>
          )}

          {/* Progress card */}
          <View style={{ backgroundColor: colors.background.card, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.xxl }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
              <Text style={{ ...typography.bodyMedium, color: colors.text.primary }}>Course Progress</Text>
              <Text style={{ ...typography.small, color: colors.text.secondary }}>{completedCount} of {totalLessons}</Text>
            </View>
            <ProgressBar progress={progress} height={6} showPercentage={false} />
          </View>

          {/* Lesson content */}
          {lesson?.content && (
            <View style={{ marginTop: spacing.xxl }}>
              <Text style={{ ...typography.h3, color: colors.text.primary, marginBottom: spacing.lg }}>Lesson Content</Text>
              <Text style={{ ...typography.body, color: colors.text.secondary, lineHeight: 26 }}>
                {lesson.content}
              </Text>
            </View>
          )}

          {/* PDF section */}
          {lesson?.pdf_url ? (
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.background.card, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.xxl }}
            >
              <Ionicons name="document-text-outline" size={24} color={colors.accent.primary} />
              <View style={{ flex: 1 }}>
                <Text style={{ ...typography.bodyMedium, color: colors.text.primary }}>Download PDF Materials</Text>
                <Text style={{ ...typography.small, color: colors.text.secondary, marginTop: spacing.xs }}>Tap to open</Text>
              </View>
              <Ionicons name="download-outline" size={20} color={colors.accent.primary} />
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.background.card, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.xl, opacity: 0.6 }}>
              <Ionicons name="document-text-outline" size={24} color={colors.text.muted} />
              <View style={{ flex: 1 }}>
                <Text style={{ ...typography.bodyMedium, color: colors.text.muted }}>PDF Materials Coming Soon</Text>
                <Text style={{ ...typography.small, color: colors.text.muted, marginTop: spacing.xs }}>Upload via Supabase Storage</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* XP animation */}
      <Animated.View
        style={{ position: 'absolute', bottom: 90, alignSelf: 'center', backgroundColor: colors.semantic.success, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.full, transform: [{ translateY: xpY }], opacity: xpOpacity }}
        pointerEvents="none"
      >
        <Text style={{ ...typography.h3, color: colors.text.inverse }}>+{xp} XP 🎉</Text>
      </Animated.View>

      {/* Bottom CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border.default, backgroundColor: colors.background.primary }}>
        {isCompleted ? (
          <PrimaryButton title="Back to Course" onPress={() => router.back()} />
        ) : (
          <PrimaryButton
            title={saving ? t('savingBtn') : t('markComplete')}
            onPress={handleMarkDone}
            disabled={saving}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}
