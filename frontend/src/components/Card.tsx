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
}) => {
  const variantStyles = {
    default: styles.default,
    elevated: [styles.elevated, shadows.md],
    outlined: styles.outlined,
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.card, variantStyles[variant], style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {(icon || title || subtitle) && (
        <View style={styles.header}>
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
              <Ionicons name={icon} size={24} color={iconColor} />
            </View>
          )}
          <View style={styles.textContainer}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {onPress && (
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
    padding: spacing.md,
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
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
