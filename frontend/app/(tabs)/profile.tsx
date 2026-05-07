import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, SectionHeader } from '../../src/components';
import { colors, spacing, typography, radius, shadows } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { settingsGroups } from '../../src/data/profileMock';
import { useProfile } from '../../src/hooks/useProfile';
import { useProofs } from '../../src/hooks/useProofs';
import { useBadges } from '../../src/hooks/useBadges';
import { useAuth } from '../../src/context/AuthContext';
import { getIsPro } from '../../src/services/proStatus';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [isPro, setIsPro] = React.useState(false);
  React.useEffect(() => { getIsPro().then(setIsPro); }, []);
  const { profile, loading: profileLoading } = useProfile();
  const { proofs, loading: proofsLoading } = useProofs();
  const { badges, earnedCount, loading: badgesLoading } = useBadges();

  const name = profile?.name ?? user?.email?.split('@')[0] ?? 'User';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const handle = `@${name.toLowerCase().replace(/\s+/g, '')}`;

  const hustleScore = profile?.hustle_score ?? 0;
  const streak = profile?.streak ?? 0;
  const level = profile?.level ?? 1;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my progress on EntrepreneurAI! 🚀\n\n📊 Hustle Score: ${hustleScore}\n🔥 ${streak} Day Streak\n\n${handle}`,
      });
    } catch (_) {}
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ScreenWrapper scroll>
      {/* ===== PROFILE HEADER ===== */}
      <View style={styles.headerSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {profileLoading ? (
              <ActivityIndicator color={colors.text.inverse} />
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusEmoji}>{streak > 0 ? '🔥' : '🚀'}</Text>
          </View>
        </View>

        <Text style={styles.userName}>{profileLoading ? '...' : name}</Text>
        <Text style={styles.userHandle}>{handle}</Text>

        {streak > 0 && (
          <View style={styles.statusContainer}>
            <Ionicons name="flame" size={14} color={colors.semantic.warning} />
            <Text style={styles.statusText}>On a {streak}-day streak!</Text>
          </View>
        )}

        {/* Pro / Upgrade banner */}
        {isPro ? (
          <View style={styles.proBanner}>
            <Ionicons name="diamond" size={16} color={colors.accent.primary} />
            <Text style={styles.proBannerText}>EntrepeneuerAI Pro ✓</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.upgradeBanner} onPress={() => router.push('/paywall')}>
            <Ionicons name="flash" size={16} color="#F59E0B" />
            <Text style={styles.upgradeBannerText}>Upgrade to Pro ⚡</Text>
            <Ionicons name="chevron-forward" size={14} color="#F59E0B" />
          </TouchableOpacity>
        )}

        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/settings/edit-profile')}
          >
            <Ionicons name="pencil" size={16} color={colors.text.primary} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={16} color={colors.accent.primary} />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== STATS GRID ===== */}
      <View style={styles.statsSection}>
        <SectionHeader
          title="Your Stats"
          actionText="View Analytics"
          onAction={() => router.push('/analytics')}
        />
        <View style={styles.statsGrid}>
          <StatCard value={hustleScore} label="Hustle Score" icon="flash" color={colors.accent.primary} />
          <StatCard value={streak} label="Day Streak" icon="flame" color={colors.semantic.warning} />
          <StatCard value={level} label="Level" icon="ribbon" color={colors.semantic.purple} />
          <StatCard value={0} label="Lessons Done" icon="book" color={colors.semantic.success} />
          <StatCard value={0} label="Tasks Done" icon="checkmark-circle" color={colors.semantic.info} />
          <StatCard value={proofs.length} label="Proofs" icon="camera" color="#EC4899" />
        </View>
      </View>

      {/* ===== PROOF OF WORK ===== */}
      <View style={styles.proofSection}>
        <SectionHeader
          title="Proof of Work"
          actionText={proofs.length > 0 ? `${proofs.length} total` : undefined}
          onAction={proofs.length > 0 ? () => router.push('/proofs') : undefined}
        />
        <View style={styles.proofCard}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.proofScroll}
          >
            {proofsLoading ? (
              <View style={styles.proofLoadingContainer}>
                <ActivityIndicator color={colors.accent.primary} />
              </View>
            ) : (
              proofs.slice(0, 3).map((proof) => (
                <TouchableOpacity
                  key={proof.id}
                  style={styles.proofThumbnail}
                  onPress={() => router.push('/proofs')}
                >
                  <View style={styles.proofPlaceholder}>
                    <Ionicons name="image" size={24} color={colors.text.tertiary} />
                  </View>
                  <Text style={styles.proofTitle} numberOfLines={1}>
                    {proof.title ?? 'Proof'}
                  </Text>
                </TouchableOpacity>
              ))
            )}

            <TouchableOpacity
              style={styles.uploadThumbnail}
              onPress={() => router.push('/proof-upload')}
            >
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="add" size={32} color={colors.accent.primary} />
              </View>
              <Text style={styles.uploadText}>Upload</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* ===== BADGES ===== */}
      <View style={styles.badgesSection}>
        <SectionHeader
          title="Badges"
          actionText={`${earnedCount} earned`}
          onAction={() => router.push('/badges')}
        />
        {badgesLoading ? (
          <ActivityIndicator color={colors.accent.primary} style={{ marginVertical: spacing.lg }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesScroll}
          >
            {badges.map((badge) => (
              <TouchableOpacity
                key={badge.id}
                style={styles.badgeItem}
                onPress={() => router.push('/badges')}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.badgeCircle,
                    badge.earned
                      ? { backgroundColor: `${badge.color}20`, borderColor: badge.color }
                      : styles.badgeLocked,
                  ]}
                >
                  {badge.earned ? (
                    <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                  ) : (
                    <>
                      <Text style={styles.badgeEmojiLocked}>{badge.emoji}</Text>
                      <View style={styles.lockOverlay}>
                        <Ionicons name="lock-closed" size={12} color={colors.text.muted} />
                      </View>
                    </>
                  )}
                </View>
                <Text style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]} numberOfLines={1}>
                  {badge.name}
                </Text>
                <Text style={styles.badgeDesc} numberOfLines={1}>
                  {badge.earned ? 'Earned' : badge.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* ===== SETTINGS LIST ===== */}
      <View style={styles.settingsSection}>
        {settingsGroups.map((group) => (
          <View key={group.title} style={styles.settingsGroup}>
            <Text style={styles.settingsGroupTitle}>{group.title}</Text>
            <View style={styles.settingsCard}>
              {group.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingsItem,
                    itemIndex < group.items.length - 1 && styles.settingsItemBorder,
                  ]}
                  onPress={() => router.push(item.route as any)}
                >
                  <View style={styles.settingsItemLeft}>
                    <Ionicons
                      name={item.icon as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color={colors.text.secondary}
                    />
                    <Text style={styles.settingsItemText}>{item.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.semantic.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>EntrepreneurAI v1.0.0</Text>
    </ScreenWrapper>
  );
}

const StatCard = ({
  value,
  label,
  icon,
  color,
}: {
  value: number;
  label: string;
  icon: string;
  color: string;
}) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={18} color={color} />
    </View>
    <Text style={[styles.statValue, { color }]}>{value.toLocaleString()}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  headerSection: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
    marginBottom: spacing.xxl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: `${colors.accent.primary}40`,
  },
  avatarText: {
    ...typography.h1,
    color: colors.text.inverse,
  },
  statusBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background.primary,
  },
  statusEmoji: {
    fontSize: 18,
  },
  userName: {
    ...typography.h2,
    color: colors.text.primary,
  },
  userHandle: {
    ...typography.body,
    color: colors.accent.primary,
    marginTop: spacing.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.semantic.warning}15`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  statusText: {
    ...typography.caption,
    color: colors.semantic.warning,
  },
  proBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: `${colors.accent.primary}15`,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderRadius: radius.full, marginTop: spacing.lg,
    borderWidth: 1, borderColor: `${colors.accent.primary}40`,
  },
  proBannerText: { ...typography.smallMedium, color: colors.accent.primary, flex: 1 },
  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: '#F59E0B18',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderRadius: radius.full, marginTop: spacing.lg,
    borderWidth: 1, borderColor: '#F59E0B40',
  },
  upgradeBannerText: { ...typography.smallMedium, color: '#F59E0B', flex: 1 },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  editButtonText: {
    ...typography.smallMedium,
    color: colors.text.primary,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.accent.primary}15`,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  shareButtonText: {
    ...typography.smallMedium,
    color: colors.accent.primary,
  },

  statsSection: {
    marginBottom: spacing.xxl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    width: '31%',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
  },

  proofSection: {
    marginBottom: spacing.xxl,
  },
  proofCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  proofScroll: {
    gap: spacing.md,
  },
  proofLoadingContainer: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proofThumbnail: {
    alignItems: 'center',
    width: 80,
  },
  proofPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  proofTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  uploadThumbnail: {
    alignItems: 'center',
    width: 80,
  },
  uploadPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: `${colors.accent.primary}10`,
    borderWidth: 2,
    borderColor: colors.accent.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  uploadText: {
    ...typography.caption,
    color: colors.accent.primary,
  },

  badgesSection: {
    marginBottom: spacing.xxl,
  },
  badgesScroll: {
    gap: spacing.lg,
    paddingRight: spacing.lg,
  },
  badgeItem: {
    alignItems: 'center',
    width: 76,
  },
  badgeCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    position: 'relative',
  },
  badgeLocked: {
    backgroundColor: colors.background.tertiary,
    borderColor: colors.border.default,
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeEmojiLocked: {
    fontSize: 20,
    opacity: 0.3,
  },
  lockOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: radius.full,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  badgeName: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: colors.text.muted,
  },
  badgeDesc: {
    fontSize: 9,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 12,
  },

  settingsSection: {
    marginBottom: spacing.lg,
  },
  settingsGroup: {
    marginBottom: spacing.xl,
  },
  settingsGroupTitle: {
    ...typography.captionMedium,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
    marginLeft: spacing.sm,
  },
  settingsCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingsItemText: {
    ...typography.body,
    color: colors.text.primary,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.semantic.error}15`,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
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
