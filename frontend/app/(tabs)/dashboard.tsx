import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, Card, ProgressBar, Badge, SectionHeader } from '../../src/components';
import { colors, spacing, typography, radius, shadows } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../../src/hooks/useProfile';
import { useDailyTasks } from '../../src/hooks/useDailyTasks';
import { getIsPro } from '../../src/services/proStatus';
import * as Haptics from 'expo-haptics';

function getTimeGreeting(hour: number): string {
  if (hour >= 5 && hour < 9)  return 'Rise & Grind,';
  if (hour >= 9 && hour < 12) return 'Good Morning,';
  if (hour >= 12 && hour < 14) return 'Good Afternoon,';
  if (hour >= 14 && hour < 18) return 'Keep Pushing,';
  if (hour >= 18 && hour < 21) return 'Good Evening,';
  if (hour >= 21)              return 'Still Hustling,';
  return 'Midnight Grind,';
}

function getTimeSubtitle(hour: number): string {
  if (hour >= 5 && hour < 9)  return 'Early birds catch the deals 🐦';
  if (hour >= 9 && hour < 12) return "Let's make today count 🔥";
  if (hour >= 12 && hour < 14) return 'Halfway through, keep going 💪';
  if (hour >= 14 && hour < 18) return 'Afternoon grind hits different ⚡';
  if (hour >= 18 && hour < 21) return 'Evening session, you showed up 🎯';
  if (hour >= 21)              return 'Night owls build empires 🦉';
  return 'While they sleep, you build 🌙';
}

const QUICK_ACTIONS = [
  { id: '1', title: 'Challenge', icon: 'flash', color: '#F59E0B', route: '/challenge' },
  { id: '2', title: 'AI Coach', icon: 'chatbubbles', color: '#00D4FF', route: '/(tabs)/coach' },
  { id: '3', title: 'Community', icon: 'people', color: '#8B5CF6', route: '/community' },
  { id: '4', title: 'Analytics', icon: 'stats-chart', color: '#10B981', route: '/analytics' },
] as const;

const DAILY_CHALLENGE = {
  title: 'Market Validation Sprint',
  description: 'Complete 3 market research activities and validate one business idea.',
  xp: 150,
  timeLimit: '24h',
};

export default function DashboardScreen() {
  const router = useRouter();
  const { profile, loading: profileLoading, refetch: refetchProfile } = useProfile();
  const { tasks, loading: tasksLoading, toggleTask } = useDailyTasks();
  const [refreshing, setRefreshing] = useState(false);
  const [isPro, setIsPro] = useState(false);

  React.useEffect(() => { getIsPro().then(setIsPro); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchProfile();
    setRefreshing(false);
  }, [refetchProfile]);

  const hour = new Date().getHours();
  const greeting = getTimeGreeting(hour);
  const subtitle = getTimeSubtitle(hour);

  const hustleScore = profile?.hustle_score ?? 0;
  const level = profile?.level ?? 1;
  const streak = profile?.streak ?? 0;
  const firstName = profile?.name?.split(' ')[0] ?? 'there';
  // Pro title: "FirstName Closer ⚡", free: "FirstName 👋"
  const displayName = isPro ? `${firstName} Closer ⚡` : `${firstName} 👋`;

  return (
    <ScreenWrapper scroll refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent.primary} />}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{greeting}</Text>
          {profileLoading ? (
            <View style={styles.skeletonName} />
          ) : (
            <>
              <Text style={styles.userName}>
                <Text style={styles.userNameFirst}>{firstName} </Text>
                {isPro
                  ? <Text style={styles.userNamePro}>Closer ⚡</Text>
                  : <Text style={styles.userNameEmoji}>👋</Text>
                }
              </Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </>
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
          <Text style={styles.challengeTitle}>{DAILY_CHALLENGE.title}</Text>
          <Text style={styles.challengeDesc} numberOfLines={1}>{DAILY_CHALLENGE.description}</Text>
          <View style={styles.challengeMeta}>
            <Badge label={`+${DAILY_CHALLENGE.xp} XP`} variant="warning" size="small" />
            <Text style={styles.challengeTime}>{DAILY_CHALLENGE.timeLimit}</Text>
          </View>
        </View>
        <Ionicons name="play-circle" size={36} color={colors.accent.primary} />
      </TouchableOpacity>

      {/* Quick Actions */}
      <SectionHeader title="Quick Actions" />
      <View style={styles.quickActionsGrid}>
        {QUICK_ACTIONS.map((action) => (
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
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleTask(task.id); }}
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
  headerLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  greeting: {
    ...typography.body,
    color: colors.text.secondary,
  },
  userName: {
    ...typography.h1,
    marginTop: spacing.xs,
  },
  userNameFirst: {
    color: colors.text.primary,
    fontWeight: '700',
  },
  userNamePro: {
    color: colors.accent.primary,
    fontWeight: '700',
  },
  userNameEmoji: {
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.small,
    color: colors.text.tertiary,
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
