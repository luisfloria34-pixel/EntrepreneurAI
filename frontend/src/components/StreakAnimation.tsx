import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, typography, radius, spacing } from '../theme';

interface Props {
  streak: number;
  visible: boolean;
  onDone?: () => void;
}

export function StreakAnimation({ streak, visible, onDone }: Props) {
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    translateY.setValue(0);
    scale.setValue(0.6);
    opacity.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1.1, friction: 4, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: -12, friction: 5, useNativeDriver: true }),
      ]),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.delay(1400),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -40, duration: 300, useNativeDriver: true }),
      ]),
    ]).start(() => onDone?.());
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { opacity, transform: [{ translateY }, { scale }] }]}
      pointerEvents="none"
    >
      <Text style={styles.fire}>🔥</Text>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{streak} Day Streak!</Text>
        <Text style={styles.sub}>Keep it up!</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 80, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.background.elevated,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderRadius: radius.full, zIndex: 100,
    borderWidth: 1, borderColor: '#F59E0B40',
    shadowColor: '#F59E0B', shadowOpacity: 0.4,
    shadowRadius: 12, shadowOffset: { width: 0, height: 0 },
  },
  fire: { fontSize: 28 },
  textWrap: {},
  title: { ...typography.bodyMedium, color: '#F59E0B' },
  sub: { ...typography.caption, color: colors.text.secondary },
});
