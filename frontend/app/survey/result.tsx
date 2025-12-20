import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, PrimaryButton, SecondaryButton, ResultCard, SummaryRow } from '../../src/components';
import { colors, spacing, typography, radius, shadows } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { HustleProfile } from '../../src/data/surveyData';

export default function SurveyResultScreen() {
  const router = useRouter();
  const { calculateProfile, profile: existingProfile } = useOnboarding();
  const [profile, setProfile] = useState<HustleProfile | null>(existingProfile);

  useEffect(() => {
    if (!existingProfile) {
      const newProfile = calculateProfile();
      setProfile(newProfile);
    }
  }, []);

  if (!profile) {
    return (
      <ScreenWrapper>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Analysiere deine Antworten...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Mein Hustle-Profil: ${profile.hustleType.name} ${profile.hustleType.emoji}\nEmpfohlenes Modell: ${profile.businessModel.name}\nHustle Score: ${profile.hustleScore}\n\n#EntrepreneurAI`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScreenWrapper scroll>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dein Hustle-Profil</Text>
        <Text style={styles.headerSubtitle}>Basierend auf deinen Antworten</Text>
      </View>

      {/* Hustle Score Card */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>{profile.hustleScore}</Text>
          <Text style={styles.scoreLabel}>Score</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={styles.scoreTitle}>Hustle Score</Text>
          <Text style={styles.scoreDesc}>
            {profile.hustleScore >= 80 ? 'Du bist ready für große Dinge!' :
             profile.hustleScore >= 60 ? 'Solide Basis – lass uns loslegen!' :
             'Wir bauen dich auf – Step by Step!'}
          </Text>
        </View>
      </View>

      {/* Hustle Type */}
      <ResultCard
        title={profile.hustleType.name}
        subtitle="Dein Hustle-Typ"
        emoji={profile.hustleType.emoji}
        color={profile.hustleType.color}
      >
        <Text style={styles.cardDescription}>{profile.hustleType.description}</Text>
      </ResultCard>

      {/* Business Model */}
      <ResultCard
        title={profile.businessModel.name}
        subtitle="Empfohlenes Modell"
        emoji={profile.businessModel.emoji}
        color={colors.accent.primary}
      >
        <Text style={styles.cardDescription}>{profile.businessModelReason}</Text>
      </ResultCard>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Dein Setup</Text>
        <SummaryRow 
          emoji={profile.coachStyleEmoji}
          label="Coach-Style" 
          value={profile.coachStyle} 
        />
        <SummaryRow 
          emoji="📊"
          label="Tägliche Tasks" 
          value={`${profile.dailyTasks} Tasks`} 
        />
        <SummaryRow 
          emoji="⏰"
          label="Routine" 
          value={profile.routineSuggestion} 
        />
        <View style={[styles.lastRow, { borderBottomWidth: 0 }]}>
          <SummaryRow 
            emoji="🎯"
            label="30-Tage Ziel" 
            value={profile.goal30Days} 
          />
        </View>
      </View>

      {/* Strengths & Weaknesses */}
      <View style={styles.traitsSection}>
        <View style={styles.traitColumn}>
          <Text style={styles.traitTitle}>💪 Stärken</Text>
          {profile.strengths.map((s, i) => (
            <View key={i} style={styles.traitItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.semantic.success} />
              <Text style={styles.traitText}>{s}</Text>
            </View>
          ))}
        </View>
        <View style={styles.traitColumn}>
          <Text style={styles.traitTitle}>⚠️ Challenges</Text>
          {profile.weaknesses.map((w, i) => (
            <View key={i} style={styles.traitItem}>
              <Ionicons name="alert-circle" size={18} color={colors.semantic.warning} />
              <Text style={styles.traitText}>{w}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* First Todos */}
      <ResultCard
        title="Deine ersten 3 To-Dos"
        subtitle="Starte jetzt"
        emoji="🚀"
        color={colors.semantic.success}
      >
        {profile.firstTodos.map((todo, index) => (
          <View key={index} style={styles.todoItem}>
            <View style={styles.todoNumber}>
              <Text style={styles.todoNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.todoText}>{todo}</Text>
          </View>
        ))}
      </ResultCard>

      {/* Share Card */}
      <View style={styles.shareCard}>
        <View style={styles.shareContent}>
          <Text style={styles.shareEmoji}>{profile.hustleType.emoji}</Text>
          <Text style={styles.shareName}>{profile.hustleType.name}</Text>
          <Text style={styles.shareScore}>Score: {profile.hustleScore}</Text>
          <Text style={styles.shareModel}>{profile.businessModel.name}</Text>
        </View>
        <Text style={styles.shareBrand}>EntrepreneurAI</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <SecondaryButton
          title="Teilen"
          onPress={handleShare}
          style={styles.shareButton}
        />
        <PrimaryButton
          title="Zum Dashboard"
          onPress={() => router.replace('/(tabs)/dashboard')}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.h3,
    color: colors.text.secondary,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent.primary,
    ...shadows.glow,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: `${colors.accent.primary}20`,
    borderWidth: 3,
    borderColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  scoreValue: {
    ...typography.h1,
    color: colors.accent.primary,
  },
  scoreLabel: {
    ...typography.caption,
    color: colors.accent.primary,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  scoreDesc: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  cardDescription: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  traitsSection: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  traitColumn: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  traitTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  traitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  traitText: {
    ...typography.small,
    color: colors.text.secondary,
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  todoNumber: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.semantic.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoNumberText: {
    ...typography.smallMedium,
    color: colors.text.inverse,
  },
  todoText: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  shareCard: {
    backgroundColor: colors.background.elevated,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    marginBottom: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  shareContent: {
    alignItems: 'center',
  },
  shareEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  shareName: {
    ...typography.h2,
    color: colors.text.primary,
  },
  shareScore: {
    ...typography.body,
    color: colors.accent.primary,
    marginTop: spacing.xs,
  },
  shareModel: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  shareBrand: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: spacing.lg,
  },
  actions: {
    paddingBottom: spacing.lg,
  },
  shareButton: {
    marginBottom: spacing.md,
  },
});
