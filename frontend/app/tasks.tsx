import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, Badge } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { dailyTasks } from '../src/data/dummyData';

export default function TasksScreen() {
  const router = useRouter();
  const completedCount = dailyTasks.filter(t => t.completed).length;
  const totalXP = dailyTasks.reduce((acc, t) => acc + t.xp, 0);

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title="Daily Tasks" />
      
      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{completedCount}/{dailyTasks.length}</Text>
          <Text style={styles.summaryLabel}>Completed</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalXP}</Text>
          <Text style={styles.summaryLabel}>Total XP</Text>
        </View>
      </View>

      {/* Tasks */}
      <Text style={styles.sectionTitle}>Today's Tasks</Text>
      {dailyTasks.map((task) => (
        <TouchableOpacity key={task.id} style={styles.taskCard} activeOpacity={0.7}>
          <View style={[styles.taskCheck, task.completed && styles.taskCheckDone]}>
            {task.completed && <Ionicons name="checkmark" size={16} color={colors.text.inverse} />}
          </View>
          <View style={styles.taskContent}>
            <Text style={[styles.taskTitle, task.completed && styles.taskTitleDone]}>{task.title}</Text>
            <Text style={styles.taskDesc}>{task.description}</Text>
          </View>
          <Badge label={`+${task.xp}`} variant={task.completed ? 'success' : 'default'} size="small" />
        </TouchableOpacity>
      ))}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  summaryValue: {
    ...typography.h1,
    color: colors.accent.primary,
  },
  summaryLabel: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
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
  taskDesc: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
});
