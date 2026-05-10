import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { spacing, typography, radius } from '../../src/theme';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';

function Section({ title, body }: { title: string; body: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: spacing.xxl }}>
      <Text style={{ ...typography.h3, color: colors.text.primary, marginBottom: spacing.md }}>{title}</Text>
      <Text style={{ ...typography.body, color: colors.text.secondary, lineHeight: 24 }}>{body}</Text>
    </View>
  );
}

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title={t('titlePrivacyPolicy')} />

      <Text style={{ ...typography.caption, color: colors.text.muted, marginBottom: spacing.xxl }}>
        Last updated: January 1, 2026
      </Text>

      <Section
        title="1. Data We Collect"
        body="We collect information you provide directly (name, email, profile data), usage data (lessons completed, streaks, XP), and device information (OS version, device type). We also collect AI conversation history to provide personalized coaching."
      />

      <Section
        title="2. How We Use Your Data"
        body="Your data is used to: provide personalized learning experiences, track your progress and achievements, deliver AI coaching, send notifications (with your permission), improve our services, and process payments securely through the App Store or Google Play."
      />

      <Section
        title="3. Data Storage"
        body="All data is stored securely using Supabase (PostgreSQL) with row-level security. Data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We do not sell your personal data to third parties."
      />

      <Section
        title="4. Third-Party Services"
        body="We use: Supabase for database and authentication, RevenueCat for subscription management, Groq for AI coaching, Expo for mobile delivery. Each provider has their own privacy policy and we encourage you to review them."
      />

      <Section
        title="5. Your Rights (GDPR)"
        body="Under GDPR and applicable data protection laws, you have the right to: access your personal data, rectify inaccurate data, erase your data ('right to be forgotten'), restrict processing, data portability, and object to processing. To exercise these rights, contact us at privacy@entrepreneurai.com."
      />

      <Section
        title="6. Data Retention"
        body="We retain your data for as long as your account is active. Upon account deletion, your data is permanently removed within 30 days. Some anonymized analytics data may be retained for service improvement."
      />

      <Section
        title="7. Children's Privacy"
        body="EntrepreneurAI is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13."
      />

      <Section
        title="8. Changes to This Policy"
        body="We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or via email. Continued use after changes constitutes acceptance of the updated policy."
      />

      <Section
        title="9. Contact Us"
        body="For privacy-related questions or to exercise your rights, contact us at:\n\nEmail: privacy@entrepreneurai.com\nEntrepreneurAI GmbH\n2026 EntrepreneurAI. All rights reserved."
      />
    </ScreenWrapper>
  );
}
