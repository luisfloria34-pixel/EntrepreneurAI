import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { colors, typography, radius, spacing } from '../theme';

interface Props {
  xp: number;
  visible: boolean;
  onDone?: () => void;
}

export function XPAnimation({ xp, visible, onDone }: Props) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (!visible) return;
    translateY.setValue(0);
    opacity.setValue(0);
    scale.setValue(0.7);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]),
      Animated.delay(700),
      Animated.parallel([
        Animated.timing(translateY, { toValue: -60, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    ]).start(() => onDone?.());
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.bubble, { opacity, transform: [{ translateY }, { scale }] }]}
      pointerEvents="none"
    >
      <Text style={styles.text}>+{xp} XP</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute', bottom: 100, alignSelf: 'center', zIndex: 100,
    backgroundColor: colors.semantic.success,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderRadius: radius.full,
    shadowColor: colors.semantic.success, shadowOpacity: 0.5,
    shadowRadius: 12, shadowOffset: { width: 0, height: 0 },
  },
  text: { ...typography.h3, color: colors.text.inverse },
});
