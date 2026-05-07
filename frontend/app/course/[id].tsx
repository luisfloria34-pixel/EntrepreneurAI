import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, ProgressBar, Badge, PrimaryButton, SectionHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/services/supabase';
import { useAuth } from '../../src/context/AuthContext';

interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor: string | null;
  rating: number;
  total_lessons: number;
  duration: string | null;
  level: string;
  icon: string | null;
  icon_color: string | null;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  order_index: number;
}

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const courseId = Array.isArray(id) ? id[0] : id;

  useEffect(() => { load(); }, [courseId, user]);

  async function load() {
    setLoading(true);
    const [courseRes, lessonsRes, progressRes, completedRes] = await Promise.all([
      supabase.from('courses').select('*').eq('id', courseId).single(),
      supabase.from('lessons').select('*').eq('course_id', courseId).order('order_index'),
      user
        ? supabase.from('user_progress').select('progress').eq('user_id', user.id).eq('course_id', courseId).maybeSingle()
        : Promise.resolve({ data: null }),
      user
        ? supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id).eq('course_id', courseId)
        : Promise.resolve({ data: [] }),
    ]);

    if (courseRes.data) setCourse(courseRes.data);
    setLessons(lessonsRes.data ?? []);
    setProgress((progressRes as any).data?.progress ?? 0);
    setCompletedIds(new Set(((completedRes as any).data ?? []).map((r: any) => r.lesson_id)));
    setLoading(false);
  }

  if (loading) {
    return (
      <ScreenWrapper edges={['top']} padded={false}>
        <View style={styles.headerContainer}><AppHeader showBack onBack={() => router.back()} /></View>
        <View style={styles.loadingContainer}><ActivityIndicator color={colors.accent.primary} /></View>
      </ScreenWrapper>
    );
  }

  if (!course) return null;

  const color = course.icon_color ?? colors.accent.primary;
  const icon = (course.icon ?? 'book') as keyof typeof Ionicons.glyphMap;
  const nextLesson = lessons.find(l => !completedIds.has(l.id)) ?? lessons[0];

  return (
    <ScreenWrapper edges={['top']} padded={false}>
      <View style={styles.headerContainer}>
        <AppHeader showBack onBack={() => router.back()} rightIcon="bookmark-outline" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.courseHeader}>
          <View style={[styles.courseIcon, { backgroundColor: `${color}20` }]}>
            <Ionicons name={icon} size={40} color={color} />
          </View>
          <View style={styles.courseMeta}>
            <Badge label={course.level} size="small" />
            {course.rating > 0 && (
              <View style={styles.rating}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.ratingText}>{course.rating}</Text>
              </View>
            )}
          </View>
          <Text style={styles.courseTitle}>{course.title}</Text>
          {course.description && (
            <Text style={styles.courseDescription}>{course.description}</Text>
          )}

          <View style={styles.courseStats}>
            {course.duration && (
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={18} color={colors.text.secondary} />
                <Text style={styles.statText}>{course.duration}</Text>
              </View>
            )}
            <View style={styles.statItem}>
              <Ionicons name="book-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.statText}>{course.total_lessons} lessons</Text>
            </View>
            {course.instructor && (
              <View style={styles.statItem}>
                <Ionicons name="person-outline" size={18} color={colors.text.secondary} />
                <Text style={styles.statText}>{course.instructor}</Text>
              </View>
            )}
          </View>

          {progress > 0 && (
            <ProgressBar
              progress={progress}
              label="Your Progress"
              showPercentage
              height={8}
              color={color}
              style={styles.progressBar}
            />
          )}
        </View>

        <View style={styles.lessonsSection}>
          <Text style={styles.sectionTitle}>Course Content</Text>
          <Text style={styles.sectionSubtitle}>{lessons.length} lessons{course.duration ? ` · ${course.duration}` : ''}</Text>

          {lessons.length === 0 && (
            <Text style={styles.emptyLessons}>Lessons coming soon.</Text>
          )}

          {lessons.map((lesson) => {
            const done = completedIds.has(lesson.id);
            return (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonCard}
                onPress={() => router.push(`/lesson/${lesson.id}`)}
                activeOpacity={0.7}
              >
                <View style={[styles.lessonNumber, done && styles.lessonNumberCompleted]}>
                  {done ? (
                    <Ionicons name="checkmark" size={16} color={colors.text.inverse} />
                  ) : (
                    <Text style={styles.lessonNumberText}>{lesson.order_index}</Text>
                  )}
                </View>
                <View style={styles.lessonContent}>
                  <Text style={[styles.lessonTitle, done && styles.lessonTitleCompleted]}>{lesson.title}</Text>
                  {lesson.duration && <Text style={styles.lessonMeta}>{lesson.duration}</Text>}
                </View>
                <Ionicons
                  name={done ? 'checkmark-circle' : 'play-circle'}
                  size={28}
                  color={done ? colors.semantic.success : colors.accent.primary}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomCta}>
        <PrimaryButton
          title={progress > 0 ? 'Continue Learning' : 'Start Course'}
          onPress={() => nextLesson && router.push(`/lesson/${nextLesson.id}`)}
          disabled={!nextLesson}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerContainer: { paddingHorizontal: spacing.lg },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: spacing.section },
  courseHeader: { padding: spacing.lg, alignItems: 'center' },
  courseIcon: {
    width: 80, height: 80, borderRadius: radius.xl,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  courseMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  rating: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  ratingText: { ...typography.small, color: colors.text.secondary },
  courseTitle: { ...typography.h1, color: colors.text.primary, textAlign: 'center' },
  courseDescription: {
    ...typography.body, color: colors.text.secondary,
    textAlign: 'center', marginTop: spacing.md, lineHeight: 24,
  },
  courseStats: {
    flexDirection: 'row', justifyContent: 'center', gap: spacing.xxl,
    marginTop: spacing.xxl, paddingTop: spacing.xxl,
    borderTopWidth: 1, borderTopColor: colors.border.default, width: '100%',
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statText: { ...typography.small, color: colors.text.secondary },
  progressBar: { width: '100%', marginTop: spacing.xxl },
  lessonsSection: { padding: spacing.lg },
  sectionTitle: { ...typography.h2, color: colors.text.primary },
  sectionSubtitle: {
    ...typography.body, color: colors.text.secondary,
    marginTop: spacing.xs, marginBottom: spacing.xxl,
  },
  emptyLessons: { ...typography.body, color: colors.text.tertiary, paddingVertical: spacing.lg },
  lessonCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.background.card, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md,
  },
  lessonNumber: {
    width: 36, height: 36, borderRadius: radius.full,
    backgroundColor: colors.background.tertiary, alignItems: 'center',
    justifyContent: 'center', marginRight: spacing.lg,
  },
  lessonNumberCompleted: { backgroundColor: colors.semantic.success },
  lessonNumberText: { ...typography.bodyMedium, color: colors.text.secondary },
  lessonContent: { flex: 1 },
  lessonTitle: { ...typography.bodyMedium, color: colors.text.primary },
  lessonTitleCompleted: { color: colors.text.secondary },
  lessonMeta: { ...typography.caption, color: colors.text.tertiary, marginTop: spacing.xs },
  bottomCta: {
    padding: spacing.lg, borderTopWidth: 1,
    borderTopColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },
});
