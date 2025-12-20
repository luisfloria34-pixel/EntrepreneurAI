import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadows } from '../theme';

interface CardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  showChevron?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  iconColor = colors.accent.primary,
  onPress,
  style,
  variant = 'default',
  showChevron = false,
}) => {
  const variantStyles = {
    default: styles.default,
    elevated: [styles.elevated, shadows.sm],
    outlined: styles.outlined,
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.card, variantStyles[variant], style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {(icon || title || subtitle) && (
        <View style={styles.header}>
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
              <Ionicons name={icon} size={22} color={iconColor} />
            </View>
          )}
          <View style={styles.textContainer}>
            {title && <Text style={styles.title} numberOfLines={1}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>}
          </View>
          {(onPress || showChevron) && (
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          )}
        </View>
      )}
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  default: {},
  elevated: {
    backgroundColor: colors.background.elevated,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
