import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, PrimaryButton, SecondaryButton } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="rocket" size={48} color={colors.accent.primary} />
          </View>
          <Text style={styles.appName}>EntrepreneurAI</Text>
          <Text style={styles.tagline}>Build Your Future, One Lesson at a Time</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <FeatureItem 
            icon="bulb-outline"
            title="AI-Powered Learning"
            description="Personalized coaching for your journey"
          />
          <FeatureItem 
            icon="trending-up-outline"
            title="Track Progress"
            description="Build your hustle score and streak"
          />
          <FeatureItem 
            icon="people-outline"
            title="Real Skills"
            description="Business, marketing, and leadership"
          />
        </View>
      </View>

      {/* CTA Buttons */}
      <View style={styles.ctaSection}>
        <PrimaryButton 
          title="Get Started"
          onPress={() => router.push('/onboarding')}
        />
        <SecondaryButton 
          title="I already have an account"
          onPress={() => router.push('/login')}
          style={styles.secondaryButton}
        />
      </View>
    </ScreenWrapper>
  );
}

const FeatureItem = ({ icon, title, description }: { icon: keyof typeof Ionicons.glyphMap; title: string; description: string }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Ionicons name={icon} size={24} color={colors.accent.primary} />
    </View>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: spacing.xxl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: radius.xxl,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: `${colors.accent.primary}30`,
  },
  appName: {
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  featuresSection: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  featureDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  ctaSection: {
    paddingBottom: spacing.lg,
  },
  secondaryButton: {
    marginTop: spacing.md,
  },
});
