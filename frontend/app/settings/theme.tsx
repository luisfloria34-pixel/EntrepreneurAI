import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';

const themes = [
  { id: 'dark', name: 'Dark Mode', icon: 'moon', description: 'Easy on the eyes, perfect for night hustling' },
  { id: 'light', name: 'Light Mode', icon: 'sunny', description: 'Bright and clean interface' },
  { id: 'system', name: 'System', icon: 'phone-portrait', description: 'Follows your device settings' },
];

export default function ThemeScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('dark');

  return (
    <ScreenWrapper>
      <AppHeader 
        title="Theme" 
        showBack 
        onBack={() => router.back()}
      />

      <View style={styles.content}>
        <Text style={styles.description}>
          Choose your preferred theme. Dark mode is recommended for the best experience.
        </Text>

        <View style={styles.list}>
          {themes.map((theme) => (
            <TouchableOpacity 
              key={theme.id}
              style={[
                styles.item,
                selected === theme.id && styles.itemSelected
              ]}
              onPress={() => setSelected(theme.id)}
            >
              <View style={[
                styles.iconContainer,
                selected === theme.id && styles.iconContainerSelected
              ]}>
                <Ionicons 
                  name={theme.icon as keyof typeof Ionicons.glyphMap} 
                  size={24} 
                  color={selected === theme.id ? colors.accent.primary : colors.text.tertiary} 
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.name}>{theme.name}</Text>
                <Text style={styles.descText}>{theme.description}</Text>
              </View>
              {selected === theme.id && (
                <Ionicons name="checkmark-circle" size={24} color={colors.accent.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.accent.primary} />
          <Text style={styles.infoText}>
            Dark mode is currently active. Light mode coming soon!
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xxl,
  },
  list: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    marginBottom: spacing.xxl,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  itemSelected: {
    backgroundColor: `${colors.accent.primary}10`,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: `${colors.accent.primary}20`,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  descText: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: `${colors.accent.primary}10`,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  infoText: {
    flex: 1,
    ...typography.small,
    color: colors.text.secondary,
  },
});
