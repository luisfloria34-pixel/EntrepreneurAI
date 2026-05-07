import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, ProgressBar, Badge, SectionHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useCourses, CourseWithProgress } from '../../src/hooks/useCourses';

export default function CoursesScreen() {
  const router = useRouter();
  const { inProgress, available, loading } = useCourses();

  return (
    <ScreenWrapper scroll>
      <AppHeader
        title="Courses"
        subtitle="Master entrepreneurship skills"
        large
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.accent.primary} />
        </View>
      ) : (
        <>
          {inProgress.length > 0 && (
            <>
              <SectionHeader title="In Progress" />
              {inProgress.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onPress={() => router.push(`/course/${course.id}`)}
                />
              ))}
            </>
          )}

          <SectionHeader title="Available Courses" />
          {available.length === 0 && inProgress.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No courses available yet.</Text>
            </View>
          ) : available.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>All courses in progress!</Text>
            </View>
          ) : (
            available.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={() => router.push(`/course/${course.id}`)}
              />
            ))
          )}
        </>
      )}
    </ScreenWrapper>
  );
}

const CourseCard: React.FC<{ course: CourseWithProgress; onPress: () => void }> = ({
  course,
  onPress,
}) => {
  const color = course.icon_color ?? colors.accent.primary;
  const icon = (course.icon ?? 'book') as keyof typeof Ionicons.glyphMap;

  return (
    <TouchableOpacity style={styles.courseCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.courseHeader}>
        <View style={[styles.courseIcon, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={26} color={color} />
        </View>
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <View style={styles.courseMeta}>
            <Badge label={course.level} size="small" />
            <Text style={styles.metaText}>{course.total_lessons} lessons</Text>
            {course.duration ? <Text style={styles.metaText}>{course.duration}</Text> : null}
          </View>
        </View>
      </View>

      {course.description ? (
        <Text style={styles.courseDescription} numberOfLines={2}>{course.description}</Text>
      ) : null}

      {course.progress > 0 && (
        <ProgressBar
          progress={course.progress}
          showPercentage
          height={6}
          color={color}
          style={styles.progressBar}
        />
      )}

      <View style={styles.courseFooter}>
        <View style={styles.instructorInfo}>
          <Ionicons name="person-circle" size={20} color={colors.text.tertiary} />
          <Text style={styles.instructorName}>{course.instructor ?? 'Instructor'}</Text>
          {course.rating > 0 && (
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>{course.rating}</Text>
            </View>
          )}
        </View>
        <View style={styles.startButton}>
          <Text style={styles.startText}>{course.progress > 0 ? 'Continue' : 'Start'}</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.accent.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    paddingTop: spacing.section,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.tertiary,
  },
  courseCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  courseHeader: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  courseIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  courseInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  courseTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  metaText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  courseDescription: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  progressBar: {
    marginBottom: spacing.lg,
  },
  courseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  instructorName: {
    ...typography.small,
    color: colors.text.secondary,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    ...typography.smallMedium,
    color: colors.text.secondary,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  startText: {
    ...typography.smallMedium,
    color: colors.accent.primary,
  },
});
