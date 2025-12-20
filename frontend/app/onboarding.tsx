import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, PrimaryButton, SecondaryButton } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../src/context/OnboardingContext';
import { surveyQuestions } from '../src/data/surveyData';

export default function OnboardingStartScreen() {
  const router = useRouter();
  const { currentStep, isCompleted, isLoading, answers } = useOnboarding();

  // Check if user has partial progress
  const hasProgress = Object.keys(answers).length > 0 && currentStep > 1;
  const progressPercent = Math.round((Object.keys(answers).length / surveyQuestions.length) * 100);

  const handleStartSurvey = () => {
    if (hasProgress && currentStep <= surveyQuestions.length) {
      // Resume from last step
      router.push(`/survey/${currentStep}`);
    } else {
      // Start fresh
      router.push('/survey/1');
    }
  };

  const handleStartFresh = () => {
    router.push('/survey/1');
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Laden...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // If already completed, show option to view profile or restart
  if (isCompleted) {
    return (
      <ScreenWrapper scroll>
        <View style={styles.content}>
          <View style={styles.hero}>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle" size={56} color={colors.semantic.success} />
            </View>
            <Text style={styles.title}>Du hast bereits ein Profil!</Text>
            <Text style={styles.subtitle}>
              Du kannst direkt zum Dashboard gehen oder das Survey neu machen.
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="Zum Dashboard"
            onPress={() => router.replace('/(tabs)/dashboard')}
          />
          <SecondaryButton
            title="Survey neu starten"
            onPress={handleStartFresh}
            style={styles.secondaryButton}
          />
        </View>
      </ScreenWrapper>
    );
  }

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

        {/* Resume Progress Card */}
        {hasProgress && (
          <View style={styles.resumeCard}>
            <View style={styles.resumeHeader}>
              <Ionicons name="bookmark" size={24} color={colors.accent.primary} />
              <Text style={styles.resumeTitle}>Fortschritt gespeichert</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
              </View>
              <Text style={styles.progressText}>{progressPercent}% abgeschlossen</Text>
            </View>
            <Text style={styles.resumeText}>
              Du warst bei Frage {currentStep} von {surveyQuestions.length}
            </Text>
          </View>
        )}

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
          title={hasProgress ? 'Fortsetzen' : 'Survey starten'}
          onPress={handleStartSurvey}
        />
        {hasProgress && (
          <SecondaryButton
            title="Neu starten"
            onPress={handleStartFresh}
            style={styles.secondaryButton}
          />
        )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
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
  resumeCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  resumeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  resumeTitle: {
    ...typography.bodyMedium,
    color: colors.accent.primary,
  },
  progressBarContainer: {
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: radius.full,
  },
  progressText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  resumeText: {
    ...typography.small,
    color: colors.text.secondary,
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
  secondaryButton: {
    marginTop: spacing.md,
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
