import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Animated, Switch, Dimensions, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, radius } from '../src/theme';
import { useTheme } from '../src/context/ThemeContext';
import { activatePro } from '../src/services/proStatus';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const BENEFITS = [
  { icon: '🤖', title: 'Unlimited AI Coach', sub: 'Personal mentor answers any business question' },
  { icon: '📚', title: 'All 50+ Courses', sub: 'Expert content from real founders' },
  { icon: '👥', title: 'Full Community', sub: 'Post, connect, get real feedback' },
  { icon: '🏆', title: 'Certificates', sub: 'Verifiable proof of your skills' },
  { icon: '🔥', title: 'Streak Shield', sub: 'Never lose your streak again' },
];

const PLANS = [
  { id: 'weekly', label: 'Weekly', price: '€2.99', period: '/wk', sub: null, badge: null, highlighted: false },
  { id: 'yearly', label: 'Yearly', price: '€39.99', period: '/yr', sub: '€3.33/mo', badge: 'BEST VALUE', highlighted: true, savings: '−58%' },
  { id: 'lifetime', label: 'Lifetime', price: '€89.99', period: '', sub: 'one-time', badge: 'LIMITED', highlighted: false },
] as const;

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Founder @ Bloom', text: 'Got my first 3 clients within 2 weeks of using the AI coach daily.', avatar: '🧑‍💼' },
  { name: 'Marcus T.', role: 'E-comm founder', text: 'The courses are dense and real — not fluff. Worth every cent.', avatar: '👨‍💻' },
];

function PulsingOrb({ color, size, style }: { color: string; size: number; style?: any }) {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.15, duration: 2000, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, transform: [{ scale }] }, style]} />
  );
}

function SuccessOverlay({ onDone }: { onDone: () => void }) {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
    setTimeout(onDone, 2400);
  }, []);
  return (
    <Animated.View style={{ ...StyleSheet_absoluteFill, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center', zIndex: 50, opacity }}>
      <Animated.View style={{ backgroundColor: '#0D1526', borderRadius: radius.xl, padding: spacing.section, alignItems: 'center', marginHorizontal: spacing.xxl, borderWidth: 1, borderColor: '#00D4FF30', transform: [{ scale }] }}>
        <LinearGradient colors={['#00D4FF22', '#7C3AED22']} style={{ width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg }}>
          <Text style={{ fontSize: 44 }}>🎉</Text>
        </LinearGradient>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: spacing.sm }}>Welcome to Pro!</Text>
        <Text style={{ ...typography.body, color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>Full access unlocked. Let's build something great.</Text>
      </Animated.View>
    </Animated.View>
  );
}

const StyleSheet_absoluteFill = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };

