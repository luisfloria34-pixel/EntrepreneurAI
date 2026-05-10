import React from 'react';
import { View, Text, TouchableOpacity, Share, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import * as StoreReview from 'expo-store-review';
import * as Haptics from 'expo-haptics';

export default function AboutSettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();

  async function handleRate() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (await StoreReview.hasAction()) {
      await StoreReview.requestReview();
    } else {
      router.push('/settings/rate');
    }
  }

  async function handleShare() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Share.share({
      message: 'Check out EntrepreneurAI — the AI-powered app for entrepreneurs! 🚀',
    });
  }

  async function handleInstagram() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Linking.openURL('https://www.instagram.com/fuelradar.app_');
  }

  function Row({ icon, label, onPress, color, last }: { icon: string; label: string; onPress: () => void; color?: string; last?: boolean }) {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: spacing.lg,
          borderBottomWidth: last ? 0 : 1,
          borderBottomColor: colors.border.default,
        }}
        onPress={onPress}
      >
        <Text style={{ ...typography.body, color: color ?? colors.text.primary }}>{label}</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
      </TouchableOpacity>
    );
  }

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title={t('titleAbout')} />

      <View style={{ alignItems: 'center', paddingVertical: spacing.xxxl }}>
        <View style={{
          width: 80, height: 80, borderRadius: radius.xl,
          backgroundColor: `${colors.accent.primary}15`,
          alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
        }}>
          <Ionicons name="rocket" size={40} color={colors.accent.primary} />
        </View>
        <Text style={{ ...typography.h2, color: colors.text.primary }}>EntrepreneurAI</Text>
        <Text style={{ ...typography.body, color: colors.text.secondary, marginTop: spacing.sm }}>Version 1.0.0</Text>
      </View>

      <View style={{ backgroundColor: colors.background.card, borderRadius: radius.lg, paddingHorizontal: spacing.lg }}>
        <Row icon="star-outline" label="Rate the App" onPress={handleRate} />
        <Row icon="share-outline" label="Share with Friends" onPress={handleShare} />
        <Row icon="logo-instagram" label="Follow on Instagram" onPress={handleInstagram} last />
      </View>

      <View style={{ backgroundColor: colors.background.card, borderRadius: radius.lg, paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
        <Row icon="document-text-outline" label={t('titlePrivacyPolicy')} onPress={() => router.push('/settings/privacy-policy')} />
        <Row icon="reader-outline" label={t('titleTerms')} onPress={() => router.push('/settings/terms')} />
        <Row icon="code-outline" label={t('titleLicenses')} onPress={() => router.push('/settings/licenses')} last />
      </View>

      <Text style={{
        ...typography.caption,
        color: colors.text.muted,
        textAlign: 'center',
        marginTop: spacing.xxxl,
        lineHeight: 20,
      }}>
        © 2026 EntrepreneurAI.{'\n'}All rights reserved.
      </Text>
    </ScreenWrapper>
  );
}
