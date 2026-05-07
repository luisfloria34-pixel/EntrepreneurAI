import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useBadges } from '../../src/hooks/useBadges';

export default function BadgeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { badges } = useBadges();
  const badge = badges.find(b => b.id === id) ?? badges[0];

  return (
    <ScreenWrapper>
      <AppHeader showBack onBack={() => router.back()} />
      
      <View style={styles.content}>
        <View style={[styles.badgeIcon, { backgroundColor: badge.earned ? `${badge.color}20` : colors.background.tertiary }]}>
          <Text style={{ fontSize: 64, opacity: badge.earned ? 1 : 0.3 }}>{badge?.emoji ?? '🏅'}</Text>
        </View>
        
        <Text style={styles.badgeName}>{badge.name}</Text>
        <Text style={styles.badgeDescription}>{badge.description}</Text>
        
        {badge.earned ? (
          <View style={styles.earnedInfo}>
            <Ionicons name="checkmark-circle" size={24} color={colors.semantic.success} />
            <Text style={styles.earnedText}>
              {badge.earnedAt ? `Earned on ${badge.earnedAt.split('T')[0]}` : 'Earned!'}
            </Text>
          </View>
        ) : (
          <View style={styles.lockedInfo}>
            <Ionicons name="lock-closed" size={24} color={colors.text.tertiary} />
            <Text style={styles.lockedText}>Complete the requirement to unlock</Text>
          </View>
        )}
      </View>

      <View style={styles.bottomCta}>
        <PrimaryButton 
          title={badge.earned ? "Share Badge" : "How to Earn"}
          onPress={() => {}}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.section,
  },
  badgeIcon: {
    width: 140,
    height: 140,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  badgeName: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
  },
  badgeDescription: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
    maxWidth: '80%',
  },
  earnedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
    backgroundColor: `${colors.semantic.success}15`,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  earnedText: {
    ...typography.smallMedium,
    color: colors.semantic.success,
  },
  lockedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  lockedText: {
    ...typography.smallMedium,
    color: colors.text.tertiary,
  },
  bottomCta: {
    paddingVertical: spacing.lg,
  },
});
