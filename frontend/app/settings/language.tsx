import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { Language } from '../../src/data/translations';
import * as Haptics from 'expo-haptics';

const LANGUAGES: { id: Language; name: string; native: string; flag: string }[] = [
  { id: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { id: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { id: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { id: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { id: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  async function handleSelect(lang: Language) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setLanguage(lang);
  }

  return (
    <ScreenWrapper scroll>
      <AppHeader title={t('titleLanguage')} showBack onBack={() => router.back()} />

      <Text style={{ ...typography.body, color: colors.text.secondary, marginBottom: spacing.xxl }}>
        Select your preferred language. The app will switch instantly.
      </Text>

      <View style={{ backgroundColor: colors.background.card, borderRadius: radius.lg }}>
        {LANGUAGES.map((lang, i) => {
          const selected = language === lang.id;
          return (
            <TouchableOpacity
              key={lang.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: spacing.lg,
                borderBottomWidth: i < LANGUAGES.length - 1 ? 1 : 0,
                borderBottomColor: colors.border.default,
                backgroundColor: selected ? `${colors.accent.primary}10` : 'transparent',
              }}
              onPress={() => handleSelect(lang.id)}
            >
              <Text style={{ fontSize: 28, marginRight: spacing.md }}>{lang.flag}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ ...typography.bodyMedium, color: colors.text.primary }}>{lang.native}</Text>
                <Text style={{ ...typography.small, color: colors.text.tertiary, marginTop: spacing.xs }}>{lang.name}</Text>
              </View>
              {selected && <Ionicons name="checkmark-circle" size={24} color={colors.accent.primary} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScreenWrapper>
  );
}
