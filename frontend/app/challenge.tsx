import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton, Badge, ProgressBar } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../src/services/supabase';
import { useAuth } from '../src/context/AuthContext';
import * as Haptics from 'expo-haptics';

const DEFAULT_CHALLENGE = {
  title: 'Market Validation Sprint',
  description: 'Complete 3 market research activities and validate one business idea with the AI Coach.',
  xp: 150,
  time_limit: '24h',
  active_date: new Date().toISOString().split('T')[0],
};

const DEFAULT_TASKS = [
  { id: 'ct1', title: 'Complete a Market Research lesson', done: false },
  { id: 'ct2', title: 'Identify 3 competitors in your space', done: false },
  { id: 'ct3', title: 'Validate your idea with AI Coach', done: false },
];

interface ChallengeTask { id: string; title: string; done: boolean }

export default function ChallengeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [challenge, setChallenge] = useState<typeof DEFAULT_CHALLENGE | null>(null);
  const [tasks, setTasks] = useState<ChallengeTask[]>(DEFAULT_TASKS);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { loadChallenge(); }, []);

  async function loadChallenge() {
    setLoading(true);
    let { data, error } = await supabase
      .from('daily_challenge')
      .select('*')
      .eq('active_date', today)
      .maybeSingle();

    if (!data) {
      // No challenge for today — insert default
      const { data: inserted } = await supabase
        .from('daily_challenge')
        .insert({ ...DEFAULT_CHALLENGE })
        .select()
        .single();
      data = inserted;
    }

    if (data) setChallenge(data);
    setLoading(false);
  }

  const completedCount = tasks.filter(t => t.done).length;
  const progress = Math.round((completedCount / tasks.length) * 100);
  const allDone = completedCount === tasks.length;

  function toggleTask(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  async function handleComplete() {
    if (!allDone || !user || !challenge) return;
    setCompleting(true);

    const { data: prof } = await supabase
      .from('profiles')
      .select('hustle_score, total_xp')
      .eq('id', user.id)
      .single();

    if (prof) {
      await supabase.from('profiles').update({
        hustle_score: (prof.hustle_score ?? 0) + (challenge.xp ?? 150),
        total_xp: (prof.total_xp ?? 0) + (challenge.xp ?? 150),
      }).eq('id', user.id);

      await supabase.from('xp_history').insert({
        user_id: user.id,
        xp: challenge.xp ?? 150,
        reason: `Completed daily challenge: ${challenge.title}`,
      });
    }

    setCompleting(false);
    Alert.alert('🎉 Challenge Complete!', `+${challenge.xp} XP earned!`, [
      { text: 'Awesome!', onPress: () => router.back() },
    ]);
  }

  if (loading) {
    return (
      <ScreenWrapper>
        <AppHeader showBack onBack={() => router.back()} title="Daily Challenge" />
        <View style={styles.loading}><ActivityIndicator color={colors.accent.primary} /></View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title="Daily Challenge" />

      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="flash" size={48} color="#F59E0B" />
        </View>
        <Badge label={`+${challenge?.xp ?? 150} XP`} variant="warning" />
        <Text style={styles.title}>{challenge?.title ?? DEFAULT_CHALLENGE.title}</Text>
        <Text style={styles.description}>{challenge?.description ?? DEFAULT_CHALLENGE.description}</Text>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.timeText}>Resets in 24h</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <ProgressBar
          progress={progress}
          label="Challenge Progress"
          showPercentage
          height={8}
          color="#F59E0B"
        />
        <Text style={styles.progressText}>{completedCount}/{tasks.length} tasks complete</Text>
      </View>

      <View style={styles.tasksSection}>
        <Text style={styles.tasksTitle}>Tasks</Text>
        {tasks.map(task => (
          <TouchableOpacity
            key={task.id}
            style={[styles.taskItem, task.done && styles.taskItemDone]}
            onPress={() => toggleTask(task.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.taskCheck, task.done && styles.taskCheckDone]}>
              {task.done && <Ionicons name="checkmark" size={16} color={colors.text.inverse} />}
            </View>
            <Text style={[styles.taskText, task.done && styles.taskTextDone]}>{task.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {allDone ? (
        <View style={styles.cta}>
          <PrimaryButton
            title={completing ? 'Claiming XP...' : `Claim +${challenge?.xp ?? 150} XP 🎉`}
            onPress={handleComplete}
            disabled={completing}
          />
        </View>
      ) : (
        <View style={styles.ctaDisabled}>
          <Text style={styles.ctaHint}>Complete all tasks to claim your XP reward</Text>
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { alignItems: 'center', paddingVertical: spacing.xxl },
  iconContainer: {
    width: 96, height: 96, borderRadius: radius.full,
    backgroundColor: '#F59E0B20', alignItems: 'center',
    justifyContent: 'center', marginBottom: spacing.lg,
  },
  title: { ...typography.h1, color: colors.text.primary, textAlign: 'center', marginTop: spacing.md },
  description: { ...typography.body, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md },
  timeText: { ...typography.small, color: colors.text.secondary },
  progressSection: {
    backgroundColor: colors.background.card, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.xl,
  },
  progressText: { ...typography.caption, color: colors.text.tertiary, marginTop: spacing.sm, textAlign: 'center' },
  tasksSection: { marginBottom: spacing.xl },
  tasksTitle: { ...typography.h3, color: colors.text.primary, marginBottom: spacing.md },
  taskItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.background.card, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border.default,
  },
  taskItemDone: { borderColor: colors.semantic.success, backgroundColor: `${colors.semantic.success}08` },
  taskCheck: {
    width: 28, height: 28, borderRadius: radius.full,
    borderWidth: 2, borderColor: colors.border.light,
    alignItems: 'center', justifyContent: 'center',
  },
  taskCheckDone: { backgroundColor: colors.semantic.success, borderColor: colors.semantic.success },
  taskText: { ...typography.body, color: colors.text.primary, flex: 1 },
  taskTextDone: { color: colors.text.secondary, textDecorationLine: 'line-through' },
  cta: { marginBottom: spacing.xl },
  ctaDisabled: { alignItems: 'center', padding: spacing.lg },
  ctaHint: { ...typography.small, color: colors.text.muted, textAlign: 'center' },
});
