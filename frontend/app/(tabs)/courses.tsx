import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, ProgressBar, Badge, SectionHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { courses } from '../../src/data/dummyData';

export default function CoursesScreen() {
  const router = useRouter();
  const inProgress = courses.filter(c => c.progress > 0 && c.progress < 100);
  const available = courses.filter(c => c.progress === 0);

  return (
    <ScreenWrapper scroll>
      <AppHeader 
        title="Courses" 
        subtitle="Master entrepreneurship skills"
        large
      />
      
      {/* In Progress */}
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

      {/* Available */}
      <SectionHeader title="Available Courses" />
      {available.map((course) => (
        <CourseCard 
          key={course.id} 
          course={course} 
          onPress={() => router.push(`/course/${course.id}`)} 
        />
      ))}
    </ScreenWrapper>
  );
}

interface CourseCardProps {
  course: typeof courses[0];
  onPress: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => (
  <TouchableOpacity style={styles.courseCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.courseHeader}>
      <View style={[styles.courseIcon, { backgroundColor: `${course.color}20` }]}>
        <Ionicons name={course.icon as keyof typeof Ionicons.glyphMap} size={26} color={course.color} />
      </View>
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <View style={styles.courseMeta}>
          <Badge label={course.level} size="small" />
          <Text style={styles.metaText}>{course.totalLessons} lessons</Text>
          <Text style={styles.metaText}>{course.duration}</Text>
        </View>
      </View>
    </View>
    <Text style={styles.courseDescription} numberOfLines={2}>{course.description}</Text>
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
      <View style={styles.instructorInfo}>
        <Ionicons name="person-circle" size={20} color={colors.text.tertiary} />
        <Text style={styles.instructorName}>{course.instructor}</Text>
        <View style={styles.rating}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text style={styles.ratingText}>{course.rating}</Text>
        </View>
      </View>
      <View style={styles.startButton}>
        <Text style={styles.startText}>{course.progress > 0 ? 'Continue' : 'Start'}</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.accent.primary} />
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
