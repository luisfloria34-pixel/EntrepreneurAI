import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
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
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  disabled: {
    borderColor: colors.border.default,
  },
  text: {
    ...typography.bodyMedium,
    color: colors.accent.primary,
  },
  textDisabled: {
    color: colors.text.tertiary,
  },
});
