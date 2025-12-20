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
      router.replace('/(tabs)/dashboard');
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{currentQuestion + 1}/{onboardingQuestions.length}</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.questionSection}>
          <Text style={styles.question}>{question.question}</Text>
          <Text style={styles.helperText}>Select one option to continue</Text>
        </View>

        <View style={styles.optionsContainer}>
          {question.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedOption === option.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedOption(option.id)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.optionIcon,
                selectedOption === option.id && styles.optionIconSelected,
              ]}>
                <Ionicons 
                  name={option.icon as keyof typeof Ionicons.glyphMap} 
                  size={26} 
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
                <Ionicons name="checkmark-circle" size={24} color={colors.accent.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
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
    ...typography.smallMedium,
    color: colors.text.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  questionSection: {
    paddingTop: spacing.xxl,
    marginBottom: spacing.xxxl,
  },
  question: {
    ...typography.h1,
    color: colors.text.primary,
  },
  helperText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  optionsContainer: {
    gap: spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: colors.accent.primary,
    backgroundColor: `${colors.accent.primary}10`,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  optionIconSelected: {
    backgroundColor: colors.accent.primary,
  },
  optionText: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  optionTextSelected: {
    color: colors.accent.primary,
  },
  ctaSection: {
    paddingHorizontal: spacing.lg,
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
