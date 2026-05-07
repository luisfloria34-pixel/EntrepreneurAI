import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  useWindowDimensions, FlatList, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const SLIDES = [
  {
    key: 's1',
    emoji: '🚀',
    title: 'Welcome to\nEntrepreneurAI',
    sub: 'Your AI-powered business coach — built for the next generation of entrepreneurs.',
    color: '#00D4FF',
    bg: '#00D4FF12',
  },
  {
    key: 's2',
    emoji: '📚',
    title: 'Learn from\nthe best',
    sub: '50+ courses from real entrepreneurs. Go from idea to launch at your own pace.',
    color: '#10B981',
    bg: '#10B98112',
  },
  {
    key: 's3',
    emoji: '🤖',
    title: 'AI Coach\navailable 24/7',
    sub: 'Ask anything and get expert advice instantly. Your mentor never sleeps.',
    color: '#8B5CF6',
    bg: '#8B5CF612',
  },
  {
    key: 's4',
    emoji: '👥',
    title: 'Join the\ncommunity',
    sub: '10,000+ young entrepreneurs sharing wins, advice, and accountability.',
    color: '#EC4899',
    bg: '#EC489912',
  },
  {
    key: 's5',
    emoji: '🏆',
    title: 'Track your\nprogress',
    sub: 'Earn XP, build streaks, unlock badges. Level up your entrepreneurship journey.',
    color: '#F59E0B',
    bg: '#F59E0B12',
  },
] as const;

function AnimatedEmoji({ emoji, color, bg, active }: { emoji: string; color: string; bg: string; active: boolean }) {
  const scale = useRef(new Animated.Value(0.7)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 1, duration: 400, useNativeDriver: false }),
      ]).start();

      // Breathing loop
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.06, duration: 800, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      const t = setTimeout(() => loop.start(), 600);
      return () => { clearTimeout(t); loop.stop(); };
    } else {
      scale.setValue(0.7);
      glow.setValue(0);
    }
  }, [active]);

  const shadowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.4] });

  return (
    <Animated.View style={[styles.emojiRing, { backgroundColor: bg, transform: [{ scale }] }]}>
      <Animated.View style={[styles.emojiGlow, { backgroundColor: color, opacity: shadowOpacity }]} />
      <Text style={styles.emojiText}>{emoji}</Text>
    </Animated.View>
  );
}

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (index + 1) / SLIDES.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [index]);

  function goNext() {
    Haptics.selectionAsync();
    if (isLast) {
      router.push('/survey/1');
    } else {
      const next = index + 1;
      flatRef.current?.scrollToIndex({ index: next, animated: true });
      setIndex(next);
    }
  }

  function skip() {
    router.push('/survey/1');
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />

      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={skip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatRef}
        data={SLIDES}
        keyExtractor={s => s.key}
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item, index: i }) => (
          <View style={[styles.slide, { width }]}>
            <AnimatedEmoji emoji={item.emoji} color={item.color} bg={item.bg} active={i === index} />
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideSub}>{item.sub}</Text>
          </View>
        )}
      />

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth, backgroundColor: slide.color }]} />
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => { flatRef.current?.scrollToIndex({ index: i, animated: true }); setIndex(i); }}>
            <Animated.View style={[styles.dot, i === index && { backgroundColor: slide.color, width: 20 }]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={[styles.nextBtn, { backgroundColor: slide.color, marginBottom: insets.bottom + spacing.lg }]}
        onPress={goNext}
        activeOpacity={0.85}
      >
        <Text style={styles.nextBtnText}>{isLast ? "Let's Go! 🚀" : 'Next'}</Text>
        {!isLast && <Ionicons name="arrow-forward" size={20} color={colors.text.inverse} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1, backgroundColor: colors.background.primary,
    alignItems: 'center',
  },
  skipBtn: {
    position: 'absolute', top: 56, right: spacing.lg, zIndex: 10,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  skipText: { ...typography.body, color: colors.text.tertiary },
  slide: {
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xxl, paddingTop: 60,
  },
  emojiRing: {
    width: 160, height: 160, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xxl, position: 'relative',
  },
  emojiGlow: {
    position: 'absolute', width: 160, height: 160,
    borderRadius: radius.full, filter: 'blur(20px)',
  },
  emojiText: { fontSize: 80 },
  slideTitle: {
    ...typography.display, color: colors.text.primary,
    textAlign: 'center', lineHeight: 46, marginBottom: spacing.lg,
  },
  slideSub: {
    ...typography.body, color: colors.text.secondary,
    textAlign: 'center', lineHeight: 24, maxWidth: 300,
  },
  progressTrack: {
    width: '80%', height: 3, backgroundColor: colors.background.tertiary,
    borderRadius: radius.full, overflow: 'hidden', marginBottom: spacing.xl,
  },
  progressFill: { height: '100%', borderRadius: radius.full },
  dots: {
    flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.border.default,
  },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl, borderRadius: radius.full,
    marginHorizontal: spacing.lg, width: '80%',
  },
  nextBtnText: { ...typography.h3, color: colors.text.inverse },
});
