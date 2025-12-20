import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, ProgressBar, Badge } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { courses } from '../../src/data/dummyData';

export default function CoursesScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper edges={['top']}>
      <AppHeader title="Courses" subtitle="Master the skills of entrepreneurship" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Active Courses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>In Progress</Text>
          {courses
            .filter((c) => c.progress > 0)
            .map((course) => (
              <CourseCard key={course.id} course={course} onPress={() => router.push('/lesson')} />
            ))}
        </View>

        {/* Available Courses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Courses</Text>
          {courses
            .filter((c) => c.progress === 0)
            .map((course) => (
              <CourseCard key={course.id} course={course} onPress={() => router.push('/lesson')} />
            ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

interface CourseCardProps {
  course: typeof courses[0];
  onPress: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => (
  <TouchableOpacity style={styles.courseCard} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.courseHeader}>
      <View style={[styles.courseIcon, { backgroundColor: `${course.color}20` }]}>
        <Ionicons name={course.icon as keyof typeof Ionicons.glyphMap} size={28} color={course.color} />
      </View>
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <View style={styles.courseMeta}>
          <Badge label={course.level} size="small" variant="default" />
          <View style={styles.metaDivider} />
          <Text style={styles.metaText}>{course.totalLessons} lessons</Text>
          <View style={styles.metaDivider} />
          <Text style={styles.metaText}>{course.duration}</Text>
        </View>
      </View>
    </View>
    <Text style={styles.courseDescription} numberOfLines={2}>
      {course.description}
    </Text>
    {course.progress > 0 && (
      <ProgressBar 
        progress={course.progress}
        showPercentage
        height={6}
        color={course.color}
        style={styles.progressBar}
      />
    )}
    <View style={styles.courseFooter}>
      <Text style={styles.startText}>
        {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
      </Text>
      <Ionicons name="arrow-forward" size={18} color={colors.accent.primary} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  courseCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  courseHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  courseIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  courseInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.tertiary,
    marginHorizontal: spacing.sm,
  },
  metaText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  courseDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  progressBar: {
    marginBottom: spacing.md,
  },
  courseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  startText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accent.primary,
  },
});
