import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ThemeMode } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import * as Haptics from 'expo-haptics';

export default function ThemeScreen() {
  const router = useRouter();
  const { colors, mode, setTheme } = useTheme();
  const { t } = useLanguage();

  const themes: { id: ThemeMode; labelKey: 'themeDark' | 'themeLight' | 'themeSystem'; descKey: 'themeDarkDesc' | 'themeLightDesc' | 'themeSystemDesc'; icon: string; preview: string }[] = [
    { id: 'dark', labelKey: 'themeDark', descKey: 'themeDarkDesc', icon: 'moon', preview: '#0A0F1E' },
    { id: 'light', labelKey: 'themeLight', descKey: 'themeLightDesc', icon: 'sunny', preview: '#F0F4F8' },
    { id: 'system', labelKey: 'themeSystem', descKey: 'themeSystemDesc', icon: 'phone-portrait', preview: colors.background.primary },
  ];

  async function handleSelect(m: ThemeMode) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setTheme(m);
  }

  return (
    <ScreenWrapper scroll>
      <AppHeader title={t('titleTheme')} showBack onBack={() => router.back()} />

      <Text style={{ ...typography.body, color: colors.text.secondary, marginBottom: spacing.xxl }}>
        {t('themeDarkDesc').replace('Easy on the eyes, perfect for night hustling', 'Choose your preferred appearance')}
      </Text>

      <View style={{ backgroundColor: colors.background.card, borderRadius: radius.lg, marginBottom: spacing.xxl }}>
        {themes.map((theme, i) => {
          const selected = mode === theme.id;
          return (
            <TouchableOpacity
              key={theme.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: spacing.lg,
                borderBottomWidth: i < themes.length - 1 ? 1 : 0,
                borderBottomColor: colors.border.default,
                backgroundColor: selected ? `${colors.accent.primary}10` : 'transparent',
              }}
              onPress={() => handleSelect(theme.id)}
            >
              <View style={{
                width: 48, height: 48, borderRadius: radius.md,
                backgroundColor: selected ? `${colors.accent.primary}20` : colors.background.tertiary,
                alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
              }}>
                <Ionicons
                  name={theme.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={selected ? colors.accent.primary : colors.text.tertiary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...typography.bodyMedium, color: colors.text.primary }}>{t(theme.labelKey)}</Text>
                <Text style={{ ...typography.small, color: colors.text.tertiary, marginTop: spacing.xs }}>{t(theme.descKey)}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View style={{ width: 24, height: 24, borderRadius: radius.full, backgroundColor: theme.preview, borderWidth: 1, borderColor: colors.border.default }} />
                {selected && <Ionicons name="checkmark-circle" size={24} color={colors.accent.primary} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScreenWrapper>
  );
}
