import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

interface MultiSelectChipProps {
  label: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
}

export const MultiSelectChip: React.FC<MultiSelectChipProps> = ({
  label,
  emoji,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={[
        styles.label,
        selected && styles.labelSelected,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: colors.accent.primary,
    backgroundColor: `${colors.accent.primary}15`,
  },
  emoji: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  label: {
    ...typography.smallMedium,
    color: colors.text.primary,
  },
  labelSelected: {
    color: colors.accent.primary,
  },
});
