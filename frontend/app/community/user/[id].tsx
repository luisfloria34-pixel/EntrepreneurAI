import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton, Badge } from '../../../src/components';
import { colors, spacing, typography, radius } from '../../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} />
      
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>J</Text>
        </View>
        <Text style={styles.userName}>Jessica Miller</Text>
        <Text style={styles.userBio}>Building the future of wellness tech</Text>
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3,240</Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </View>

        <PrimaryButton title="Follow" onPress={() => {}} style={styles.followButton} />
      </View>

      <Text style={styles.sectionTitle}>Badges</Text>
      <View style={styles.badgesRow}>
        <View style={[styles.badgeItem, { backgroundColor: '#F59E0B20' }]}>
          <Ionicons name="sunny" size={24} color="#F59E0B" />
        </View>
        <View style={[styles.badgeItem, { backgroundColor: '#10B98120' }]}>
          <Ionicons name="school" size={24} color="#10B981" />
        </View>
        <View style={[styles.badgeItem, { backgroundColor: '#EF444420' }]}>
          <Ionicons name="flame" size={24} color="#EF4444" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityCard}>
        <Text style={styles.activityText}>Completed "Startup Fundamentals" course</Text>
        <Text style={styles.activityTime}>2 days ago</Text>
      </View>
      <View style={styles.activityCard}>
        <Text style={styles.activityText}>Earned "First Course" badge</Text>
        <Text style={styles.activityTime}>2 days ago</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.h1,
    color: colors.text.inverse,
  },
  userName: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  userBio: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    marginTop: spacing.xxl,
    gap: spacing.xxxl,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.default,
  },
  statValue: {
    ...typography.h2,
    color: colors.accent.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  followButton: {
    marginTop: spacing.xxl,
    width: '60%',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxxl,
  },
  badgeItem: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  activityText: {
    ...typography.body,
    color: colors.text.primary,
  },
  activityTime: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
});
