import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, Card, ProgressBar, Badge } from '../../src/components';
import { colors, spacing, typography, radius, shadows } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { userData, dailyTask, currentCourse, quickActions } from '../../src/data/dummyData';

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{userData.name.split(' ')[0]}</Text>
          </View>
          <TouchableOpacity style={styles.streakBadge}>
            <Ionicons name="flame" size={20} color="#F59E0B" />
            <Text style={styles.streakText}>{userData.streak} day streak</Text>
          </TouchableOpacity>
        </View>

        {/* Hustle Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <View>
              <Text style={styles.scoreLabel}>Hustle Score</Text>
              <Text style={styles.scoreValue}>{userData.hustleScore.toLocaleString()}</Text>
            </View>
            <View style={styles.levelBadge}>
              <Ionicons name="trophy" size={18} color={colors.accent.primary} />
              <Text style={styles.levelText}>Level {userData.level}</Text>
            </View>
          </View>
          <ProgressBar 
            progress={(userData.hustleScore % 1000) / 10} 
            showPercentage={false}
            height={6}
            style={styles.scoreProgress}
          />
          <Text style={styles.xpToLevel}>
            {1000 - (userData.hustleScore % 1000)} XP to next level
          </Text>
        </View>

        {/* Daily Task */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Challenge</Text>
          <TouchableOpacity 
            style={styles.dailyTaskCard}
            activeOpacity={0.8}
            onPress={() => router.push('/lesson')}
          >
            <View style={styles.dailyTaskIcon}>
              <Ionicons name="flash" size={28} color="#F59E0B" />
            </View>
            <View style={styles.dailyTaskContent}>
              <Text style={styles.dailyTaskTitle}>{dailyTask.title}</Text>
              <Text style={styles.dailyTaskDesc}>{dailyTask.description}</Text>
              <View style={styles.dailyTaskMeta}>
                <Badge label={`+${dailyTask.xp} XP`} variant="warning" size="small" />
                <Text style={styles.dailyTaskTime}>~10 min</Text>
              </View>
            </View>
            <Ionicons name="play-circle" size={32} color={colors.accent.primary} />
          </TouchableOpacity>
        </View>

        {/* Continue Learning */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/courses')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.courseCard}
            activeOpacity={0.8}
            onPress={() => router.push('/lesson')}
          >
            <View style={styles.courseIcon}>
              <Ionicons name="rocket" size={32} color={colors.accent.primary} />
            </View>
            <View style={styles.courseContent}>
              <Text style={styles.courseTitle}>{currentCourse.title}</Text>
              <Text style={styles.courseLesson}>Next: {currentCourse.nextLesson}</Text>
              <ProgressBar 
                progress={currentCourse.progress}
                label={`${currentCourse.completedLessons}/${currentCourse.totalLessons} lessons`}
                height={6}
                style={styles.courseProgress}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id}
                style={styles.quickActionCard}
                activeOpacity={0.7}
                onPress={() => {
                  if (action.id === '2') router.push('/(tabs)/coach');
                }}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
                  <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  greeting: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  userName: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
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
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: '#F59E0B',
  },
  scoreCard: {
    backgroundColor: colors.background.elevated,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    ...shadows.md,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  scoreLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  scoreValue: {
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.bold,
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
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accent.primary,
  },
  scoreProgress: {
    marginBottom: spacing.sm,
  },
  xpToLevel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: typography.fontSize.sm,
    color: colors.accent.primary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.md,
  },
  dailyTaskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#F59E0B40',
  },
  dailyTaskIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: '#F59E0B20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  dailyTaskContent: {
    flex: 1,
  },
  dailyTaskTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  dailyTaskDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  dailyTaskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  dailyTaskTime: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  courseIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  courseLesson: {
    fontSize: typography.fontSize.sm,
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
    width: '47%',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.md,
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
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
});
