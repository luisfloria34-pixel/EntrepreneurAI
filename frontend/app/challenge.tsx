import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton, Badge, ProgressBar } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { dailyChallenge } from '../src/data/dummyData';

export default function ChallengeScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title="Daily Challenge" />
      
      {/* Challenge Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="flash" size={48} color="#F59E0B" />
        </View>
        <Badge label={`+${dailyChallenge.xp} XP`} variant="warning" />
        <Text style={styles.title}>{dailyChallenge.title}</Text>
        <Text style={styles.description}>{dailyChallenge.description}</Text>
        
        <View style={styles.timeRemaining}>
          <Ionicons name="time-outline" size={18} color={colors.text.secondary} />
          <Text style={styles.timeText}>Time remaining: {dailyChallenge.timeLimit}</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <ProgressBar 
          progress={dailyChallenge.progress}
          label="Challenge Progress"
          showPercentage
          height={8}
          color="#F59E0B"
        />
      </View>

      {/* Tasks */}
      <View style={styles.tasksSection}>
        <Text style={styles.sectionTitle}>Tasks to Complete</Text>
        {dailyChallenge.tasks.map((task, index) => (
          <TouchableOpacity key={task.id} style={styles.taskCard} activeOpacity={0.7}>
            <View style={[styles.taskCheck, task.done && styles.taskCheckDone]}>
              {task.done && <Ionicons name="checkmark" size={16} color={colors.text.inverse} />}
            </View>
            <View style={styles.taskContent}>
              <Text style={[styles.taskTitle, task.done && styles.taskTitleDone]}>{task.title}</Text>
              <Text style={styles.taskNumber}>Task {index + 1} of {dailyChallenge.tasks.length}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Pro Tips</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color={colors.accent.primary} />
          <Text style={styles.tipText}>
            Complete all tasks before the timer runs out to earn bonus XP and maintain your streak!
          </Text>
        </View>
      </View>

      <View style={styles.bottomCta}>
        <PrimaryButton title="Start First Task" onPress={() => router.push('/lesson/1-3')} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: '#F59E0B20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 24,
  },
  timeRemaining: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  timeText: {
    ...typography.smallMedium,
    color: colors.text.secondary,
  },
  progressSection: {
    marginBottom: spacing.xxxl,
  },
  tasksSection: {
    marginBottom: spacing.xxxl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  taskCheck: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  taskCheckDone: {
    backgroundColor: colors.semantic.success,
    borderColor: colors.semantic.success,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  taskTitleDone: {
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  taskNumber: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  tipsSection: {
    marginBottom: spacing.xxl,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${colors.accent.primary}10`,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  tipText: {
    flex: 1,
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  bottomCta: {
    paddingVertical: spacing.lg,
  },
});
