import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, Switch, FlatList, Dimensions, useWindowDimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../src/theme';
import { activatePro, getIsPro } from '../src/services/proStatus';

// ─── Data ────────────────────────────────────────────────────────────────────

const BENEFITS = [
  { emoji: '🤖', title: 'Unlimited AI Coach', sub: 'Get answers 24/7 from your personal mentor' },
  { emoji: '📚', title: 'All 50+ Courses', sub: 'Video lessons from real entrepreneurs' },
  { emoji: '👥', title: 'Full Community Access', sub: 'Post, connect, get feedback' },
  { emoji: '🏆', title: 'Certificates', sub: 'Prove your skills to the world' },
  { emoji: '🔥', title: 'Streak Protection', sub: 'Never lose your streak again' },
];

const PLANS = [
  {
    id: 'weekly',
    label: 'Weekly',
    price: '€2.99',
    period: '/week',
    sub: null,
    badge: null,
    highlighted: false,
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: '€39.99',
    period: '/year',
    sub: '= €3.33/month',
    badge: 'BEST VALUE',
    highlighted: true,
    savings: 'Save 58%',
  },
  {
    id: 'lifetime',
    label: 'Lifetime',
    price: '€89.99',
    period: ' once',
    sub: 'One-time payment',
    badge: 'LIMITED',
    highlighted: false,
  },
] as const;

const AVATARS = ['#F59E0B', '#10B981', '#8B5CF6'];

// ─── Sub-components ──────────────────────────────────────────────────────────

function SparkleIcon() {
  const spin = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(spin, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(spin, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.12, duration: 900, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={[styles.iconWrap, { transform: [{ scale }, { rotate }] }]}>
      <Text style={styles.iconEmoji}>🚀</Text>
      <View style={styles.sparkle1}><Text style={{ fontSize: 12 }}>✨</Text></View>
      <View style={styles.sparkle2}><Text style={{ fontSize: 10 }}>⭐</Text></View>
      <View style={styles.sparkle3}><Text style={{ fontSize: 8 }}>✨</Text></View>
    </Animated.View>
  );
}

function BenefitSlide({ item, width }: { item: typeof BENEFITS[0]; width: number }) {
  return (
    <View style={[styles.slide, { width }]}>
      <Text style={styles.slideEmoji}>{item.emoji}</Text>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideSub}>{item.sub}</Text>
    </View>
  );
}

function PulseCTA({ onPress, label }: { onPress: () => void; label: string }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.03, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <TouchableOpacity style={styles.ctaBtn} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.ctaBtnText}>{label}</Text>
        <Ionicons name="arrow-forward" size={20} color={colors.text.inverse} />
      </TouchableOpacity>
    </Animated.View>
  );
}

