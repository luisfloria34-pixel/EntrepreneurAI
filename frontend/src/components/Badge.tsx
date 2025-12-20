import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

interface BadgeProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  icon,
  variant = 'default',
  size = 'medium',
  style,
}) => {
  const variantColors = {
    default: { bg: `${colors.accent.primary}20`, text: colors.accent.primary },
    success: { bg: `${colors.semantic.success}20`, text: colors.semantic.success },
    warning: { bg: `${colors.semantic.warning}20`, text: colors.semantic.warning },
    error: { bg: `${colors.semantic.error}20`, text: colors.semantic.error },
    info: { bg: `${colors.semantic.info}20`, text: colors.semantic.info },
  };

  const sizeStyles = {
    small: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
    medium: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  };

  const iconSize = size === 'small' ? 12 : 16;
  const fontSize = size === 'small' ? typography.fontSize.xs : typography.fontSize.sm;

  return (
    <View
      style={[
        styles.badge,
        sizeStyles[size],
        { backgroundColor: variantColors[variant].bg },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={iconSize}
          color={variantColors[variant].text}
          style={styles.icon}
        />
      )}
      <Text style={[styles.label, { color: variantColors[variant].text, fontSize }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing.xs,
  },
  label: {
    fontWeight: typography.fontWeight.medium,
  },
});