export default function PaywallScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ message?: string }>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');
  const [trialOn, setTrialOn] = useState(true);
  const [benefitIdx, setBenefitIdx] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auto-cycle benefits
  useEffect(() => {
    const t = setInterval(() => setBenefitIdx(i => (i + 1) % BENEFITS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const plan = PLANS.find(p => p.id === selectedPlan)!;
  const isYearly = selectedPlan === 'yearly';
  const isLifetime = selectedPlan === 'lifetime';

  const ctaLabel = isLifetime
    ? `Get Lifetime – ${plan.price}`
    : trialOn && isYearly
    ? `Start Free Trial → ${plan.price}/yr after`
    : `Get Pro – ${plan.price}${plan.period}`;

  async function handlePurchase() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setPurchasing(true);
    await new Promise(r => setTimeout(r, 900));
    await activatePro();
    setPurchasing(false);
    setSuccess(true);
  }

  function handleSuccessDone() {
    try { router.replace('/(tabs)/dashboard'); } catch { router.back(); }
  }

  const selectPlan = (id: string) => {
    Haptics.selectionAsync();
    setSelectedPlan(id);
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#08090F' : colors.background.primary }}>
      {/* Ambient orbs */}
      <PulsingOrb color="#00D4FF10" size={300} style={{ position: 'absolute', top: -80, left: -80 }} />
      <PulsingOrb color="#7C3AED10" size={250} style={{ position: 'absolute', top: 200, right: -100 }} />

      {/* Close */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: 'absolute', top: insets.top + 12, right: spacing.lg, zIndex: 20, width: 36, height: 36, borderRadius: 18, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center' }}
      >
        <Ionicons name="close" size={20} color={colors.text.secondary} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 56, paddingBottom: insets.bottom + 32, paddingHorizontal: spacing.lg }} showsVerticalScrollIndicator={false}>

        {/* Context banner */}
        {!!params.message && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: '#F59E0B12', borderWidth: 1, borderColor: '#F59E0B30', borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.lg }}>
            <Ionicons name="lock-closed" size={14} color="#F59E0B" />
            <Text style={{ ...typography.small, color: '#F59E0B', flex: 1 }}>{params.message}</Text>
          </View>
        )}

        {/* Hero */}
        <View style={{ alignItems: 'center', marginBottom: spacing.xxl }}>
          <LinearGradient colors={['#00D4FF22', '#7C3AED22']} style={{ width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg, borderWidth: 1, borderColor: '#00D4FF30' }}>
            <Text style={{ fontSize: 44 }}>🚀</Text>
          </LinearGradient>
          <Text style={{ fontSize: 30, fontWeight: '800', color: colors.text.primary, textAlign: 'center', letterSpacing: -0.8, lineHeight: 36, marginBottom: spacing.sm }}>
            Unlock Your Full{'\n'}Potential
          </Text>
          <Text style={{ ...typography.body, color: colors.text.secondary, textAlign: 'center' }}>
            Join 10,000+ entrepreneurs already building
          </Text>
        </View>

        {/* Social proof */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg, marginBottom: spacing.xxl }}>
          <View style={{ flexDirection: 'row' }}>
            {['#F59E0B', '#10B981', '#8B5CF6', '#EC4899'].map((c, i) => (
              <View key={i} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c, marginLeft: i > 0 ? -8 : 0, borderWidth: 2, borderColor: isDark ? '#08090F' : '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{['A', 'B', 'C', 'D'][i]}</Text>
              </View>
            ))}
          </View>
          <View>
            <Text style={{ fontSize: 13, color: colors.text.primary, fontWeight: '700' }}>⭐ 4.9 · 2,400 ratings</Text>
            <Text style={{ ...typography.caption, color: colors.text.tertiary }}>App Store & Google Play</Text>
          </View>
        </View>

        {/* Cycling benefits */}
        <View style={{ backgroundColor: isDark ? colors.background.card : colors.background.secondary, borderRadius: radius.xl, padding: spacing.xl, marginBottom: spacing.xxl, borderWidth: 1, borderColor: colors.border.default, minHeight: 100, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 36, marginBottom: spacing.md }}>{BENEFITS[benefitIdx].icon}</Text>
          <Text style={{ ...typography.h3, color: colors.text.primary, textAlign: 'center', marginBottom: spacing.sm }}>{BENEFITS[benefitIdx].title}</Text>
          <Text style={{ ...typography.body, color: colors.text.secondary, textAlign: 'center' }}>{BENEFITS[benefitIdx].sub}</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: spacing.lg }}>
            {BENEFITS.map((_, i) => (
              <View key={i} style={{ width: i === benefitIdx ? 20 : 6, height: 6, borderRadius: 3, backgroundColor: i === benefitIdx ? '#00D4FF' : colors.border.default }} />
            ))}
          </View>
        </View>

        {/* Pricing */}
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg, alignItems: 'flex-end' }}>
          {PLANS.map(p => {
            const sel = selectedPlan === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => selectPlan(p.id)}
                activeOpacity={0.85}
                style={{ flex: 1 }}
              >
                {sel ? (
                  <LinearGradient colors={['#00D4FF', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radius.lg, padding: 1.5 }}>
                    <View style={{ backgroundColor: isDark ? '#0A0F1E' : '#fff', borderRadius: radius.lg - 1, padding: spacing.md, alignItems: 'center', paddingTop: p.badge ? spacing.xxl + 4 : spacing.lg, position: 'relative', overflow: 'hidden' }}>
                      {p.badge && (
                        <LinearGradient colors={['#00D4FF', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingVertical: 4, alignItems: 'center' }}>
                          <Text style={{ fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.8 }}>{p.badge}</Text>
                        </LinearGradient>
                      )}
                      <Text style={{ ...typography.caption, color: '#00D4FF', marginBottom: 4, fontWeight: '600' }}>{p.label}</Text>
                      <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text.primary }}>{p.price}</Text>
                      <Text style={{ ...typography.caption, color: colors.text.tertiary }}>{p.period}</Text>
                      {p.sub && <Text style={{ ...typography.caption, color: '#00D4FF', marginTop: 2 }}>{p.sub}</Text>}
                      {'savings' in p && p.savings && <Text style={{ fontSize: 11, fontWeight: '700', color: '#10B981', marginTop: 2 }}>{p.savings}</Text>}
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={{ backgroundColor: colors.background.card, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', borderWidth: 1.5, borderColor: colors.border.default, paddingTop: p.badge ? spacing.xxl + 4 : spacing.lg, position: 'relative', overflow: 'hidden' }}>
                    {p.badge && (
                      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: colors.background.tertiary, paddingVertical: 4, alignItems: 'center' }}>
                        <Text style={{ fontSize: 9, fontWeight: '700', color: colors.text.muted, letterSpacing: 0.8 }}>{p.badge}</Text>
                      </View>
                    )}
                    <Text style={{ ...typography.caption, color: colors.text.tertiary, marginBottom: 4 }}>{p.label}</Text>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text.primary }}>{p.price}</Text>
                    <Text style={{ ...typography.caption, color: colors.text.muted }}>{p.period}</Text>
                    {p.sub && <Text style={{ ...typography.caption, color: colors.text.muted, marginTop: 2 }}>{p.sub}</Text>}
                    {'savings' in p && p.savings && <Text style={{ fontSize: 11, fontWeight: '700', color: '#10B981', marginTop: 2 }}>{p.savings}</Text>}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Free trial toggle */}
        {isYearly && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.background.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border.default }}>
            <View style={{ flex: 1, marginRight: spacing.lg }}>
              <Text style={{ ...typography.bodyMedium, color: colors.text.primary }}>7-day free trial</Text>
              <Text style={{ ...typography.caption, color: colors.text.tertiary, marginTop: 2 }}>Cancel anytime. No charge today.</Text>
            </View>
            <Switch value={trialOn} onValueChange={v => { Haptics.selectionAsync(); setTrialOn(v); }} trackColor={{ false: colors.border.default, true: '#00D4FF' }} thumbColor="#fff" />
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity onPress={handlePurchase} disabled={purchasing} activeOpacity={0.88} style={{ marginBottom: spacing.lg }}>
          <LinearGradient colors={['#00D4FF', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: radius.xl, paddingVertical: spacing.xl, paddingHorizontal: spacing.xxl, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: spacing.sm }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#fff', letterSpacing: -0.2 }}>
              {purchasing ? 'Processing...' : ctaLabel}
            </Text>
            {!purchasing && <Ionicons name="arrow-forward" size={20} color="#fff" />}
          </LinearGradient>
        </TouchableOpacity>

        {/* Timeline (yearly+trial) */}
        {isYearly && trialOn && (
          <View style={{ backgroundColor: colors.background.card, borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border.default }}>
            {[
              { dot: '🟢', day: 'Today', text: 'Trial starts, full access unlocked' },
              { dot: '🟡', day: 'Day 5', text: 'Reminder before trial ends' },
              { dot: '🔵', day: 'Day 7', text: '€39.99/year billing begins' },
            ].map((row, i, arr) => (
              <React.Fragment key={row.day}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
                  <Text style={{ fontSize: 16, marginTop: 2 }}>{row.dot}</Text>
                  <View>
                    <Text style={{ ...typography.smallMedium, color: colors.text.primary }}>{row.day}</Text>
                    <Text style={{ ...typography.small, color: colors.text.secondary, marginTop: 2 }}>{row.text}</Text>
                  </View>
                </View>
                {i < arr.length - 1 && <View style={{ width: 2, height: 18, backgroundColor: colors.border.default, marginLeft: 7, marginVertical: 4 }} />}
              </React.Fragment>
            ))}
          </View>
        )}

        {/* Testimonials */}
        <View style={{ gap: spacing.md, marginBottom: spacing.xxl }}>
          {TESTIMONIALS.map(t => (
            <View key={t.name} style={{ backgroundColor: colors.background.card, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border.default }}>
              <Text style={{ ...typography.small, color: colors.text.secondary, lineHeight: 20, marginBottom: spacing.sm }}>"{t.text}"</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Text style={{ fontSize: 24 }}>{t.avatar}</Text>
                <View>
                  <Text style={{ ...typography.smallMedium, color: colors.text.primary }}>{t.name}</Text>
                  <Text style={{ ...typography.caption, color: colors.text.tertiary }}>{t.role}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 12 }}>⭐⭐⭐⭐⭐</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Trust */}
        <View style={{ alignItems: 'center', gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Ionicons name="lock-closed" size={12} color={colors.text.muted} />
            <Text style={{ ...typography.caption, color: colors.text.muted }}>Secure payment · Cancel anytime · No hidden fees</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.lg }}>
            {['Restore', 'Terms', 'Privacy'].map(lnk => (
              <TouchableOpacity key={lnk}><Text style={{ ...typography.caption, color: colors.text.muted }}>{lnk}</Text></TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/dashboard')} style={{ paddingVertical: spacing.md }}>
            <Text style={{ ...typography.small, color: colors.text.muted }}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {success && <SuccessOverlay onDone={handleSuccessDone} />}
    </View>
  );
}
