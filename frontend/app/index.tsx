import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, PrimaryButton, SecondaryButton } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper scroll padded>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="rocket" size={48} color={colors.accent.primary} />
          </View>
          <Text style={styles.appName}>EntrepreneurAI</Text>
          <Text style={styles.tagline}>Build Your Future,{"\n"}One Lesson at a Time</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <FeatureItem 
            icon="bulb-outline"
            title="AI-Powered Learning"
            description="Personal coaching tailored to your goals"
          />
          <FeatureItem 
            icon="trending-up-outline"
            title="Track Your Progress"
            description="Build your hustle score and maintain streaks"
          />
          <FeatureItem 
            icon="people-outline"
            title="Join the Community"
            description="Connect with fellow entrepreneurs"
          />
        </View>
      </View>

      {/* CTA */}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: spacing.section,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.section,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: radius.xxl,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    borderWidth: 2,
    borderColor: `${colors.accent.primary}30`,
  },
  appName: {
    ...typography.display,
    color: colors.text.primary,
    letterSpacing: -1,
  },
  tagline: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    gap: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  featureDescription: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  ctaSection: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  secondaryButton: {
    marginTop: spacing.md,
  },
});
