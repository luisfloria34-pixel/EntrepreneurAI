import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useBadges } from '../../src/hooks/useBadges';
import { supabase } from '../../src/services/supabase';
import { useAuth } from '../../src/context/AuthContext';

// ─── Static badge metadata ───────────────────────────────────────────────────

interface BadgeMeta {
  steps: string[];
  progressLabel: (n: number) => string;
  goal: number;
  motivational: string;
}

const BADGE_META: Record<string, BadgeMeta> = {
  b1: {
    steps: ['Open the app before 8 AM', 'Complete any lesson', "That's it — do it once!"],
    progressLabel: n => `${n}/1 early session`,
    goal: 1,
    motivational: 'Set an early alarm and crush a lesson tomorrow morning!',
  },
  b2: {
    steps: ['Start any course', 'Complete all lessons in the course', 'Your first badge awaits!'],
    progressLabel: n => `${n}/1 course completed`,
    goal: 1,
    motivational: 'Pick a course and commit — every lesson gets you closer!',
  },
  b3: {
    steps: ['Use the app every single day', 'Complete at least 1 task per day', 'Reach a 7-day streak'],
    progressLabel: n => `${n}/7 day streak`,
    goal: 7,
    motivational: "Consistency beats intensity. Don't break the chain!",
  },
  b4: {
    steps: ['Open AI Coach', 'Ask 10 questions or more', 'Each message counts toward this badge'],
    progressLabel: n => `${n}/10 messages sent`,
    goal: 10,
    motivational: 'The AI Coach is your secret weapon — start asking!',
  },
  b5: {
    steps: ['Upload a proof of work photo', 'Show what you have built', 'Document your progress'],
    progressLabel: n => `${n}/5 proofs uploaded`,
    goal: 5,
    motivational: 'Show your work — upload your first proof today!',
  },
  b6: {
    steps: ['Create posts in the Community', 'Get other users to like your posts', 'Reach 50 total likes'],
    progressLabel: n => `${n}/50 likes received`,
    goal: 50,
    motivational: 'Share your wins and insights — the community loves real stories!',
  },
  b7: {
    steps: ['Comment and help others in Community', 'Give helpful advice on 10 posts', 'Community will recognise your help'],
    progressLabel: n => `${n}/10 helpful comments`,
    goal: 10,
    motivational: 'Help one person today — your knowledge is valuable!',
  },
  b8: {
    steps: ['Complete lessons consistently', 'Finish 100 total lessons', 'Long-term commitment badge'],
    progressLabel: n => `${n}/100 lessons done`,
    goal: 100,
    motivational: "Every lesson counts. You're building something great!",
  },
  b9: {
    steps: ['Open the app after midnight', 'Complete any lesson', 'Just once is enough'],
    progressLabel: n => `${n}/1 midnight session`,
    goal: 1,
    motivational: "Night owls get things done too! One late-night session and it's yours.",
  },
  b10: {
    steps: ['Complete all daily tasks every day', 'Stay consistent for 30 days', 'Perfect dedication badge'],
    progressLabel: n => `${n}/30 perfect days`,
    goal: 30,
    motivational: 'Zero missed tasks for 30 days — the ultimate discipline badge!',
  },
};

// ─── Confetti particle ───────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#00D4FF', '#EC4899'];

function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  const y = useRef(new Animated.Value(0)).current;
  const x = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const xTarget = (Math.random() - 0.5) * 200;
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.spring(y, { toValue: -(80 + Math.random() * 100), useNativeDriver: true, friction: 4 }),
        Animated.spring(x, { toValue: xTarget, useNativeDriver: true, friction: 4 }),
        Animated.timing(rotate, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
      Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View
      style={[
        styles.confettiDot,
        { backgroundColor: color, opacity, transform: [{ translateY: y }, { translateX: x }, { rotate: spin }] },
      ]}
    />
  );
}

function Confetti() {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    key: i,
    delay: i * 40,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));
  return (
    <View style={styles.confettiContainer} pointerEvents="none">
      {particles.map(p => <ConfettiParticle key={p.key} delay={p.delay} color={p.color} />)}
    </View>
  );
}

// ─── Progress fetcher ────────────────────────────────────────────────────────

