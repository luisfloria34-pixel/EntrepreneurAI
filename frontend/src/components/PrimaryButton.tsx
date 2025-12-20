import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { colors, spacing, typography, radius, shadows } from '../theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  size = 'large',
}) => {
  const sizeStyles = {
    small: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
    medium: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
    large: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl },
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.text.inverse} size="small" />
      ) : (
        <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent.primary,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    ...shadows.glow,
  },
  disabled: {
    backgroundColor: colors.background.tertiary,
    shadowOpacity: 0,
  },
  text: {
    ...typography.bodyMedium,
    color: colors.text.inverse,
  },
  textDisabled: {
    color: colors.text.tertiary,
  },
});
