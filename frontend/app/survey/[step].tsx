import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenWrapper, PrimaryButton, OptionCard, MultiSelectChip, SurveyHeader } from '../../src/components';
import { colors, spacing, typography } from '../../src/theme';
import { surveyQuestions } from '../../src/data/surveyData';
import { useOnboarding } from '../../src/context/OnboardingContext';

export default function SurveyScreen() {
  const router = useRouter();
  const { step } = useLocalSearchParams();
  const { answers, setAnswer } = useOnboarding();
  
  const currentStep = parseInt(step as string) || 1;
  const questionIndex = currentStep - 1;
  const question = surveyQuestions[questionIndex];
  const totalSteps = surveyQuestions.length;

  if (!question) {
    router.replace('/survey/result');
    return null;
  }

  const currentAnswer = answers[question.id];
  const isMulti = question.type === 'multi';
  const selectedOptions = isMulti 
    ? (currentAnswer as string[] || []) 
    : (currentAnswer as string || '');

  const handleSelect = (optionId: string) => {
    if (isMulti) {
      const current = selectedOptions as string[];
      if (current.includes(optionId)) {
        setAnswer(question.id, current.filter(id => id !== optionId));
      } else {
        setAnswer(question.id, [...current, optionId]);
      }
    } else {
      setAnswer(question.id, optionId);
    }
  };

  const handleContinue = () => {
    if (currentStep < totalSteps) {
      router.push(`/survey/${currentStep + 1}`);
    } else {
      router.push('/survey/result');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      router.back();
    } else {
      router.replace('/onboarding');
    }
  };

  const canContinue = isMulti 
    ? (selectedOptions as string[]).length > 0 
    : !!selectedOptions;

  return (
    <ScreenWrapper>
      <SurveyHeader 
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.questionSection}>
          <Text style={styles.question}>{question.question}</Text>
          {question.subtitle && (
            <Text style={styles.subtitle}>{question.subtitle}</Text>
          )}
        </View>

        {isMulti ? (
          <View style={styles.chipsContainer}>
            {question.options.map(option => (
              <MultiSelectChip
                key={option.id}
                label={option.label}
                emoji={option.emoji}
                selected={(selectedOptions as string[]).includes(option.id)}
                onPress={() => handleSelect(option.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.optionsContainer}>
            {question.options.map(option => (
              <OptionCard
                key={option.id}
                label={option.label}
                emoji={option.emoji}
                selected={selectedOptions === option.id}
                onPress={() => handleSelect(option.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={currentStep === totalSteps ? 'Auswertung ansehen' : 'Weiter'}
          onPress={handleContinue}
          disabled={!canContinue}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  questionSection: {
    marginBottom: spacing.xxxl,
    paddingTop: spacing.lg,
  },
  question: {
    ...typography.h1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  optionsContainer: {},
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
