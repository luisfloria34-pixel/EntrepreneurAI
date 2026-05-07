import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { PACKAGE_TYPE } from 'react-native-purchases';
import { ScreenWrapper } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { usePurchases } from '../src/context/PurchasesContext';

const FEATURES = [
  { icon: 'infinite', text: 'Unlimited AI Coach conversations' },
  { icon: 'school', text: 'All courses unlocked' },
  { icon: 'analytics', text: 'Advanced analytics & insights' },
  { icon: 'flash', text: 'Daily challenges & bonus XP' },
  { icon: 'people', text: 'Full community access' },
  { icon: 'ribbon', text: 'Exclusive Pro badges' },
];

const PLAN_ORDER = [PACKAGE_TYPE.LIFETIME, PACKAGE_TYPE.ANNUAL, PACKAGE_TYPE.MONTHLY];

export default function PaywallScreen() {
  const router = useRouter();
  const { offering, purchase, restore, loading, isPro } = usePurchases();
  const [selectedIndex, setSelectedIndex] = useState(1); // default: yearly
  const [purchasing, setPurchasing] = useState(false);

  // Use RevenueCatUI paywall if configured in dashboard, fall back to custom UI
  const handleNativePaywall = async () => {
    const result = await RevenueCatUI.presentPaywall({
      offering: offering ?? undefined,
    });
    if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
      router.back();
    }
  };

  const packages = (offering?.availablePackages ?? []).sort((a, b) => {
    return PLAN_ORDER.indexOf(a.packageType) - PLAN_ORDER.indexOf(b.packageType);
  });

  const selectedPackage = packages[selectedIndex] ?? packages[0];

  async function handlePurchase() {
    if (!selectedPackage || purchasing) return;
    setPurchasing(true);
    const success = await purchase(selectedPackage);
    setPurchasing(false);
    if (success) router.back();
  }

  async function handleRestore() {
    const success = await restore();
    if (success) router.back();
  }

  if (isPro) {
    return (
      <ScreenWrapper>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
        <View style={styles.alreadyPro}>
          <Text style={{ fontSize: 64 }}>🎉</Text>
          <Text style={styles.proTitle}>You're already Pro!</Text>
          <Text style={styles.proSub}>Enjoy all EntrepeneuerAI Pro features.</Text>
          <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
            <Text style={styles.doneBtnText}>Back to App</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper edges={['top']} padded={false}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={24} color={colors.text.secondary} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.proBadge}>
            <Ionicons name="diamond" size={16} color={colors.accent.primary} />
            <Text style={styles.proBadgeText}>EntrepeneuerAI Pro</Text>
          </View>
          <Text style={styles.title}>Unlock Your Full{'\n'}Potential</Text>
          <Text style={styles.subtitle}>
            Everything you need to build your business — no limits.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresCard}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={f.icon as any} size={18} color={colors.accent.primary} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
              <Ionicons name="checkmark-circle" size={18} color={colors.semantic.success} />
            </View>
          ))}
        </View>

        {/* Plan selector */}
        {loading ? (
          <ActivityIndicator color={colors.accent.primary} style={{ marginVertical: spacing.xxl }} />
        ) : packages.length === 0 ? (
          <View style={styles.noOfferings}>
            <Text style={styles.noOfferingsText}>
              Products not configured yet. Check your RevenueCat dashboard.
            </Text>
          </View>
        ) : (
          <View style={styles.plans}>
            {packages.map((pkg, i) => {
              const selected = i === selectedIndex;
              const isPopular = pkg.packageType === PACKAGE_TYPE.ANNUAL;
              const priceStr = pkg.product.priceString;
              const period =
                pkg.packageType === PACKAGE_TYPE.LIFETIME
                  ? 'one-time'
                  : pkg.packageType === PACKAGE_TYPE.ANNUAL
                  ? '/ year'
                  : '/ month';

              return (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[styles.planCard, selected && styles.planCardSelected]}
                  onPress={() => setSelectedIndex(i)}
                  activeOpacity={0.8}
                >
                  {isPopular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>BEST VALUE</Text>
                    </View>
                  )}
                  <View style={styles.planLeft}>
                    <View style={[styles.planRadio, selected && styles.planRadioSelected]}>
                      {selected && <View style={styles.planRadioDot} />}
                    </View>
                    <View>
                      <Text style={[styles.planName, selected && styles.planNameSelected]}>
                        {pkg.product.title || pkg.packageType}
                      </Text>
                      {pkg.packageType === PACKAGE_TYPE.ANNUAL && (
                        <Text style={styles.planSavings}>Save ~60% vs monthly</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.planRight}>
                    <Text style={[styles.planPrice, selected && styles.planPriceSelected]}>
                      {priceStr}
                    </Text>
                    <Text style={styles.planPeriod}>{period}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaBtn, (!selectedPackage || purchasing) && styles.ctaBtnDisabled]}
          onPress={handlePurchase}
          disabled={!selectedPackage || purchasing}
          activeOpacity={0.85}
        >
          {purchasing ? (
            <ActivityIndicator color={colors.text.inverse} />
          ) : (
            <Text style={styles.ctaBtnText}>
              {selectedPackage
                ? `Get ${selectedPackage.packageType === PACKAGE_TYPE.LIFETIME ? 'Lifetime Access' : 'Pro'} – ${selectedPackage.product.priceString}`
                : 'Get Pro'}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.legal}>
          Payment charged to your App Store / Google Play account. Subscription auto-renews unless cancelled.
        </Text>

        {/* Restore */}
        <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    position: 'absolute', top: spacing.xxl, right: spacing.lg,
    zIndex: 10, width: 36, height: 36, borderRadius: radius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.section },
  header: { alignItems: 'center', paddingTop: spacing.section, paddingBottom: spacing.xxl },
  proBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: `${colors.accent.primary}20`,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.full, marginBottom: spacing.lg,
    borderWidth: 1, borderColor: `${colors.accent.primary}40`,
  },
  proBadgeText: { ...typography.smallMedium, color: colors.accent.primary },
  title: { ...typography.display, color: colors.text.primary, textAlign: 'center', lineHeight: 44 },
  subtitle: {
    ...typography.body, color: colors.text.secondary,
    textAlign: 'center', marginTop: spacing.md, lineHeight: 22,
  },
  featuresCard: {
    backgroundColor: colors.background.card, borderRadius: radius.xl,
    padding: spacing.lg, marginBottom: spacing.xxl,
  },
  featureRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md, gap: spacing.md,
  },
  featureIcon: {
    width: 34, height: 34, borderRadius: radius.md,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center', justifyContent: 'center',
  },
  featureText: { ...typography.body, color: colors.text.primary, flex: 1 },
  noOfferings: {
    backgroundColor: colors.background.card, borderRadius: radius.lg,
    padding: spacing.xl, marginBottom: spacing.xxl, alignItems: 'center',
  },
  noOfferingsText: { ...typography.small, color: colors.text.tertiary, textAlign: 'center' },
  plans: { gap: spacing.md, marginBottom: spacing.xxl },
  planCard: {
    backgroundColor: colors.background.card, borderRadius: radius.xl,
    padding: spacing.lg, borderWidth: 2, borderColor: colors.border.default,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    position: 'relative', overflow: 'hidden',
  },
  planCardSelected: { borderColor: colors.accent.primary, backgroundColor: `${colors.accent.primary}08` },
  popularBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderBottomLeftRadius: radius.md,
  },
  popularText: { fontSize: 10, fontWeight: '700', color: colors.text.inverse, letterSpacing: 0.5 },
  planLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  planRadio: {
    width: 22, height: 22, borderRadius: radius.full,
    borderWidth: 2, borderColor: colors.border.light,
    alignItems: 'center', justifyContent: 'center',
  },
  planRadioSelected: { borderColor: colors.accent.primary },
  planRadioDot: {
    width: 10, height: 10, borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
  },
  planName: { ...typography.bodyMedium, color: colors.text.secondary },
  planNameSelected: { color: colors.text.primary },
  planSavings: { ...typography.caption, color: colors.semantic.success, marginTop: 2 },
  planRight: { alignItems: 'flex-end' },
  planPrice: { ...typography.h3, color: colors.text.secondary },
  planPriceSelected: { color: colors.accent.primary },
  planPeriod: { ...typography.caption, color: colors.text.tertiary, marginTop: 2 },
  ctaBtn: {
    backgroundColor: colors.accent.primary, borderRadius: radius.xl,
    padding: spacing.xl, alignItems: 'center', marginBottom: spacing.md,
  },
  ctaBtnDisabled: { opacity: 0.5 },
  ctaBtnText: { ...typography.h3, color: colors.text.inverse },
  legal: {
    ...typography.caption, color: colors.text.muted,
    textAlign: 'center', lineHeight: 18, marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  restoreBtn: { alignItems: 'center', paddingVertical: spacing.md },
  restoreText: { ...typography.body, color: colors.text.tertiary },
  alreadyPro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  proTitle: { ...typography.h1, color: colors.text.primary },
  proSub: { ...typography.body, color: colors.text.secondary },
  doneBtn: {
    backgroundColor: colors.accent.primary, borderRadius: radius.xl,
    paddingHorizontal: spacing.xxl, paddingVertical: spacing.lg, marginTop: spacing.lg,
  },
  doneBtnText: { ...typography.bodyMedium, color: colors.text.inverse },
});
