import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, SectionHeader } from '../../src/components';
import { colors, spacing, typography, radius, shadows } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { profileData, settingsGroups } from '../../src/data/profileMock';
import { useOnboarding } from '../../src/context/OnboardingContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile: hustleProfile } = useOnboarding();
  
  const earnedBadges = profileData.badges.filter(b => b.earned);
  const lockedBadges = profileData.badges.filter(b => !b.earned);
  const nextCertificate = profileData.certificates.find(c => c.status === 'in_progress');

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my progress on EntrepreneurAI! 🚀\n\n📊 Hustle Score: ${profileData.stats.hustleScore}\n🔥 ${profileData.stats.currentStreak} Day Streak\n🎓 ${profileData.stats.lessonsDone} Lessons Done\n\n@${profileData.handle}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScreenWrapper scroll>
      {/* ===== A) PROFILE HEADER ===== */}
      <View style={styles.headerSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profileData.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusEmoji}>{profileData.statusEmoji}</Text>
          </View>
        </View>
        
        <Text style={styles.userName}>{profileData.name}</Text>
        <Text style={styles.userHandle}>{profileData.handle}</Text>
        <Text style={styles.userBio}>{profileData.bio}</Text>
        
        <View style={styles.statusContainer}>
          <Ionicons name="flame" size={14} color={colors.semantic.warning} />
          <Text style={styles.statusText}>{profileData.statusText}</Text>
        </View>
        
        {/* Header Buttons */}
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push('/settings/edit-profile')}
          >
            <Ionicons name="pencil" size={16} color={colors.text.primary} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={16} color={colors.accent.primary} />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== B) MISSION CARD ===== */}
      <View style={styles.missionCard}>
        <View style={styles.missionHeader}>
          <View style={styles.missionIcon}>
            <Ionicons name="flag" size={20} color={colors.accent.primary} />
          </View>
          <View style={styles.missionTitleContainer}>
            <Text style={styles.missionLabel}>Current Mission</Text>
            <Text style={styles.missionDeadline}>{profileData.mission.daysLeft} days left</Text>
          </View>
        </View>
        
        <Text style={styles.missionText}>{profileData.mission.text}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${profileData.mission.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{profileData.mission.progress}%</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.missionButton}
          onPress={() => router.push('/settings/goals')}
        >
          <Ionicons name="create-outline" size={16} color={colors.accent.primary} />
          <Text style={styles.missionButtonText}>Update Goal</Text>
        </TouchableOpacity>
      </View>

      {/* ===== C) STATS GRID ===== */}
      <View style={styles.statsSection}>
        <SectionHeader 
          title="Your Stats" 
          actionText="View Analytics"
          onAction={() => router.push('/analytics')}
        />
        <View style={styles.statsGrid}>
          <StatCard 
            value={hustleProfile?.hustleScore || profileData.stats.hustleScore} 
            label="Hustle Score" 
            icon="flash"
            color={colors.accent.primary}
          />
          <StatCard 
            value={profileData.stats.currentStreak} 
            label="Day Streak" 
            icon="flame"
            color={colors.semantic.warning}
          />
          <StatCard 
            value={profileData.stats.lessonsDone} 
            label="Lessons Done" 
            icon="book"
            color={colors.semantic.success}
          />
          <StatCard 
            value={profileData.stats.tasksDone} 
            label="Tasks Done" 
            icon="checkmark-circle"
            color={colors.semantic.info}
          />
          <StatCard 
            value={profileData.stats.proofsUploaded} 
            label="Proofs" 
            icon="camera"
            color={colors.semantic.purple}
          />
          <StatCard 
            value={profileData.stats.bestStreak} 
            label="Best Streak" 
            icon="trophy"
            color="#EC4899"
          />
        </View>
      </View>

      {/* ===== D) PORTFOLIO / PROOF-OF-WORK ===== */}
      <View style={styles.proofSection}>
        <SectionHeader 
          title="Proof of Work" 
          actionText={`${profileData.totalProofs} total`}
          onAction={() => router.push('/proofs')}
        />
        <View style={styles.proofCard}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.proofScroll}
          >
            {profileData.proofs.slice(0, 3).map((proof) => (
              <TouchableOpacity 
                key={proof.id} 
                style={styles.proofThumbnail}
                onPress={() => router.push('/proofs')}
              >
                <View style={styles.proofPlaceholder}>
                  <Ionicons 
                    name={proof.type === 'video' ? 'play-circle' : 'image'} 
                    size={24} 
                    color={colors.text.tertiary} 
                  />
                </View>
                <Text style={styles.proofTitle} numberOfLines={1}>{proof.title}</Text>
              </TouchableOpacity>
            ))}
            
            {/* Upload Button */}
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

      {/* ===== E) BADGES SECTION ===== */}
      <View style={styles.badgesSection}>
        <SectionHeader 
          title="Badges" 
          actionText={`${earnedBadges.length} earned`}
          onAction={() => router.push('/badges')}
        />
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgesScroll}
        >
          {/* Earned Badges */}
          {earnedBadges.map((badge) => (
            <TouchableOpacity 
              key={badge.id}
              style={styles.badgeItem}
              onPress={() => router.push(`/badge/${badge.id}`)}
            >
              <View style={[styles.badgeCircle, { backgroundColor: `${badge.color}20`, borderColor: badge.color }]}>
                <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
              </View>
              <Text style={styles.badgeName} numberOfLines={1}>{badge.name}</Text>
            </TouchableOpacity>
          ))}
          
          {/* Locked Badges (show first 3) */}
          {lockedBadges.slice(0, 3).map((badge) => (
            <TouchableOpacity 
              key={badge.id}
              style={styles.badgeItem}
              onPress={() => router.push('/badges')}
            >
              <View style={[styles.badgeCircle, styles.badgeLocked]}>
                <Ionicons name="lock-closed" size={20} color={colors.text.muted} />
              </View>
              <Text style={[styles.badgeName, styles.badgeNameLocked]} numberOfLines={1}>{badge.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ===== F) CERTIFICATES CARD ===== */}
      {nextCertificate && (
        <View style={styles.certificateSection}>
          <SectionHeader title="Certificates" />
          <View style={styles.certificateCard}>
            <View style={styles.certificateIcon}>
              <Ionicons name="ribbon" size={28} color={colors.semantic.warning} />
            </View>
            <View style={styles.certificateInfo}>
              <Text style={styles.certificateLabel}>Next Certificate</Text>
              <Text style={styles.certificateName}>{nextCertificate.name}</Text>
              <View style={styles.certificateProgress}>
                <View style={styles.certProgressBar}>
                  <View style={[styles.certProgressFill, { width: `${nextCertificate.progress}%` }]} />
                </View>
                <Text style={styles.certProgressText}>
                  {nextCertificate.lessonsLeft} lessons left
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => router.push(`/course/${nextCertificate.courseId}`)}
            >
              <Text style={styles.continueText}>Continue</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.text.inverse} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ===== G) SETTINGS LIST ===== */}
      <View style={styles.settingsSection}>
        {settingsGroups.map((group, groupIndex) => (
          <View key={group.title} style={styles.settingsGroup}>
            <Text style={styles.settingsGroupTitle}>{group.title}</Text>
            <View style={styles.settingsCard}>
              {group.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={item.id}
                  style={[
                    styles.settingsItem,
                    itemIndex < group.items.length - 1 && styles.settingsItemBorder
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

// Stat Card Component
const StatCard = ({ value, label, icon, color }: { value: number; label: string; icon: string; color: string }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={18} color={color} />
    </View>
    <Text style={[styles.statValue, { color }]}>{value.toLocaleString()}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  // ===== HEADER SECTION =====
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
  userBio: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xxl,
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

  // ===== MISSION CARD =====
  missionCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  missionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  missionTitleContainer: {
    flex: 1,
  },
  missionLabel: {
    ...typography.smallMedium,
    color: colors.text.secondary,
  },
  missionDeadline: {
    ...typography.caption,
    color: colors.semantic.warning,
    marginTop: spacing.xs,
  },
  missionText: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: radius.full,
  },
  progressText: {
    ...typography.captionMedium,
    color: colors.accent.primary,
    minWidth: 40,
  },
  missionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: `${colors.accent.primary}10`,
  },
  missionButtonText: {
    ...typography.smallMedium,
    color: colors.accent.primary,
  },

  // ===== STATS SECTION =====
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

  // ===== PROOF SECTION =====
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

  // ===== BADGES SECTION =====
  badgesSection: {
    marginBottom: spacing.xxl,
  },
  badgesScroll: {
    gap: spacing.lg,
    paddingRight: spacing.lg,
  },
  badgeItem: {
    alignItems: 'center',
    width: 72,
  },
  badgeCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
  },
  badgeLocked: {
    backgroundColor: colors.background.tertiary,
    borderColor: colors.border.default,
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeName: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: colors.text.muted,
  },

  // ===== CERTIFICATE SECTION =====
  certificateSection: {
    marginBottom: spacing.xxl,
  },
  certificateCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${colors.semantic.warning}30`,
  },
  certificateIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: `${colors.semantic.warning}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  certificateName: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  certificateProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  certProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  certProgressFill: {
    height: '100%',
    backgroundColor: colors.semantic.warning,
    borderRadius: radius.full,
  },
  certProgressText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.semantic.warning,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  continueText: {
    ...typography.smallMedium,
    color: colors.text.inverse,
  },

  // ===== SETTINGS SECTION =====
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

  // ===== LOGOUT & VERSION =====
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
