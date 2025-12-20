import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, PrimaryButton } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { onboardingQuestions } from '../src/data/dummyData';

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const question = onboardingQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / onboardingQuestions.length) * 100;

  const handleContinue = () => {
    if (currentQuestion < onboardingQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      // Onboarding complete, go to main app
      router.replace('/(tabs)/dashboard');
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentQuestion + 1} of {onboardingQuestions.length}
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Question */}
        <View style={styles.questionSection}>
          <Text style={styles.question}>{question.question}</Text>
          <Text style={styles.helperText}>Select one option to continue</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedOption === option.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedOption(option.id)}
              activeOpacity={0.8}
            >
              <View style={[
                styles.optionIcon,
                selectedOption === option.id && styles.optionIconSelected,
              ]}>
                <Ionicons 
                  name={option.icon as keyof typeof Ionicons.glyphMap} 
                  size={28} 
                  color={selectedOption === option.id ? colors.text.inverse : colors.accent.primary} 
                />
              </View>
              <Text style={[
                styles.optionText,
                selectedOption === option.id && styles.optionTextSelected,
              ]}>
                {option.text}
              </Text>
              {selectedOption === option.id && (
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark-circle" size={24} color={colors.accent.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* CTA Button */}
      <View style={styles.ctaSection}>
        <PrimaryButton 
          title={currentQuestion < onboardingQuestions.length - 1 ? 'Continue' : 'Start Learning'}
          onPress={handleContinue}
          disabled={!selectedOption}
        />
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => router.replace('/(tabs)/dashboard')}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: radius.full,
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  questionSection: {
    paddingTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  question: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    lineHeight: 34,
  },
  helperText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  optionsContainer: {
    gap: spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: colors.accent.primary,
    backgroundColor: `${colors.accent.primary}10`,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  optionIconSelected: {
    backgroundColor: colors.accent.primary,
  },
  optionText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  optionTextSelected: {
    color: colors.accent.primary,
  },
  checkIcon: {
    marginLeft: spacing.sm,
  },
  ctaSection: {
    paddingVertical: spacing.md,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  skipText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
});
