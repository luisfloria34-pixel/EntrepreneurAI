import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { getIsPro, deactivatePro } from '../../src/services/proStatus';

const LOCKED_FEATURES = [
  { icon: 'chatbubbles-outline', text: 'Unlimited AI Coach messages' },
  { icon: 'school-outline', text: 'All courses (only 2 free)' },
  { icon: 'people-outline', text: 'Community posting & commenting' },
  { icon: 'ribbon-outline', text: 'Certificates of completion' },
  { icon: 'flame-outline', text: 'Streak protection' },
  { icon: 'analytics-outline', text: 'Advanced analytics' },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIsPro().then(v => { setIsPro(v); setLoading(false); });
  }, []);

  function handleCancel() {
    Alert.alert(
      'Cancel Subscription',
      'You can cancel in your App Store / Google Play subscription settings.',
      [
        { text: 'Open App Store', onPress: () => Linking.openURL('https://apps.apple.com/account/subscriptions') },
        { text: 'Open Play Store', onPress: () => Linking.openURL('https://play.google.com/store/account/subscriptions') },
        { text: 'Dismiss', style: 'cancel' },
      ],
    );
  }

  if (loading) return null;

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title="Subscription" />

      {isPro ? (
        <>
          {/* Pro active card */}
          <View style={styles.proCard}>
            <View style={styles.proHeader}>
              <Ionicons name="diamond" size={32} color={colors.accent.primary} />
              <View style={styles.proInfo}>
                <Text style={styles.proTitle}>EntrepeneuerAI Pro</Text>
                <Text style={styles.proStatus}>Active</Text>
              </View>
            </View>
            <View style={styles.proDivider} />
            <View style={styles.proDetail}>
              <Ionicons name="checkmark-circle" size={18} color={colors.semantic.success} />
              <Text style={styles.proDetailText}>All features unlocked</Text>
            </View>
            <View style={styles.proDetail}>
              <Ionicons name="infinite" size={18} color={colors.accent.primary} />
              <Text style={styles.proDetailText}>Unlimited AI Coach messages</Text>
            </View>
            <View style={styles.proDetail}>
              <Ionicons name="school" size={18} color={colors.accent.primary} />
              <Text style={styles.proDetailText}>All 50+ courses</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.restoreBtn} onPress={() => Alert.alert('Purchases Restored', 'Your purchases have been restored.')}>
            <Ionicons name="refresh-outline" size={18} color={colors.accent.primary} />
            <Text style={styles.restoreBtnText}>Restore Purchase</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>Cancel Subscription</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Free plan card */}
          <View style={styles.freeCard}>
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>FREE PLAN</Text>
            </View>
            <Text style={styles.freeTitle}>You're on the free plan</Text>
            <Text style={styles.freeSub}>Upgrade to unlock everything</Text>
          </View>

          <Text style={styles.lockedTitle}>Locked features</Text>
          <View style={styles.lockedList}>
            {LOCKED_FEATURES.map((f, i) => (
              <View key={i} style={[styles.lockedItem, i < LOCKED_FEATURES.length - 1 && styles.lockedItemBorder]}>
                <View style={styles.lockedIcon}>
                  <Ionicons name={f.icon as any} size={18} color={colors.text.muted} />
                </View>
                <Text style={styles.lockedText}>{f.text}</Text>
                <Ionicons name="lock-closed" size={14} color={colors.text.muted} />
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.upgradeBtn} onPress={() => router.push('/paywall')}>
            <Ionicons name="flash" size={20} color={colors.text.inverse} />
            <Text style={styles.upgradeBtnText}>Upgrade to Pro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.restoreBtn} onPress={() => Alert.alert('Purchases Restored', 'No active subscription found.')}>
            <Ionicons name="refresh-outline" size={18} color={colors.text.secondary} />
            <Text style={[styles.restoreBtnText, { color: colors.text.secondary }]}>Restore Purchase</Text>
          </TouchableOpacity>
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  proCard: {
    backgroundColor: `${colors.accent.primary}10`, borderRadius: radius.xl,
    padding: spacing.xl, marginTop: spacing.lg,
    borderWidth: 1, borderColor: `${colors.accent.primary}40`,
  },
  proHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.lg },
  proInfo: { flex: 1 },
  proTitle: { ...typography.h2, color: colors.text.primary },
  proStatus: { ...typography.small, color: colors.semantic.success, marginTop: spacing.xs },
  proDivider: { height: 1, backgroundColor: colors.border.default, marginBottom: spacing.lg },
  proDetail: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  proDetailText: { ...typography.body, color: colors.text.primary },
  restoreBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, marginTop: spacing.xl, padding: spacing.md,
  },
  restoreBtnText: { ...typography.bodyMedium, color: colors.accent.primary },
  cancelBtn: { alignItems: 'center', marginTop: spacing.md, padding: spacing.md },
  cancelBtnText: { ...typography.body, color: colors.semantic.error },
  freeCard: {
    backgroundColor: colors.background.card, borderRadius: radius.xl,
    padding: spacing.xl, marginTop: spacing.lg, alignItems: 'center',
  },
  planBadge: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: radius.full, marginBottom: spacing.md,
  },
  planBadgeText: { fontSize: 11, fontWeight: '700', color: colors.text.tertiary, letterSpacing: 0.8 },
  freeTitle: { ...typography.h2, color: colors.text.primary, marginBottom: spacing.xs },
  freeSub: { ...typography.body, color: colors.text.secondary },
  lockedTitle: { ...typography.h3, color: colors.text.primary, marginTop: spacing.xxl, marginBottom: spacing.md },
  lockedList: { backgroundColor: colors.background.card, borderRadius: radius.lg, overflow: 'hidden' },
  lockedItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.md, paddingHorizontal: spacing.lg,
  },
  lockedItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border.default },
  lockedIcon: {
    width: 32, height: 32, borderRadius: radius.md,
    backgroundColor: colors.background.tertiary, alignItems: 'center', justifyContent: 'center',
  },
  lockedText: { ...typography.body, color: colors.text.muted, flex: 1 },
  upgradeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    backgroundColor: colors.accent.primary, borderRadius: radius.xl,
    padding: spacing.xl, marginTop: spacing.xxl,
  },
  upgradeBtnText: { ...typography.h3, color: colors.text.inverse },
});
