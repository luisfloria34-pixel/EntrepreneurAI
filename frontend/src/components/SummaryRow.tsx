import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

interface SummaryRowProps {
  icon?: keyof typeof Ionicons.glyphMap;
  emoji?: string;
  label: string;
  value: string;
  color?: string;
}

export const SummaryRow: React.FC<SummaryRowProps> = ({
  icon,
  emoji,
  label,
  value,
  color = colors.text.secondary,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {emoji ? (
          <Text style={styles.emoji}>{emoji}</Text>
        ) : icon ? (
          <Ionicons name={icon} size={18} color={color} style={styles.icon} />
        ) : null}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.valueWrap}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
    gap: spacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  icon: {
    marginRight: spacing.sm,
  },
  label: {
    ...typography.body,
    color: colors.text.secondary,
    flex: 1,
  },
  valueWrap: {
    flex: 2,
    alignItems: 'flex-end',
  },
  value: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    textAlign: 'right',
  },
});
