import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/services/supabase';
import { useAuth } from '../../src/context/AuthContext';

const DAILY_GOALS = [
  { id: 1, label: '1 task/day', description: 'Casual' },
  { id: 2, label: '2 tasks/day', description: 'Regular' },
  { id: 3, label: '3 tasks/day', description: 'Serious' },
  { id: 5, label: '5 tasks/day', description: 'Intense' },
];

const WEEKLY_GOALS = [
  { id: 5,  label: '5 days/week',  description: 'Easy pace' },
  { id: 10, label: '10 tasks/week', description: 'Balanced' },
  { id: 15, label: '15 tasks/week', description: 'Committed' },
  { id: 25, label: '25 tasks/week', description: 'Elite' },
];

export default function GoalsSettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [dailyGoal, setDailyGoal] = useState(3);
  const [weeklyGoal, setWeeklyGoal] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('daily_goal, weekly_goal').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setDailyGoal(data.daily_goal ?? 3);
          setWeeklyGoal(data.weekly_goal ?? 10);
        }
        setLoading(false);
      });
  }, [user]);

  async function handleSave() {
    if (!user || saving) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ daily_goal: dailyGoal, weekly_goal: weeklyGoal })
      .eq('id', user.id);
    setSaving(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.back();
    }
  }

  if (loading) {
    return (
      <ScreenWrapper>
        <AppHeader showBack onBack={() => router.back()} title="Learning Goals" />
        <View style={styles.loading}><ActivityIndicator color={colors.accent.primary} /></View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title="Learning Goals" />

      <Text style={styles.sectionTitle}>Daily Goal</Text>
      <Text style={styles.sectionSub}>How many tasks do you want to complete each day?</Text>
      <View style={styles.grid}>
        {DAILY_GOALS.map(g => {
          const sel = dailyGoal === g.id;
          return (
            <TouchableOpacity
              key={g.id}
              style={[styles.card, sel && styles.cardSelected]}
              onPress={() => setDailyGoal(g.id)}
            >
              <Text style={[styles.cardLabel, sel && styles.cardLabelSel]}>{g.label}</Text>
              <Text style={styles.cardDesc}>{g.description}</Text>
              {sel && <Ionicons name="checkmark-circle" size={20} color={colors.accent.primary} style={styles.check} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: spacing.xxl }]}>Weekly Goal</Text>
      <Text style={styles.sectionSub}>How many tasks do you want to complete each week?</Text>
      <View style={styles.grid}>
        {WEEKLY_GOALS.map(g => {
          const sel = weeklyGoal === g.id;
          return (
            <TouchableOpacity
              key={g.id}
              style={[styles.card, sel && styles.cardSelected]}
              onPress={() => setWeeklyGoal(g.id)}
            >
              <Text style={[styles.cardLabel, sel && styles.cardLabelSel]}>{g.label}</Text>
              <Text style={styles.cardDesc}>{g.description}</Text>
              {sel && <Ionicons name="checkmark-circle" size={20} color={colors.accent.primary} style={styles.check} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.cta}>
        <PrimaryButton title={saving ? 'Saving...' : 'Save Goals'} onPress={handleSave} disabled={saving} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { ...typography.h3, color: colors.text.primary, marginTop: spacing.xl },
  sectionSub: { ...typography.small, color: colors.text.secondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  grid: { gap: spacing.md },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg, padding: spacing.lg,
    borderWidth: 2, borderColor: 'transparent',
  },
  cardSelected: { borderColor: colors.accent.primary, backgroundColor: `${colors.accent.primary}10` },
  cardLabel: { ...typography.bodyMedium, color: colors.text.primary, flex: 1 },
  cardLabelSel: { color: colors.accent.primary },
  cardDesc: { ...typography.small, color: colors.text.secondary, marginRight: spacing.sm },
  check: {},
  cta: { marginTop: spacing.xxl, marginBottom: spacing.xl },
});
