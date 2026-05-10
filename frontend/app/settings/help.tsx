import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, LayoutAnimation } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import * as Haptics from 'expo-haptics';

const FAQ_ITEMS = [
  { q: 'How do streaks work?', a: 'Complete at least one lesson each day to maintain your streak. Streaks reset at midnight if you miss a day.' },
  { q: 'How do I earn XP?', a: 'You earn XP by completing lessons (+50 XP each), finishing daily tasks, and completing challenges.' },
  { q: 'What does Pro include?', a: 'Pro unlocks unlimited AI Coach messages, all courses, community posting, advanced analytics, and more.' },
  { q: 'Can I use the app offline?', a: 'The AI Coach and community require internet. Course content can be accessed offline after loading.' },
  { q: 'How do I cancel my subscription?', a: 'Go to Settings > Subscription and tap "Cancel Subscription". You can also manage it in the App Store or Google Play.' },
  { q: 'How do I upload Proof of Work?', a: 'Go to your Profile, tap Proof of Work, then the + button to upload a photo of your achievement.' },
  { q: 'What are badges?', a: 'Badges are achievements you earn by hitting milestones like completing lessons, maintaining streaks, and finishing courses.' },
  { q: 'How does the AI Coach work?', a: 'The AI Coach uses GPT technology to give you personalized business advice. Free users get 5 messages per day, Pro users get unlimited.' },
  { q: 'Can I change my username?', a: 'Currently, usernames are set at signup. Email us to request a change.' },
  { q: 'How do I reset my progress?', a: 'Contact support at support@entrepreneurai.com to reset your progress.' },
];

function FAQItem({ item }: { item: typeof FAQ_ITEMS[0] }) {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(v => !v);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  return (
    <TouchableOpacity onPress={toggle} activeOpacity={0.8}
      style={{ paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border.default }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ ...typography.bodyMedium, color: colors.text.primary, flex: 1, marginRight: spacing.md }}>{item.q}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.text.tertiary} />
      </View>
      {open && (
        <Text style={{ ...typography.body, color: colors.text.secondary, marginTop: spacing.md, lineHeight: 22 }}>
          {item.a}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function HelpSettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();

  function handleEmail() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('mailto:support@entrepreneurai.com?subject=EntrepreneurAI Support');
  }

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title={t('titleHelp')} />

      <Text style={{ ...typography.captionMedium, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: 1, marginTop: spacing.xl, marginBottom: spacing.sm, marginLeft: spacing.xs }}>
        Contact Us
      </Text>
      <View style={{ backgroundColor: colors.background.card, borderRadius: radius.lg, paddingHorizontal: spacing.lg }}>
        <TouchableOpacity onPress={handleEmail}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border.default }}>
          <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: `${colors.accent.primary}20`, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md }}>
            <Ionicons name="mail-outline" size={22} color={colors.accent.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...typography.bodyMedium, color: colors.text.primary }}>Email Support</Text>
            <Text style={{ ...typography.small, color: colors.text.secondary, marginTop: spacing.xs }}>support@entrepreneurai.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/getting-started')}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.lg }}>
          <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: `${'#10B981'}20`, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md }}>
            <Ionicons name="rocket-outline" size={22} color="#10B981" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...typography.bodyMedium, color: colors.text.primary }}>Getting Started Guide</Text>
            <Text style={{ ...typography.small, color: colors.text.secondary, marginTop: spacing.xs }}>7 steps to your first win</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
      </View>

      <Text style={{ ...typography.captionMedium, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: 1, marginTop: spacing.xxl, marginBottom: spacing.sm, marginLeft: spacing.xs }}>
        FAQ
      </Text>
      <View style={{ backgroundColor: colors.background.card, borderRadius: radius.lg, paddingHorizontal: spacing.lg }}>
        {FAQ_ITEMS.map((item, i) => (
          <View key={i} style={i === FAQ_ITEMS.length - 1 ? { borderBottomWidth: 0 } : {}}>
            <FAQItem item={item} />
          </View>
        ))}
      </View>
    </ScreenWrapper>
  );
}
