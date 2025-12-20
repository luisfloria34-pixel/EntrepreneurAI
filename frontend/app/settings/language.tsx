import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';

const languages = [
  { id: 'de', name: 'Deutsch', native: 'Deutsch', flag: '🇩🇪' },
  { id: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { id: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { id: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { id: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('de');

  return (
    <ScreenWrapper>
      <AppHeader 
        title="App Language" 
        showBack 
        onBack={() => router.back()}
      />

      <View style={styles.content}>
        <Text style={styles.description}>
          Select your preferred language. The app will be displayed in this language.
        </Text>

        <View style={styles.list}>
          {languages.map((lang) => (
            <TouchableOpacity 
              key={lang.id}
              style={[
                styles.item,
                selected === lang.id && styles.itemSelected
              ]}
              onPress={() => setSelected(lang.id)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <View style={styles.textContainer}>
                <Text style={styles.name}>{lang.name}</Text>
                <Text style={styles.native}>{lang.native}</Text>
              </View>
              {selected === lang.id && (
                <Ionicons name="checkmark-circle" size={24} color={colors.accent.primary} />
              )}
            </TouchableOpacity>
          ))}
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
  flag: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  native: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
});
