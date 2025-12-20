import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

interface BadgeProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
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
    purple: { bg: `${colors.semantic.purple}20`, text: colors.semantic.purple },
  };

  const sizeStyles = {
    small: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
    medium: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  };

  const iconSize = size === 'small' ? 12 : 14;

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
      <Text style={[
        size === 'small' ? styles.labelSmall : styles.label,
        { color: variantColors[variant].text }
      ]}>
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
    ...typography.smallMedium,
  },
  labelSmall: {
    ...typography.captionMedium,
  },
});
