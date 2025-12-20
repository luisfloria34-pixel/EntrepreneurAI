import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, ListItem, Badge, SectionHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { userData, allBadges } from '../../src/data/dummyData';

export default function ProfileScreen() {
  const router = useRouter();
  const earnedBadges = allBadges.filter(b => b.earned);

  return (
    <ScreenWrapper scroll>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <TouchableOpacity style={styles.editAvatarBtn}>
            <Ionicons name="camera" size={14} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        <Text style={styles.userBio}>{userData.bio}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsCard}>
        <TouchableOpacity style={styles.statItem} onPress={() => router.push('/analytics')}>
          <Text style={styles.statValue}>{userData.hustleScore.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Hustle Score</Text>
        </TouchableOpacity>
        <View style={styles.statDivider} />
        <TouchableOpacity style={styles.statItem} onPress={() => router.push('/analytics')}>
          <Text style={styles.statValue}>{userData.level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </TouchableOpacity>
        <View style={styles.statDivider} />
        <TouchableOpacity style={styles.statItem} onPress={() => router.push('/analytics')}>
          <Text style={styles.statValue}>{userData.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </TouchableOpacity>
      </View>

      {/* Badges */}
      <SectionHeader 
        title="Badges Earned" 
        actionText={`${earnedBadges.length} of ${allBadges.length}`}
        onAction={() => router.push('/badges')}
      />
      <View style={styles.badgesGrid}>
        {earnedBadges.slice(0, 4).map((badge) => (
          <TouchableOpacity 
            key={badge.id} 
            style={styles.badgeItem}
            onPress={() => router.push(`/badge/${badge.id}`)}
          >
            <View style={[styles.badgeIcon, { backgroundColor: `${badge.color}20` }]}>
              <Ionicons name={badge.icon as keyof typeof Ionicons.glyphMap} size={24} color={badge.color} />
            </View>
            <Text style={styles.badgeName} numberOfLines={1}>{badge.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings */}
      <SectionHeader title="Settings" />
      <View style={styles.settingsCard}>
        <ListItem
          title="Notifications"
          leftIcon="notifications-outline"
          onPress={() => router.push('/settings/notifications')}
        />
        <ListItem
          title="Learning Goals"
          leftIcon="flag-outline"
          onPress={() => router.push('/settings/goals')}
        />
        <ListItem
          title="Privacy"
          leftIcon="shield-outline"
          onPress={() => router.push('/settings/privacy')}
        />
        <ListItem
          title="Help & Support"
          leftIcon="help-circle-outline"
          onPress={() => router.push('/settings/help')}
        />
        <ListItem
          title="About"
          leftIcon="information-circle-outline"
          onPress={() => router.push('/settings/about')}
          showDivider={false}
        />
      </View>

      {/* Logout */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => router.replace('/')}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.semantic.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>EntrepreneurAI v1.0.0</Text>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
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
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background.primary,
  },
  userName: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  userEmail: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  userBio: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginTop: spacing.lg,
  },
  statItem: {
    flex: 1,
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
  badgesGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  badgeItem: {
    flex: 1,
    alignItems: 'center',
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  badgeName: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  settingsCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.semantic.error}15`,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.xxl,
    gap: spacing.sm,
  },
  logoutText: {
    ...typography.bodyMedium,
    color: colors.semantic.error,
  },
  version: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
});