function SuccessOverlay({ onDone }: { onDone: () => void }) {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <Animated.View style={[styles.successOverlay, { opacity }]}>
      <Animated.View style={[styles.successCard, { transform: [{ scale }] }]}>
        <Text style={styles.successEmoji}>🎉</Text>
        <Text style={styles.successTitle}>Welcome to Pro!</Text>
        <Text style={styles.successSub}>Full access unlocked. Let's build something great.</Text>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function PaywallScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ message?: string }>();
  const { width } = useWindowDimensions();

  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');
  const [trialOn, setTrialOn] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const [success, setSuccess] = useState(false);

  const flatRef = useRef<FlatList>(null);

  // Auto-advance carousel
  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex(i => {
        const next = (i + 1) % BENEFITS.length;
        flatRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3200);
    return () => clearInterval(t);
  }, []);

  const plan = PLANS.find(p => p.id === selectedPlan)!;
  const isYearly = selectedPlan === 'yearly';
  const isLifetime = selectedPlan === 'lifetime';

  const ctaLabel = isLifetime
    ? `Get Lifetime Access – ${plan.price}`
    : trialOn && isYearly
    ? `Start Free Trial → then ${plan.price}${plan.period}`
    : `Get Pro Now – ${plan.price}${plan.period}`;

  async function handlePurchase() {
    setPurchasing(true);
    await new Promise(r => setTimeout(r, 900)); // mock network delay
    await activatePro();
    setPurchasing(false);
    setSuccess(true);
  }

  function handleSuccessDone() {
    // If there's no screen to go back to (came from survey), go to dashboard
    try {
      router.replace('/(tabs)/dashboard');
    } catch {
      router.back();
    }
  }

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={22} color={colors.text.secondary} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Contextual message */}
        {!!params.message && (
          <View style={styles.contextBanner}>
            <Ionicons name="lock-closed" size={14} color="#F59E0B" />
            <Text style={styles.contextText}>{params.message}</Text>
          </View>
        )}

        {/* 1. HEADER */}
        <SparkleIcon />
        <Text style={styles.headline}>Unlock Your Entrepreneur{'\n'}Journey</Text>
        <Text style={styles.subheadline}>Join 10,000+ young entrepreneurs</Text>

        {/* 2. SOCIAL PROOF */}
        <View style={styles.socialRow}>
          <View style={styles.avatarStack}>
            {AVATARS.map((c, i) => (
              <View key={i} style={[styles.avatarCircle, { backgroundColor: c, marginLeft: i * -10 }]}>
                <Text style={styles.avatarText}>{['A', 'B', 'C'][i]}</Text>
              </View>
            ))}
          </View>
          <View style={styles.starsWrap}>
            <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.ratingText}>4.9 · 2,400 reviews</Text>
          </View>
        </View>

        {/* 3. BENEFITS CAROUSEL */}
        <FlatList
          ref={flatRef}
          data={BENEFITS}
          keyExtractor={i => i.title}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled
          onMomentumScrollEnd={e => {
            setSlideIndex(Math.round(e.nativeEvent.contentOffset.x / width));
          }}
          renderItem={({ item }) => <BenefitSlide item={item} width={width - spacing.lg * 2} />}
          style={{ marginHorizontal: -spacing.lg }}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
          snapToInterval={width - spacing.lg * 2}
          decelerationRate="fast"
        />
        <View style={styles.dots}>
          {BENEFITS.map((_, i) => (
            <View key={i} style={[styles.dot, i === slideIndex && styles.dotActive]} />
          ))}
        </View>

        {/* 4. PRICING CARDS */}
        <View style={styles.plansRow}>
          {PLANS.map(p => {
            const sel = selectedPlan === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.planCard,
                  p.highlighted && styles.planCardHighlighted,
                  sel && styles.planCardSelected,
                  !p.highlighted && sel && styles.planCardSelectedPlain,
                ]}
                onPress={() => setSelectedPlan(p.id)}
                activeOpacity={0.8}
              >
                {p.badge && (
                  <View style={[styles.planBadge, p.highlighted && styles.planBadgeHighlighted]}>
                    <Text style={[styles.planBadgeText, p.highlighted && styles.planBadgeTextHighlighted]}>
                      {p.badge}
                    </Text>
                  </View>
                )}
                <View style={[styles.planRadio, sel && styles.planRadioSelected]}>
                  {sel && <View style={styles.planRadioDot} />}
                </View>
                <Text style={[styles.planLabel, sel && styles.planLabelSelected]}>{p.label}</Text>
                <Text style={[styles.planPrice, p.highlighted && styles.planPriceHighlighted]}>
                  {p.price}
                </Text>
                <Text style={styles.planPeriod}>{p.period}</Text>
                {p.sub && <Text style={styles.planSub}>{p.sub}</Text>}
                {'savings' in p && p.savings && (
                  <Text style={styles.planSavings}>{p.savings}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 5. FREE TRIAL TOGGLE (yearly only) */}
        {isYearly && (
          <View style={styles.trialRow}>
            <View style={styles.trialLeft}>
              <Text style={styles.trialLabel}>Start with 7-day free trial</Text>
              <Text style={styles.trialHint}>Cancel anytime in App Store settings</Text>
            </View>
            <Switch
              value={trialOn}
              onValueChange={setTrialOn}
              trackColor={{ false: colors.border.default, true: colors.accent.primary }}
              thumbColor={colors.text.inverse}
            />
          </View>
        )}

        {/* 6. CTA */}
        <PulseCTA onPress={handlePurchase} label={purchasing ? 'Processing...' : ctaLabel} />

        {/* 8. TIMELINE (yearly only) */}
        {isYearly && trialOn && (
          <View style={styles.timeline}>
            <TimelineRow dot="🟢" day="Today" text="Start free trial, full access unlocked" />
            <TimelineLine />
            <TimelineRow dot="🟡" day="Day 5" text="Reminder before your trial ends" />
            <TimelineLine />
            <TimelineRow dot="🔵" day="Day 7" text="Trial ends, €39.99/year subscription starts" />
          </View>
        )}

        {/* 7. TRUST SIGNALS */}
        <View style={styles.trustRow}>
          <Ionicons name="lock-closed" size={14} color={colors.text.tertiary} />
          <Text style={styles.trustText}>Secure payment via App Store</Text>
        </View>
        <View style={styles.trustPills}>
          {['Cancel anytime', 'Instant access', 'No hidden fees'].map((t, i) => (
            <React.Fragment key={t}>
              <Text style={styles.trustPill}>{t}</Text>
              {i < 2 && <Text style={styles.trustDot}>·</Text>}
            </React.Fragment>
          ))}
        </View>
        <View style={styles.linksRow}>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.link}>Restore Purchase</Text>
          </TouchableOpacity>
          <Text style={styles.linkSep}>|</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.link}>Terms</Text>
          </TouchableOpacity>
          <Text style={styles.linkSep}>|</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.link}>Privacy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => router.replace('/(tabs)/dashboard')}
        >
          <Text style={styles.skipText}>Maybe later</Text>
        </TouchableOpacity>
      </ScrollView>

      {success && <SuccessOverlay onDone={handleSuccessDone} />}
    </View>
  );
}

