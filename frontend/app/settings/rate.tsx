import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton, SecondaryButton } from '../../src/components';
import { spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import * as StoreReview from 'expo-store-review';
import * as Haptics from 'expo-haptics';

export default function RateScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (rating === 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (rating >= 5) {
      if (await StoreReview.hasAction()) {
        await StoreReview.requestReview();
      }
      setSubmitted(true);
    } else if (rating >= 1) {
      Linking.openURL(
        `mailto:support@entrepreneurai.com?subject=Feedback (${rating} stars)&body=Hi EntrepreneurAI team,%0D%0A%0D%0AHere is my feedback:%0D%0A`
      );
      setSubmitted(true);
    }
  }

  const ratingLabel = rating === 5 ? '😍 Amazing!' : rating === 4 ? '😄 Great!' : rating === 3 ? '🙂 Good' : rating === 2 ? '😕 Okay' : rating === 1 ? '😞 Poor' : '';

  if (submitted) {
    return (
      <ScreenWrapper>
        <AppHeader title={t('titleRate')} showBack onBack={() => router.back()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
          <View style={{ width: 100, height: 100, borderRadius: radius.full, backgroundColor: `${colors.semantic.success}15`, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xxl }}>
            <Ionicons name="checkmark-circle" size={60} color={colors.semantic.success} />
          </View>
          <Text style={{ ...typography.h2, color: colors.text.primary, textAlign: 'center' }}>Thank you! 🙏</Text>
          <Text style={{ ...typography.body, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.md }}>
            {rating >= 4 ? 'Your support means the world to us!' : 'Your feedback helps us improve!'}
          </Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: spacing.xxl }}>
            <Text style={{ ...typography.bodyMedium, color: colors.accent.primary }}>{t('back')}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title={t('titleRate')} showBack onBack={() => router.back()} />

      <View style={{ flex: 1, paddingTop: spacing.xxl }}>
        <View style={{ alignItems: 'center', marginBottom: spacing.xxxl }}>
          <View style={{ width: 100, height: 100, borderRadius: radius.full, backgroundColor: `${colors.semantic.error}15`, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xxl }}>
            <Ionicons name="heart" size={48} color={colors.semantic.error} />
          </View>
          <Text style={{ ...typography.h1, color: colors.text.primary, textAlign: 'center' }}>Enjoying the app?</Text>
          <Text style={{ ...typography.body, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.md, paddingHorizontal: spacing.xxl }}>
            Your rating helps us reach more aspiring entrepreneurs!
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.lg }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => { setRating(star); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              style={{ padding: spacing.sm }}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={44}
                color={star <= rating ? colors.semantic.warning : colors.text.muted}
              />
            </TouchableOpacity>
          ))}
        </View>

        {rating > 0 && (
          <Text style={{ ...typography.h3, color: colors.text.primary, textAlign: 'center', marginBottom: spacing.xxl }}>
            {ratingLabel}
          </Text>
        )}

        <View style={{ backgroundColor: colors.background.card, borderRadius: radius.lg, padding: spacing.xl, flexDirection: 'row' }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ ...typography.h2, color: colors.semantic.warning }}>4.9</Text>
            <Text style={{ ...typography.caption, color: colors.text.secondary, marginTop: spacing.xs }}>Average Rating</Text>
          </View>
          <View style={{ width: 1, backgroundColor: colors.border.default }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ ...typography.h2, color: colors.semantic.warning }}>12K+</Text>
            <Text style={{ ...typography.caption, color: colors.text.secondary, marginTop: spacing.xs }}>Reviews</Text>
          </View>
        </View>
      </View>

      <View style={{ paddingVertical: spacing.lg }}>
        <PrimaryButton title={t('submit')} onPress={handleSubmit} disabled={rating === 0} />
        <SecondaryButton title={t('maybeLater')} onPress={() => router.back()} style={{ marginTop: spacing.md }} />
      </View>
    </ScreenWrapper>
  );
}
