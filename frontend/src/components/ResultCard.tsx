import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

interface ResultCardProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  emoji?: string;
  color?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  subtitle,
  icon,
  emoji,
  color = colors.accent.primary,
  children,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        {(emoji || icon) && (
          <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
            {emoji ? (
              <Text style={styles.emoji}>{emoji}</Text>
            ) : icon ? (
              <Ionicons name={icon} size={24} color={color} />
            ) : null}
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  emoji: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
