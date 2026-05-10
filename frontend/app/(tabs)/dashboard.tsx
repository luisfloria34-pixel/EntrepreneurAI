import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScreenWrapper, Badge, SectionHeader } from '../../src/components';
import { spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../../src/hooks/useProfile';
import { useDailyTasks } from '../../src/hooks/useDailyTasks';
import { getIsPro } from '../../src/services/proStatus';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

function getTimeGreeting(h: number) {
  if (h >= 5 && h < 9)  return 'Rise & Grind';
  if (h >= 9 && h < 12) return 'Good Morning';
  if (h >= 12 && h < 14) return 'Good Afternoon';
  if (h >= 14 && h < 18) return 'Keep Pushing';
  if (h >= 18 && h < 21) return 'Good Evening';
  if (h >= 21)           return 'Still Hustling';
  return 'Midnight Grind';
}

function getTimeEmoji(h: number) {
  if (h >= 5 && h < 9)  return '🌅';
  if (h >= 9 && h < 12) return '☕';
  if (h >= 12 && h < 14) return '⚡';
  if (h >= 14 && h < 18) return '🔥';
  if (h >= 18 && h < 21) return '🌙';
  if (h >= 21)           return '🦉';
  return '🌙';
}

const QUICK_ACTIONS = [
  { id: '1', title: 'Challenge', icon: 'flash', gradient: ['#F59E0B', '#EF4444'] as [string, string], route: '/challenge' },
  { id: '2', title: 'AI Coach', icon: 'chatbubbles', gradient: ['#00D4FF', '#7C3AED'] as [string, string], route: '/(tabs)/coach' },
  { id: '3', title: 'Community', icon: 'people', gradient: ['#8B5CF6', '#EC4899'] as [string, string], route: '/community' },
  { id: '4', title: 'Analytics', icon: 'stats-chart', gradient: ['#10B981', '#059669'] as [string, string], route: '/analytics' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { profile, loading: profileLoading, refetch } = useProfile();
  const { tasks, loading: tasksLoading, toggleTask } = useDailyTasks();
  const [refreshing, setRefreshing] = useState(false);
  const [isPro, setIsPro] = useState(false);
  React.useEffect(() => { getIsPro().then(setIsPro); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const hour = new Date().getHours();
  const firstName = profile?.name?.split(' ')[0] ?? 'there';
  const hustleScore = profile?.hustle_score ?? 0;
  const level = profile?.level ?? 1;
  const streak = profile?.streak ?? 0;
  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background.primary }}
      contentContainerStyle={{ paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00D4FF" />}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xxl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ ...typography.small, color: colors.text.tertiary, letterSpacing: 0.5 }}>
              {getTimeGreeting(hour)} {getTimeEmoji(hour)}
            </Text>
            {profileLoading ? (
              <View style={{ width: 140, height: 34, borderRadius: radius.sm, backgroundColor: colors.border.default, marginTop: 6 }} />
            ) : (
              <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text.primary, letterSpacing: -0.5, marginTop: 4 }}>
                {firstName}
                {isPro && <Text style={{ color: '#00D4FF' }}> Pro ⚡</Text>}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push('/analytics')} style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: '#F59E0B18', paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
            borderRadius: radius.full, borderWidth: 1, borderColor: '#F59E0B30',
          }}>
            <Text style={{ fontSize: 16 }}>🔥</Text>
            {profileLoading
              ? <View style={{ width: 40, height: 14, borderRadius: 4, backgroundColor: '#F59E0B20' }} />
              : <Text style={{ ...typography.smallMedium, color: '#F59E0B' }}>{streak}d streak</Text>
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* Hustle Score Card — gradient border */}
      <TouchableOpacity
        onPress={() => router.push('/analytics')}
        activeOpacity={0.9}
        style={{ marginHorizontal: spacing.lg, marginBottom: spacing.lg }}
      >
        <LinearGradient
          colors={['#00D4FF', '#7C3AED']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ borderRadius: radius.xl + 2, padding: 1.5 }}
        >
          <View style={{ backgroundColor: isDark ? '#0D1526' : colors.background.card, borderRadius: radius.xl, padding: spacing.xl }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg }}>
              <View>
                <Text style={{ ...typography.small, color: colors.text.tertiary, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                  Hustle Score
                </Text>
                {profileLoading ? (
                  <View style={{ width: 100, height: 42, borderRadius: radius.sm, backgroundColor: colors.border.default, marginTop: 6 }} />
                ) : (
                  <Text style={{ fontSize: 42, fontWeight: '800', color: colors.text.primary, letterSpacing: -1, lineHeight: 50 }}>
                    {hustleScore.toLocaleString()}
                  </Text>
                )}
              </View>
              <View style={{
                backgroundColor: isDark ? '#00D4FF15' : '#00D4FF20',
                borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
                borderWidth: 1, borderColor: '#00D4FF30',
              }}>
                <Text style={{ ...typography.captionMedium, color: '#00D4FF' }}>LVL {level}</Text>
              </View>
            </View>

            {/* XP bar */}
            <View style={{ height: 4, backgroundColor: colors.border.default, borderRadius: 2, marginBottom: spacing.sm }}>
              <LinearGradient
                colors={['#00D4FF', '#7C3AED']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ width: `${(hustleScore % 1000) / 10}%`, height: '100%', borderRadius: 2 }}
              />
            </View>
            <Text style={{ ...typography.caption, color: colors.text.muted }}>
              {1000 - (hustleScore % 1000)} XP to Level {level + 1}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Daily Tasks strip */}
      <TouchableOpacity
        onPress={() => router.push('/tasks')}
        activeOpacity={0.85}
        style={{ marginHorizontal: spacing.lg, marginBottom: spacing.lg }}
      >
        <View style={{
          backgroundColor: colors.background.card, borderRadius: radius.lg,
          padding: spacing.lg, flexDirection: 'row', alignItems: 'center',
          borderWidth: 1, borderColor: colors.border.default,
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ ...typography.smallMedium, color: colors.text.secondary }}>Daily Tasks</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text.primary, marginTop: 2 }}>
              {tasksLoading ? '—' : `${completedTasks}/${tasks.length}`}
              <Text style={{ ...typography.small, color: colors.text.tertiary, fontWeight: '400' }}> done today</Text>
            </Text>
          </View>
          {/* Mini progress dots */}
          <View style={{ flexDirection: 'row', gap: 4, marginRight: spacing.md }}>
            {tasks.slice(0, 4).map((t, i) => (
              <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.completed ? '#10B981' : colors.border.default }} />
            ))}
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
        </View>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
        <SectionHeader title="Quick Actions" />
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          {QUICK_ACTIONS.map(action => (
            <TouchableOpacity
              key={action.id}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(action.route as any); }}
              activeOpacity={0.82}
              style={{ flex: 1, borderRadius: radius.lg, overflow: 'hidden' }}
            >
              <LinearGradient
                colors={action.gradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ padding: 1.2, borderRadius: radius.lg }}
              >
                <View style={{ backgroundColor: isDark ? '#0A0F1E' : colors.background.card, borderRadius: radius.lg - 1, alignItems: 'center', paddingVertical: spacing.lg }}>
                  <Ionicons name={action.icon as any} size={22} color={action.gradient[0]} />
                  <Text style={{ ...typography.caption, color: colors.text.secondary, marginTop: spacing.xs, textAlign: 'center' }}>
                    {action.title}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Today's Challenge */}
      <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
        <SectionHeader title="Today's Challenge" actionText="View" onAction={() => router.push('/challenge')} />
        <TouchableOpacity onPress={() => router.push('/challenge')} activeOpacity={0.85}>
          <LinearGradient
            colors={['#F59E0B18', '#EF444408']}
            style={{ borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: '#F59E0B30' }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View style={{ width: 48, height: 48, borderRadius: radius.md, backgroundColor: '#F59E0B20', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="flash" size={24} color="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...typography.bodyMedium, color: colors.text.primary }}>Market Validation Sprint</Text>
                <Text style={{ ...typography.small, color: colors.text.secondary, marginTop: 2 }}>
                  Complete 3 research activities
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm }}>
                  <Badge label="+150 XP" variant="warning" size="small" />
                  <Text style={{ ...typography.caption, color: colors.text.muted }}>24h left</Text>
                </View>
              </View>
              <Ionicons name="play-circle" size={32} color="#F59E0B" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Tasks list */}
      <View style={{ paddingHorizontal: spacing.lg }}>
        <SectionHeader title="Daily Tasks" actionText="All" onAction={() => router.push('/tasks')} />
        <View style={{ backgroundColor: colors.background.card, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border.default }}>
          {tasksLoading ? (
            <View style={{ padding: spacing.xl, alignItems: 'center' }}>
              <ActivityIndicator color="#00D4FF" />
            </View>
          ) : tasks.length === 0 ? (
            <View style={{ padding: spacing.xl, alignItems: 'center' }}>
              <Text style={{ fontSize: 28, marginBottom: spacing.sm }}>📋</Text>
              <Text style={{ ...typography.body, color: colors.text.tertiary }}>No tasks yet — check back soon!</Text>
            </View>
          ) : (
            tasks.slice(0, 3).map((task, i) => (
              <TouchableOpacity
                key={task.id}
                style={{
                  flexDirection: 'row', alignItems: 'center', padding: spacing.lg,
                  borderBottomWidth: i < Math.min(tasks.length, 3) - 1 ? 1 : 0,
                  borderBottomColor: colors.border.default,
                }}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleTask(task.id); }}
                activeOpacity={0.7}
              >
                {/* Checkbox */}
                <View style={{
                  width: 24, height: 24, borderRadius: 12,
                  borderWidth: 2, borderColor: task.completed ? '#10B981' : colors.border.light,
                  backgroundColor: task.completed ? '#10B981' : 'transparent',
                  alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
                }}>
                  {task.completed && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    ...typography.body, color: task.completed ? colors.text.tertiary : colors.text.primary,
                    textDecorationLine: task.completed ? 'line-through' : 'none',
                  }}>
                    {task.title}
                  </Text>
                </View>
                <View style={{
                  backgroundColor: task.completed ? '#10B98118' : colors.background.tertiary,
                  paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full,
                }}>
                  <Text style={{ ...typography.caption, color: task.completed ? '#10B981' : colors.text.muted, fontWeight: '600' }}>
                    +{task.xp}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