// ─── Timeline helpers ─────────────────────────────────────────────────────────

function TimelineRow({ dot, day, text }: { dot: string; day: string; text: string }) {
  return (
    <View style={styles.tlRow}>
      <Text style={styles.tlDot}>{dot}</Text>
      <View>
        <Text style={styles.tlDay}>{day}</Text>
        <Text style={styles.tlText}>{text}</Text>
      </View>
    </View>
  );
}
function TimelineLine() {
  return <View style={styles.tlLine} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary },
  closeBtn: {
    position: 'absolute', top: 52, right: spacing.lg, zIndex: 20,
    width: 34, height: 34, borderRadius: radius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: 56, paddingBottom: 48 },

  contextBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: '#F59E0B18', borderWidth: 1, borderColor: '#F59E0B40',
    borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.lg,
  },
  contextText: { ...typography.small, color: '#F59E0B', flex: 1 },

  // Header
  iconWrap: {
    alignSelf: 'center', width: 96, height: 96,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  iconEmoji: { fontSize: 56 },
  sparkle1: { position: 'absolute', top: 2, right: -4 },
  sparkle2: { position: 'absolute', bottom: 4, left: -2 },
  sparkle3: { position: 'absolute', top: 20, left: 6 },
  headline: {
    ...typography.display, color: colors.text.primary,
    textAlign: 'center', lineHeight: 42, marginBottom: spacing.sm,
  },
  subheadline: { ...typography.body, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xxl },

  // Social proof
  socialRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.lg, marginBottom: spacing.xxl,
  },
  avatarStack: { flexDirection: 'row' },
  avatarCircle: {
    width: 32, height: 32, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.background.primary,
  },
  avatarText: { ...typography.caption, color: colors.text.inverse, fontWeight: '700' },
  starsWrap: { alignItems: 'center' },
  stars: { fontSize: 14, letterSpacing: 1 },
  ratingText: { ...typography.caption, color: colors.text.secondary, marginTop: 2 },

  // Carousel
  slide: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.background.card, borderRadius: radius.xl,
    paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl,
    minHeight: 160,
  },
  slideEmoji: { fontSize: 44, marginBottom: spacing.md },
  slideTitle: { ...typography.h2, color: colors.text.primary, textAlign: 'center' },
  slideSub: { ...typography.body, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.xxl },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border.default },
  dotActive: { width: 18, backgroundColor: colors.accent.primary },

  // Plans
  plansRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg, alignItems: 'flex-end' },
  planCard: {
    flex: 1, backgroundColor: colors.background.card,
    borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 2, borderColor: colors.border.default,
    alignItems: 'center', position: 'relative', overflow: 'hidden',
    paddingTop: spacing.xxl,
  },
  planCardHighlighted: {
    borderColor: colors.accent.primary,
    shadowColor: colors.accent.primary, shadowOpacity: 0.35,
    shadowRadius: 14, shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  planCardSelected: { borderColor: colors.accent.primary },
  planCardSelectedPlain: { borderColor: colors.accent.primary, backgroundColor: `${colors.accent.primary}08` },
  planBadge: {
    position: 'absolute', top: 0, left: 0, right: 0,
    backgroundColor: colors.background.tertiary,
    paddingVertical: 4, alignItems: 'center',
  },
  planBadgeHighlighted: { backgroundColor: colors.accent.primary },
  planBadgeText: { fontSize: 9, fontWeight: '700', color: colors.text.tertiary, letterSpacing: 0.8 },
  planBadgeTextHighlighted: { color: colors.text.inverse },
  planRadio: {
    width: 18, height: 18, borderRadius: radius.full,
    borderWidth: 2, borderColor: colors.border.light,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  planRadioSelected: { borderColor: colors.accent.primary },
  planRadioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent.primary },
  planLabel: { ...typography.caption, color: colors.text.tertiary, marginBottom: spacing.xs },
  planLabelSelected: { color: colors.accent.primary },
  planPrice: { ...typography.h3, color: colors.text.primary },
  planPriceHighlighted: { color: colors.accent.primary },
  planPeriod: { ...typography.caption, color: colors.text.tertiary },
  planSub: { ...typography.caption, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.xs },
  planSavings: { fontSize: 11, fontWeight: '700', color: colors.semantic.success, marginTop: spacing.xs },

  // Trial toggle
  trialRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.background.card, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.xl,
  },
  trialLeft: { flex: 1, marginRight: spacing.lg },
  trialLabel: { ...typography.bodyMedium, color: colors.text.primary },
  trialHint: { ...typography.caption, color: colors.text.tertiary, marginTop: spacing.xs },

  // CTA
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.accent.primary, borderRadius: radius.xl,
    paddingVertical: spacing.xl, paddingHorizontal: spacing.xxl,
    gap: spacing.sm, marginBottom: spacing.lg,
  },
  ctaBtnText: { ...typography.h3, color: colors.text.inverse },

  // Timeline
  timeline: {
    backgroundColor: colors.background.card, borderRadius: radius.xl,
    padding: spacing.lg, marginBottom: spacing.xl,
  },
  tlRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  tlDot: { fontSize: 16, marginTop: 1 },
  tlDay: { ...typography.smallMedium, color: colors.text.primary },
  tlText: { ...typography.small, color: colors.text.secondary, marginTop: 2 },
  tlLine: {
    width: 2, height: 20, backgroundColor: colors.border.default,
    marginLeft: 7, marginVertical: 4,
  },

  // Trust
  trustRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  trustText: { ...typography.caption, color: colors.text.tertiary },
  trustPills: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.md },
  trustPill: { ...typography.caption, color: colors.text.tertiary },
  trustDot: { ...typography.caption, color: colors.text.muted },
  linksRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  link: { ...typography.caption, color: colors.text.secondary },
  linkSep: { ...typography.caption, color: colors.text.muted },
  skipBtn: { alignItems: 'center', paddingVertical: spacing.lg, marginTop: spacing.sm },
  skipText: { ...typography.small, color: colors.text.muted },

  // Success overlay
  successOverlay: {
    ...StyleSheet.absoluteFillObject, zIndex: 50,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center', justifyContent: 'center',
  },
  successCard: {
    backgroundColor: colors.background.elevated, borderRadius: radius.xl,
    padding: spacing.section, alignItems: 'center', marginHorizontal: spacing.xxl,
    borderWidth: 1, borderColor: `${colors.accent.primary}40`,
  },
  successEmoji: { fontSize: 64, marginBottom: spacing.lg },
  successTitle: { ...typography.h1, color: colors.text.primary, marginBottom: spacing.sm },
  successSub: { ...typography.body, color: colors.text.secondary, textAlign: 'center', lineHeight: 22 },
});
