import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, SectionHeader } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../src/hooks/useProfile';
import { useAnalytics } from '../src/hooks/useAnalytics';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AnalyticsScreen() {
  const router = useRouter();
  const { profile, loading: profileLoading } = useProfile();
  const { data, loading: analyticsLoading } = useAnalytics();

  const loading = profileLoading || analyticsLoading;

  const hustleScore = profile?.hustle_score ?? 0;
  const streak = profile?.streak ?? 0;
  const level = profile?.level ?? 1;
  const totalXP = profile?.total_xp ?? 0;

  const maxXP = Math.max(...data.weeklyXP.map(d => d.xp), 1);

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title="Analytics" />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.accent.primary} />
        </View>
      ) : (
        <>
          {/* Overview Cards */}
          <View style={styles.overviewGrid}>
            <View style={styles.overviewCard}>
              <View style={[styles.overviewIcon, { backgroundColor: `${colors.accent.primary}20` }]}>
                <Ionicons name="trophy" size={24} color={colors.accent.primary} />
              </View>
              <Text style={styles.overviewValue}>{hustleScore.toLocaleString()}</Text>
              <Text style={styles.overviewLabel}>Hustle Score</Text>
            </View>
            <View style={styles.overviewCard}>
              <View style={[styles.overviewIcon, { backgroundColor: '#F59E0B20' }]}>
                <Ionicons name="flame" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.overviewValue}>{streak}</Text>
              <Text style={styles.overviewLabel}>Day Streak</Text>
            </View>
            <View style={styles.overviewCard}>
              <View style={[styles.overviewIcon, { backgroundColor: `${colors.semantic.success}20` }]}>
                <Ionicons name="flash" size={24} color={colors.semantic.success} />
              </View>
              <Text style={styles.overviewValue}>{totalXP.toLocaleString()}</Text>
              <Text style={styles.overviewLabel}>Total XP</Text>
            </View>
            <View style={styles.overviewCard}>
              <View style={[styles.overviewIcon, { backgroundColor: `${colors.semantic.purple}20` }]}>
                <Ionicons name="ribbon" size={24} color={colors.semantic.purple} />
              </View>
              <Text style={styles.overviewValue}>{level}</Text>
              <Text style={styles.overviewLabel}>Level</Text>
            </View>
          </View>

          {/* Weekly XP Chart */}
          <SectionHeader title="Weekly XP" />
          <View style={styles.chartCard}>
            <View style={styles.chart}>
              {data.weeklyXP.map((entry, index) => (
                <View key={index} style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      { height: `${(entry.xp / maxXP) * 100}%` },
                    ]}
                  />
                  <Text style={styles.barLabel}>{entry.day}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartSummary}>
              <Text style={styles.chartTotal}>{data.weeklyTotal} XP</Text>
              <Text style={styles.chartSubtitle}>This week</Text>
            </View>
          </View>

          {/* Streak Calendar */}
          <SectionHeader title="Streak Calendar" />
          <View style={styles.calendarCard}>
            <View style={styles.calendarGrid}>
              {data.streakCalendar.map((day, index) => (
                <View
                  key={index}
                  style={[
                    styles.calendarDay,
                    day.completed && styles.calendarDayCompleted,
                  ]}
                />
              ))}
            </View>
            <View style={styles.calendarLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.background.tertiary }]} />
                <Text style={styles.legendText}>Missed</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.accent.primary }]} />
                <Text style={styles.legendText}>Completed</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.section,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  overviewCard: {
    width: '48%',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  overviewIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  overviewValue: {
    ...typography.h2,
    color: colors.text.primary,
  },
  overviewLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  chartCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: spacing.lg,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    backgroundColor: colors.accent.primary,
    borderRadius: radius.sm,
    minHeight: 8,
  },
  barLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  chartSummary: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  chartTotal: {
    ...typography.h2,
    color: colors.accent.primary,
  },
  chartSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  calendarCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  calendarDay: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.background.tertiary,
  },
  calendarDayCompleted: {
    backgroundColor: colors.accent.primary,
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xxl,
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: radius.xs,
  },
  legendText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
