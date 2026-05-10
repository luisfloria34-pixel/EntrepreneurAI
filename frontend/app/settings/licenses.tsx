import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { spacing, typography, radius } from '../../src/theme';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';

const LICENSES = [
  { name: 'React Native', version: '0.76.x', license: 'MIT', url: 'https://github.com/facebook/react-native' },
  { name: 'Expo', version: '52.x', license: 'MIT', url: 'https://github.com/expo/expo' },
  { name: 'Expo Router', version: '4.x', license: 'MIT', url: 'https://github.com/expo/expo' },
  { name: 'Supabase JS', version: '2.x', license: 'MIT', url: 'https://github.com/supabase/supabase-js' },
  { name: '@react-native-async-storage', version: '2.x', license: 'MIT', url: 'https://github.com/react-native-async-storage/async-storage' },
  { name: 'React Navigation', version: '6.x', license: 'MIT', url: 'https://github.com/react-navigation/react-navigation' },
  { name: 'Expo Haptics', version: '14.x', license: 'MIT', url: 'https://github.com/expo/expo' },
  { name: 'Expo Image Picker', version: '16.x', license: 'MIT', url: 'https://github.com/expo/expo' },
  { name: 'Expo Notifications', version: '0.29.x', license: 'MIT', url: 'https://github.com/expo/expo' },
  { name: 'Expo Store Review', version: '8.x', license: 'MIT', url: 'https://github.com/expo/expo' },
  { name: 'Expo Web Browser', version: '14.x', license: 'MIT', url: 'https://github.com/expo/expo' },
  { name: 'React Native Purchases', version: '8.x', license: 'MIT', url: 'https://github.com/RevenueCat/react-native-purchases' },
  { name: '@expo/vector-icons', version: '14.x', license: 'MIT', url: 'https://github.com/expo/vector-icons' },
  { name: 'React Native Safe Area Context', version: '4.x', license: 'MIT', url: 'https://github.com/th3rdwave/react-native-safe-area-context' },
  { name: 'TypeScript', version: '5.x', license: 'Apache-2.0', url: 'https://github.com/microsoft/TypeScript' },
];

export default function LicensesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title={t('titleLicenses')} />

      <Text style={{ ...typography.body, color: colors.text.secondary, marginBottom: spacing.xxl }}>
        EntrepreneurAI is built with open source software. Thank you to all contributors.
      </Text>

      <View style={{ backgroundColor: colors.background.card, borderRadius: radius.lg, overflow: 'hidden' }}>
        {LICENSES.map((lib, i) => (
          <TouchableOpacity
            key={lib.name}
            onPress={() => Linking.openURL(lib.url)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: spacing.lg,
              borderBottomWidth: i < LICENSES.length - 1 ? 1 : 0,
              borderBottomColor: colors.border.default,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ ...typography.bodyMedium, color: colors.text.primary }}>{lib.name}</Text>
              <Text style={{ ...typography.caption, color: colors.text.tertiary, marginTop: spacing.xs }}>v{lib.version}</Text>
            </View>
            <View style={{
              backgroundColor: `${colors.accent.primary}15`,
              paddingHorizontal: spacing.sm, paddingVertical: 3,
              borderRadius: radius.full,
            }}>
              <Text style={{ ...typography.captionMedium, color: colors.accent.primary }}>{lib.license}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ ...typography.caption, color: colors.text.muted, textAlign: 'center', marginTop: spacing.xxl }}>
        Tap any package to view its repository.
      </Text>
    </ScreenWrapper>
  );
}
