import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, PrimaryButton, SecondaryButton } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function OnboardingStartScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper scroll>
      <View style={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.iconContainer}>
            <Ionicons name="rocket" size={56} color={colors.accent.primary} />
          </View>
          <Text style={styles.title}>Lass uns starten!</Text>
          <Text style={styles.subtitle}>
            Beantworte 13 kurze Fragen, damit wir deinen{"\n"}persönlichen Hustle-Plan erstellen können.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <FeatureItem 
            emoji="🎯"
            title="Persönliches Profil"
            description="Finde deinen Hustle-Typ heraus"
          />
          <FeatureItem 
            emoji="💼"
            title="Business-Empfehlung"
            description="Das perfekte Modell für dich"
          />
          <FeatureItem 
            emoji="📝"
            title="Action Plan"
            description="Deine ersten konkreten Schritte"
          />
          <FeatureItem 
            emoji="🤖"
            title="AI Coach Style"
            description="So wie du es brauchst"
          />
        </View>

        {/* Time Estimate */}
        <View style={styles.timeBox}>
          <Ionicons name="time-outline" size={20} color={colors.text.secondary} />
          <Text style={styles.timeText}>Dauert nur ~3 Minuten</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <PrimaryButton
          title="Survey starten"
          onPress={() => router.push('/survey/1')}
        />
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => router.replace('/(tabs)/dashboard')}
        >
          <Text style={styles.skipText}>Überspringen</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const FeatureItem = ({ emoji, title, description }: { emoji: string; title: string; description: string }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: spacing.section,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.section,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    borderWidth: 2,
    borderColor: `${colors.accent.primary}30`,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 24,
  },
  features: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  featureEmoji: {
    fontSize: 28,
    marginRight: spacing.lg,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  featureDesc: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.full,
  },
  timeText: {
    ...typography.smallMedium,
    color: colors.text.secondary,
  },
  actions: {
    paddingVertical: spacing.lg,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  skipText: {
    ...typography.body,
    color: colors.text.tertiary,
  },
});