async function fetchProgress(badgeId: string, userId: string): Promise<number> {
  try {
    switch (badgeId) {
      case 'b1':
      case 'b9':
        return 0;
      case 'b2': {
        const { count } = await supabase
          .from('user_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('progress', 100);
        return count ?? 0;
      }
      case 'b3': {
        const { data } = await supabase.from('profiles').select('streak').eq('id', userId).single();
        return data?.streak ?? 0;
      }
      case 'b4': {
        const { count } = await supabase
          .from('ai_messages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        return count ?? 0;
      }
      case 'b5': {
        const { count } = await supabase
          .from('proofs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        return count ?? 0;
      }
      case 'b6': {
        const { data } = await supabase
          .from('community_posts')
          .select('likes')
          .eq('user_id', userId);
        return (data ?? []).reduce((sum, p) => sum + (p.likes ?? 0), 0);
      }
      case 'b7': {
        const { count } = await supabase
          .from('post_comments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        return count ?? 0;
      }
      case 'b8': {
        const { data } = await supabase.from('profiles').select('lessons_completed').eq('id', userId).single();
        return data?.lessons_completed ?? 0;
      }
      case 'b10':
        return 0;
      default:
        return 0;
    }
  } catch {
    return 0;
  }
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function BadgeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { badges, loading } = useBadges();

  const badgeId = Array.isArray(id) ? id[0] : (id ?? 'b1');
  const badge = badges.find(b => b.id === badgeId) ?? badges[0];
  const meta = BADGE_META[badge?.id] ?? BADGE_META.b1;

  const [progress, setProgress] = useState(0);
  const [progressLoading, setProgressLoading] = useState(true);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.spring(iconScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (!user || loading) return;
    fetchProgress(badge.id, user.id).then(val => {
      setProgress(val);
      setProgressLoading(false);
      const pct = badge.earned ? 1 : Math.min(val / meta.goal, 1);
      Animated.timing(progressAnim, { toValue: pct, duration: 800, useNativeDriver: false }).start();
    });
  }, [user, loading, badge.id, badge.earned]);

  const handleShare = async () => {
    if (!badge.earned) return;
    await Share.share({
      message: `I earned the "${badge.name}" badge on EntrepreneurAI! ${badge.emoji}\n\n${badge.description}`,
    }).catch(() => {});
  };

  if (loading || !badge) return null;

  const pct = badge.earned ? 1 : Math.min(progress / meta.goal, 1);
  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <ScreenWrapper edges={['top']} padded={false}>
      <View style={styles.headerWrap}>
        <AppHeader showBack onBack={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Badge icon with confetti */}
        <View style={styles.iconSection}>
          {badge.earned && <Confetti />}
          <Animated.View
            style={[
              styles.iconRing,
              badge.earned
                ? { backgroundColor: `${badge.color}20`, borderColor: `${badge.color}60`, borderWidth: 3 }
                : { backgroundColor: colors.background.tertiary, borderColor: colors.border.default, borderWidth: 2 },
              { transform: [{ scale: iconScale }] },
            ]}
          >
            <Text style={[styles.iconEmoji, !badge.earned && styles.iconEmojiLocked]}>
              {badge.emoji}
            </Text>
            {!badge.earned && (
              <View style={styles.lockBadge}>
                <Ionicons name="lock-closed" size={14} color={colors.text.muted} />
              </View>
            )}
          </Animated.View>
        </View>

        {/* Name + description */}
        <Text style={styles.badgeName}>{badge.name}</Text>
        <Text style={styles.badgeDesc}>{badge.description}</Text>

        {/* Status pill */}
        {badge.earned ? (
          <View style={styles.earnedPill}>
            <Ionicons name="checkmark-circle" size={18} color={colors.semantic.success} />
            <Text style={styles.earnedPillText}>
              Earned {badge.earnedAt ? `on ${badge.earnedAt.split('T')[0]}` : '✓'}
            </Text>
          </View>
        ) : (
          <View style={styles.lockedPill}>
            <Ionicons name="lock-closed" size={16} color={colors.text.tertiary} />
            <Text style={styles.lockedPillText}>Not yet earned</Text>
          </View>
        )}

        {/* Progress card (only for badges with measurable progress) */}
        {!['b1', 'b9'].includes(badge.id) && (
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Your Progress</Text>
              <Text style={[styles.progressValue, badge.earned && { color: colors.semantic.success }]}>
                {badge.earned ? 'Complete!' : meta.progressLabel(progress)}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { width: progressWidth, backgroundColor: badge.earned ? colors.semantic.success : badge.color },
                ]}
              />
            </View>
            {!badge.earned && (
              <Text style={styles.progressHint}>
                {Math.round(pct * 100)}% — {meta.goal - Math.min(progress, meta.goal)} more to go
              </Text>
            )}
          </View>
        )}

        {/* How to Earn */}
        <View style={styles.howToCard}>
          <View style={styles.howToHeader}>
            <Ionicons name="map-outline" size={20} color={colors.accent.primary} />
            <Text style={styles.howToTitle}>How to Earn</Text>
          </View>
          {meta.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={[styles.stepNum, badge.earned && styles.stepNumDone]}>
                {badge.earned
                  ? <Ionicons name="checkmark" size={12} color={colors.text.inverse} />
                  : <Text style={styles.stepNumText}>{i + 1}</Text>
                }
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Motivational / earned message */}
        <View style={[styles.motivationCard, badge.earned && styles.motivationCardEarned]}>
          <Text style={styles.motivationEmoji}>{badge.earned ? '🎉' : '💪'}</Text>
          <Text style={[styles.motivationText, badge.earned && styles.motivationTextEarned]}>
            {badge.earned
              ? `Amazing! You've mastered the "${badge.name}" badge. Keep pushing!`
              : meta.motivational}
          </Text>
        </View>

        {/* Action button */}
        {badge.earned ? (
          <View style={styles.shareButton}>
            <Ionicons name="share-outline" size={20} color={colors.text.inverse} />
            <Text style={styles.shareButtonText} onPress={handleShare}>Share This Badge</Text>
          </View>
        ) : (
          <View style={styles.ctaButton} onTouchEnd={() => router.back()}>
            <Text style={styles.ctaButtonText}>Start Earning →</Text>
          </View>
        )}

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerWrap: { paddingHorizontal: spacing.lg },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.section, alignItems: 'center' },

  iconSection: { marginTop: spacing.xxl, marginBottom: spacing.xl, alignItems: 'center' },
  confettiContainer: { position: 'absolute', top: 70, alignItems: 'center', zIndex: 10 },
  confettiDot: { position: 'absolute', width: 10, height: 10, borderRadius: 5 },
  iconRing: {
    width: 150, height: 150, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
  },
  iconEmoji: { fontSize: 72 },
  iconEmojiLocked: { opacity: 0.25 },
  lockBadge: {
    position: 'absolute', bottom: 6, right: 6,
    width: 28, height: 28, borderRadius: radius.full,
    backgroundColor: colors.background.elevated,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.background.primary,
  },

  badgeName: { ...typography.h1, color: colors.text.primary, textAlign: 'center', marginBottom: spacing.sm },
  badgeDesc: {
    ...typography.body, color: colors.text.secondary,
    textAlign: 'center', lineHeight: 22,
    paddingHorizontal: spacing.lg, marginBottom: spacing.lg,
  },

  earnedPill: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: `${colors.semantic.success}15`,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: radius.full, marginBottom: spacing.xxl,
  },
  earnedPillText: { ...typography.smallMedium, color: colors.semantic.success },
  lockedPill: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: radius.full, marginBottom: spacing.xxl,
  },
  lockedPillText: { ...typography.smallMedium, color: colors.text.tertiary },

  progressCard: {
    width: '100%', backgroundColor: colors.background.card,
    borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.md,
  },
  progressTitle: { ...typography.bodyMedium, color: colors.text.primary },
  progressValue: { ...typography.smallMedium, color: colors.accent.primary },
  progressTrack: {
    height: 10, backgroundColor: colors.background.tertiary,
    borderRadius: radius.full, overflow: 'hidden', marginBottom: spacing.sm,
  },
  progressFill: { height: '100%', borderRadius: radius.full },
  progressHint: { ...typography.caption, color: colors.text.tertiary },

  howToCard: {
    width: '100%', backgroundColor: colors.background.card,
    borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg,
  },
  howToHeader: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg,
  },
  howToTitle: { ...typography.h3, color: colors.text.primary },
  stepRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: spacing.md, marginBottom: spacing.md,
  },
  stepNum: {
    width: 26, height: 26, borderRadius: radius.full,
    backgroundColor: `${colors.accent.primary}20`,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  stepNumDone: { backgroundColor: colors.semantic.success },
  stepNumText: { ...typography.caption, color: colors.accent.primary, fontWeight: '700' },
  stepText: { ...typography.body, color: colors.text.secondary, flex: 1, lineHeight: 22 },

  motivationCard: {
    width: '100%', flexDirection: 'row', alignItems: 'flex-start',
    gap: spacing.md, backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xxl,
  },
  motivationCardEarned: { backgroundColor: `${colors.semantic.success}10` },
  motivationEmoji: { fontSize: 24 },
  motivationText: { ...typography.body, color: colors.text.secondary, flex: 1, lineHeight: 22 },
  motivationTextEarned: { color: colors.semantic.success },

  shareButton: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: spacing.sm,
    backgroundColor: colors.accent.primary, borderRadius: radius.lg, padding: spacing.lg,
  },
  shareButtonText: { ...typography.bodyMedium, color: colors.text.inverse },
  ctaButton: {
    width: '100%', alignItems: 'center', justifyContent: 'center',
    backgroundColor: `${colors.accent.primary}15`,
    borderRadius: radius.lg, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.accent.primary,
  },
  ctaButtonText: { ...typography.bodyMedium, color: colors.accent.primary },
});
