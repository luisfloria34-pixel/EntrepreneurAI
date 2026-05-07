import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Share, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, PrimaryButton, SecondaryButton, ResultCard, SummaryRow } from '../../src/components';
import { colors, spacing, typography, radius, shadows } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { HustleProfile } from '../../src/data/surveyData';

export default function SurveyResultScreen() {
  const router = useRouter();
  const { calculateProfile, profile: existingProfile, setCompleted, saveToSupabase } = useOnboarding();
  const [profile, setProfile] = useState<HustleProfile | null>(existingProfile);
  const [isSaving, setIsSaving] = useState(false);
  const shareCardRef = useRef<View>(null);

  useEffect(() => {
    const finalize = async () => {
      const calculated = existingProfile ?? calculateProfile();
      if (!existingProfile) setProfile(calculated);

      setIsSaving(true);
      const { error } = await saveToSupabase(calculated);
      setIsSaving(false);

      if (error) {
        Alert.alert('Speichern fehlgeschlagen', 'Dein Profil konnte nicht gespeichert werden. Bitte versuche es erneut.');
      } else {
        setCompleted(true);
      }
    };
    finalize();
  }, []);

  if (!profile) {
    return (
      <ScreenWrapper>
        <View style={styles.loading}>
          <View style={styles.loadingIcon}>
            <Ionicons name="analytics" size={48} color={colors.accent.primary} />
          </View>
          <Text style={styles.loadingText}>Analysiere deine Antworten...</Text>
          <Text style={styles.loadingSubtext}>Dein Hustle-Profil wird erstellt</Text>
          <ActivityIndicator color={colors.accent.primary} style={{ marginTop: spacing.lg }} />
        </View>
      </ScreenWrapper>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🚀 Mein Hustle-Profil bei EntrepreneurAI:\n\n${profile.hustleType.emoji} ${profile.hustleType.name}\n💼 Empfohlen: ${profile.businessModel.name}\n📊 Hustle Score: ${profile.hustleScore}\n\n${profile.coachStyleEmoji} Coach: ${profile.coachStyle}\n🎯 30-Tage Ziel: ${profile.goal30Days}\n\n#EntrepreneurAI #Hustle #Entrepreneurship`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoToDashboard = () => {
    // Show paywall before dashboard — this is where 50% of conversions happen
    router.push('/paywall');
  };

  return (
    <ScreenWrapper scroll>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🎉</Text>
        <Text style={styles.headerTitle}>Dein Hustle-Profil</Text>
        <Text style={styles.headerSubtitle}>Basierend auf deinen Antworten</Text>
      </View>

      {/* Share Card - Screenshot-fähig */}
      <View ref={shareCardRef} style={styles.shareCardContainer}>
        <View style={[styles.shareCard, { borderColor: profile.hustleType.color }]}>
          <View style={styles.shareCardHeader}>
            <Text style={styles.shareCardBrand}>EntrepreneurAI</Text>
          </View>
          
          <View style={styles.shareCardContent}>
            <Text style={styles.shareCardEmoji}>{profile.hustleType.emoji}</Text>
            <Text style={styles.shareCardType}>{profile.hustleType.name}</Text>
            
            <View style={styles.shareCardScore}>
              <Text style={styles.shareCardScoreValue}>{profile.hustleScore}</Text>
              <Text style={styles.shareCardScoreLabel}>Hustle Score</Text>
            </View>
            
            <View style={styles.shareCardDivider} />
            
            <View style={styles.shareCardInfo}>
              <Text style={styles.shareCardInfoLabel}>{profile.businessModel.emoji} Empfohlen</Text>
              <Text style={styles.shareCardInfoValue}>{profile.businessModel.name}</Text>
            </View>
            
            <View style={styles.shareCardInfo}>
              <Text style={styles.shareCardInfoLabel}>{profile.coachStyleEmoji} Coach Style</Text>
              <Text style={styles.shareCardInfoValue}>{profile.coachStyle}</Text>
            </View>
          </View>
          
          <View style={styles.shareCardFooter}>
            <Text style={styles.shareCardFooterText}>Finde deinen Hustle-Typ</Text>
          </View>
        </View>
      </View>

      {/* Share Button */}
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Ionicons name="share-outline" size={20} color={colors.accent.primary} />
        <Text style={styles.shareButtonText}>Profil teilen</Text>
      </TouchableOpacity>

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
        subtitle="Empfohlenes Start-Modell"
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
          label="Tägliche Routine" 
          value={profile.routineSuggestion} 
        />
        <SummaryRow 
          emoji="🎯"
          label="30-Tage Ziel" 
          value={profile.goal30Days} 
        />
        <View style={styles.lastRow}>
          <SummaryRow 
            emoji="📸"
            label="Proof-of-Work" 
            value={`${profile.proofOfWorkLevel} – ${profile.proofOfWorkDescription}`} 
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
        subtitle="Starte heute"
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

      {/* Actions */}
      <View style={styles.actions}>
        <PrimaryButton
          title={isSaving ? 'Wird gespeichert...' : 'Zum Dashboard'}
          onPress={handleGoToDashboard}
          disabled={isSaving}
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
  loadingIcon: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  loadingText: {
    ...typography.h3,
    color: colors.text.primary,
  },
  loadingSubtext: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
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
  // Share Card Styles - Screenshot-fähig
  shareCardContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  shareCard: {
    width: 280,
    backgroundColor: colors.background.elevated,
    borderRadius: radius.xl,
    borderWidth: 2,
    overflow: 'hidden',
    ...shadows.lg,
  },
  shareCardHeader: {
    backgroundColor: colors.background.tertiary,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  shareCardBrand: {
    ...typography.captionMedium,
    color: colors.accent.primary,
    letterSpacing: 1,
  },
  shareCardContent: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  shareCardEmoji: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  shareCardType: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  shareCardScore: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  shareCardScoreValue: {
    ...typography.display,
    color: colors.accent.primary,
  },
  shareCardScoreLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  shareCardDivider: {
    width: '60%',
    height: 1,
    backgroundColor: colors.border.default,
    marginBottom: spacing.lg,
  },
  shareCardInfo: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  shareCardInfoLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  shareCardInfoValue: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  shareCardFooter: {
    backgroundColor: colors.background.tertiary,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  shareCardFooterText: {
    ...typography.caption,
    color: colors.text.muted,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  shareButtonText: {
    ...typography.bodyMedium,
    color: colors.accent.primary,
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
  actions: {
    paddingBottom: spacing.lg,
  },
});
