import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

interface OptionCardProps {
  label: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  label,
  emoji,
  selected,
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selected,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={[
        styles.label,
        selected && styles.labelSelected,
      ]}>
        {label}
      </Text>
      <View style={[
        styles.radio,
        selected && styles.radioSelected,
      ]}>
        {selected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: colors.accent.primary,
    backgroundColor: `${colors.accent.primary}10`,
  },
  disabled: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  label: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  labelSelected: {
    color: colors.accent.primary,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.accent.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
  },
});
