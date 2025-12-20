import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function GoalsSettingsScreen() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState('15');

  const goals = [
    { id: '5', label: '5 min/day', description: 'Casual' },
    { id: '10', label: '10 min/day', description: 'Regular' },
    { id: '15', label: '15 min/day', description: 'Serious' },
    { id: '30', label: '30 min/day', description: 'Intense' },
  ];

  return (
    <ScreenWrapper>
      <AppHeader showBack onBack={() => router.back()} title="Learning Goals" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Daily Learning Goal</Text>
        <Text style={styles.subtitle}>How much time do you want to dedicate to learning each day?</Text>

        <View style={styles.goalsContainer}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                selectedGoal === goal.id && styles.goalCardSelected,
              ]}
              onPress={() => setSelectedGoal(goal.id)}
            >
              <View style={styles.goalContent}>
                <Text style={[
                  styles.goalLabel,
                  selectedGoal === goal.id && styles.goalLabelSelected,
                ]}>{goal.label}</Text>
                <Text style={styles.goalDescription}>{goal.description}</Text>
              </View>
              {selectedGoal === goal.id && (
                <Ionicons name="checkmark-circle" size={24} color={colors.accent.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bottomCta}>
        <PrimaryButton title="Save Goal" onPress={() => router.back()} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: spacing.xxl,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    marginBottom: spacing.xxxl,
  },
  goalsContainer: {
    gap: spacing.md,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalCardSelected: {
    borderColor: colors.accent.primary,
    backgroundColor: `${colors.accent.primary}10`,
  },
  goalContent: {
    flex: 1,
  },
  goalLabel: {
    ...typography.h3,
    color: colors.text.primary,
  },
  goalLabelSelected: {
    color: colors.accent.primary,
  },
  goalDescription: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  bottomCta: {
    paddingVertical: spacing.lg,
  },
});
