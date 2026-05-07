import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, Card, ProgressBar, Badge, SectionHeader } from '../../src/components';
import { colors, spacing, typography, radius, shadows } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { courses, quickActions, dailyChallenge } from '../../src/data/dummyData';
import { useProfile } from '../../src/hooks/useProfile';
import { useDailyTasks } from '../../src/hooks/useDailyTasks';

export default function DashboardScreen() {
  const router = useRouter();
  const { profile, loading: profileLoading } = useProfile();
  const { tasks, loading: tasksLoading, toggleTask } = useDailyTasks();
  const currentCourse = courses.find(c => c.progress > 0 && c.progress < 100);

  const hustleScore = profile?.hustle_score ?? 0;
  const level = profile?.level ?? 1;
  const streak = profile?.streak ?? 0;
  const firstName = profile?.name?.split(' ')[0] ?? 'there';

  return (
    <ScreenWrapper scroll>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          {profileLoading ? (
            <View style={styles.skeletonName} />
          ) : (
            <Text style={styles.userName}>{firstName}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.streakBadge}
          onPress={() => router.push('/analytics')}
        >
          <Ionicons name="flame" size={20} color="#F59E0B" />
          {profileLoading ? (
            <View style={styles.skeletonStreak} />
          ) : (
            <Text style={styles.streakText}>{streak} day streak</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Hustle Score */}
      <TouchableOpacity
        style={styles.scoreCard}
        onPress={() => router.push('/analytics')}
        activeOpacity={0.8}
      >
        <View style={styles.scoreHeader}>
          <View>
            <Text style={styles.scoreLabel}>Hustle Score</Text>
            {profileLoading ? (
              <View style={styles.skeletonScore} />
            ) : (
              <Text style={styles.scoreValue}>{hustleScore.toLocaleString()}</Text>
            )}
          </View>
          <View style={styles.levelBadge}>
            <Ionicons name="trophy" size={16} color={colors.accent.primary} />
            <Text style={styles.levelText}>Level {level}</Text>
          </View>
        </View>
        <ProgressBar
          progress={(hustleScore % 1000) / 10}
          showPercentage={false}
          height={6}
        />
        <Text style={styles.xpToLevel}>{1000 - (hustleScore % 1000)} XP to next level</Text>
      </TouchableOpacity>

      {/* Daily Challenge */}
      <SectionHeader title="Today's Challenge" actionText="View" onAction={() => router.push('/challenge')} />
      <TouchableOpacity
        style={styles.challengeCard}
        onPress={() => router.push('/challenge')}
        activeOpacity={0.8}
      >
        <View style={styles.challengeIcon}>
          <Ionicons name="flash" size={28} color="#F59E0B" />
        </View>
        <View style={styles.challengeContent}>
          <Text style={styles.challengeTitle}>{dailyChallenge.title}</Text>
          <Text style={styles.challengeDesc} numberOfLines={1}>{dailyChallenge.description}</Text>
          <View style={styles.challengeMeta}>
            <Badge label={`+${dailyChallenge.xp} XP`} variant="warning" size="small" />
            <Text style={styles.challengeTime}>{dailyChallenge.timeLimit}</Text>
          </View>
        </View>
        <Ionicons name="play-circle" size={36} color={colors.accent.primary} />
      </TouchableOpacity>

      {/* Continue Learning */}
      {currentCourse && (
        <>
          <SectionHeader title="Continue Learning" actionText="All Courses" onAction={() => router.push('/(tabs)/courses')} />
          <TouchableOpacity
            style={styles.courseCard}
            onPress={() => router.push(`/course/${currentCourse.id}`)}
            activeOpacity={0.8}
          >
            <View style={[styles.courseIcon, { backgroundColor: `${currentCourse.color}20` }]}>
              <Ionicons name={currentCourse.icon as keyof typeof Ionicons.glyphMap} size={28} color={currentCourse.color} />
            </View>
            <View style={styles.courseContent}>
              <Text style={styles.courseTitle}>{currentCourse.title}</Text>
              <Text style={styles.courseLesson}>Lesson {currentCourse.completedLessons + 1} of {currentCourse.totalLessons}</Text>
              <ProgressBar
                progress={currentCourse.progress}
                showPercentage
                height={6}
                color={currentCourse.color}
                style={styles.courseProgress}
              />
            </View>
          </TouchableOpacity>
        </>
      )}

      {/* Quick Actions */}
      <SectionHeader title="Quick Actions" />
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.quickActionCard}
            activeOpacity={0.7}
            onPress={() => {
              if (action.route) router.push(action.route as any);
            }}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
              <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={24} color={action.color} />
            </View>
            <Text style={styles.quickActionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Daily Tasks */}
      <SectionHeader title="Daily Tasks" actionText="View All" onAction={() => router.push('/tasks')} />
      <View style={styles.tasksContainer}>
        {tasksLoading ? (
          <View style={styles.loadingTasks}>
            <ActivityIndicator color={colors.accent.primary} />
          </View>
        ) : tasks.length === 0 ? (
          <View style={styles.emptyTasks}>
            <Text style={styles.emptyTasksText}>No tasks for today yet.</Text>
          </View>
        ) : (
          tasks.slice(0, 3).map((task, index) => (
            <TouchableOpacity
              key={task.id}
              style={[styles.taskItem, index < Math.min(tasks.length, 3) - 1 && styles.taskDivider]}
              onPress={() => toggleTask(task.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.taskCheck, task.completed && styles.taskCheckDone]}>
                {task.completed && <Ionicons name="checkmark" size={14} color={colors.text.inverse} />}
              </View>
              <View style={styles.taskContent}>
                <Text style={[styles.taskTitle, task.completed && styles.taskTitleDone]}>{task.title}</Text>
                {task.description ? (
                  <Text style={styles.taskDesc}>{task.description}</Text>
                ) : null}
              </View>
              <Badge label={`+${task.xp}`} variant={task.completed ? 'success' : 'default'} size="small" />
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: spacing.lg,
  },
  greeting: {
    ...typography.body,
    color: colors.text.secondary,
  },
  userName: {
    ...typography.h1,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  skeletonName: {
    width: 120,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.border.default,
    marginTop: spacing.xs,
  },
  skeletonStreak: {
    width: 80,
    height: 16,
    borderRadius: radius.sm,
    backgroundColor: '#F59E0B40',
  },
  skeletonScore: {
    width: 100,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.border.default,
    marginTop: spacing.xs,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  streakText: {
    ...typography.smallMedium,
    color: '#F59E0B',
  },
  scoreCard: {
    backgroundColor: colors.background.elevated,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginTop: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  scoreLabel: {
    ...typography.small,
    color: colors.text.secondary,
  },
  scoreValue: {
    ...typography.display,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.accent.primary}20`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  levelText: {
    ...typography.smallMedium,
    color: colors.accent.primary,
  },
  xpToLevel: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#F59E0B40',
  },
  challengeIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: '#F59E0B20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  challengeDesc: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  challengeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  challengeTime: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  courseIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  courseLesson: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  courseProgress: {
    marginTop: spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickActionText: {
    ...typography.smallMedium,
    color: colors.text.primary,
  },
  tasksContainer: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  loadingTasks: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyTasks: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyTasksText: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  taskDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  taskCheck: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  taskCheckDone: {
    backgroundColor: colors.semantic.success,
    borderColor: colors.semantic.success,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    ...typography.body,
    color: colors.text.primary,
  },
  taskTitleDone: {
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  taskDesc: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
});
