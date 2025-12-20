import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, ProgressBar, Badge, PrimaryButton, SectionHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { courses, courseLessons } from '../../src/data/dummyData';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const course = courses.find(c => c.id === id) || courses[0];
  const lessons = courseLessons[course.id] || courseLessons['1'];

  return (
    <ScreenWrapper edges={['top']} padded={false}>
      <View style={styles.headerContainer}>
        <AppHeader showBack onBack={() => router.back()} rightIcon="bookmark-outline" />
      </View>
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Course Header */}
        <View style={styles.courseHeader}>
          <View style={[styles.courseIcon, { backgroundColor: `${course.color}20` }]}>
            <Ionicons name={course.icon as keyof typeof Ionicons.glyphMap} size={40} color={course.color} />
          </View>
          <View style={styles.courseMeta}>
            <Badge label={course.level} size="small" />
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>{course.rating} ({course.students?.toLocaleString()} students)</Text>
            </View>
          </View>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDescription}>{course.longDescription || course.description}</Text>
          
          <View style={styles.courseStats}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.statText}>{course.duration}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="book-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.statText}>{course.totalLessons} lessons</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="person-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.statText}>{course.instructor}</Text>
            </View>
          </View>

          {course.progress > 0 && (
            <ProgressBar 
              progress={course.progress}
              label="Your Progress"
              showPercentage
              height={8}
              color={course.color}
              style={styles.progressBar}
            />
          )}
        </View>

        {/* Lessons */}
        <View style={styles.lessonsSection}>
          <Text style={styles.sectionTitle}>Course Content</Text>
          <Text style={styles.sectionSubtitle}>{lessons.length} lessons • {course.duration}</Text>
          
          {lessons.map((lesson, index) => (
            <TouchableOpacity 
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => router.push(`/lesson/${lesson.id}`)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.lessonNumber,
                lesson.completed && styles.lessonNumberCompleted,
              ]}>
                {lesson.completed ? (
                  <Ionicons name="checkmark" size={16} color={colors.text.inverse} />
                ) : (
                  <Text style={styles.lessonNumberText}>{lesson.order}</Text>
                )}
              </View>
              <View style={styles.lessonContent}>
                <Text style={[styles.lessonTitle, lesson.completed && styles.lessonTitleCompleted]}>
                  {lesson.title}
                </Text>
                <Text style={styles.lessonMeta}>{lesson.duration}</Text>
              </View>
              <Ionicons 
                name={lesson.completed ? 'checkmark-circle' : 'play-circle'} 
                size={28} 
                color={lesson.completed ? colors.semantic.success : colors.accent.primary} 
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        <PrimaryButton 
          title={course.progress > 0 ? 'Continue Learning' : 'Start Course'}
          onPress={() => {
            const nextLesson = lessons.find(l => !l.completed) || lessons[0];
            router.push(`/lesson/${nextLesson.id}`);
          }}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    paddingBottom: spacing.section,
  },
  courseHeader: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  courseIcon: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    ...typography.small,
    color: colors.text.secondary,
  },
  courseTitle: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
  },
  courseDescription: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 24,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xxl,
    marginTop: spacing.xxl,
    paddingTop: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    width: '100%',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statText: {
    ...typography.small,
    color: colors.text.secondary,
  },
  progressBar: {
    width: '100%',
    marginTop: spacing.xxl,
  },
  lessonsSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
  },
  sectionSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  lessonNumber: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  lessonNumberCompleted: {
    backgroundColor: colors.semantic.success,
  },
  lessonNumberText: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  lessonTitleCompleted: {
    color: colors.text.secondary,
  },
  lessonMeta: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  bottomCta: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },
});
