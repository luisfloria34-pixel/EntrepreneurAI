import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, SectionHeader } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { allBadges } from '../src/data/dummyData';

export default function BadgesScreen() {
  const router = useRouter();
  const earnedBadges = allBadges.filter(b => b.earned);
  const lockedBadges = allBadges.filter(b => !b.earned);

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title="Badges" />
      
      <View style={styles.summary}>
        <Text style={styles.summaryValue}>{earnedBadges.length}/{allBadges.length}</Text>
        <Text style={styles.summaryLabel}>Badges Earned</Text>
      </View>

      <SectionHeader title="Earned" />
      <View style={styles.badgesGrid}>
        {earnedBadges.map((badge) => (
          <TouchableOpacity 
            key={badge.id}
            style={styles.badgeCard}
            onPress={() => router.push(`/badge/${badge.id}`)}
          >
            <View style={[styles.badgeIcon, { backgroundColor: `${badge.color}20` }]}>
              <Ionicons name={badge.icon as keyof typeof Ionicons.glyphMap} size={28} color={badge.color} />
            </View>
            <Text style={styles.badgeName}>{badge.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionHeader title="Locked" />
      <View style={styles.badgesGrid}>
        {lockedBadges.map((badge) => (
          <TouchableOpacity 
            key={badge.id}
            style={[styles.badgeCard, styles.badgeCardLocked]}
            onPress={() => router.push(`/badge/${badge.id}`)}
          >
            <View style={[styles.badgeIcon, styles.badgeIconLocked]}>
              <Ionicons name={badge.icon as keyof typeof Ionicons.glyphMap} size={28} color={colors.text.tertiary} />
            </View>
            <Text style={[styles.badgeName, styles.badgeNameLocked]}>{badge.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  summary: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  summaryValue: {
    ...typography.display,
    color: colors.accent.primary,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  badgeCard: {
    width: '30%',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  badgeIconLocked: {
    backgroundColor: colors.background.tertiary,
  },
  badgeName: {
    ...typography.caption,
    color: colors.text.primary,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: colors.text.tertiary,
  },
});
