import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton, SecondaryButton } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function RateScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (rating >= 4) {
      Alert.alert(
        'Thank you! 😍',
        'We\'re so glad you\'re enjoying EntrepreneurAI! Your support means everything.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert(
        'Thank you for your feedback',
        'We\'re constantly improving. What can we do better?',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  return (
    <ScreenWrapper>
      <AppHeader 
        title="Rate EntrepreneurAI" 
        showBack 
        onBack={() => router.back()}
      />

      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.iconContainer}>
            <Ionicons name="heart" size={48} color={colors.semantic.error} />
          </View>
          <Text style={styles.title}>Enjoying the app?</Text>
          <Text style={styles.subtitle}>
            Your rating helps us grow and reach more aspiring entrepreneurs!
          </Text>
        </View>

        {/* Star Rating */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity 
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Ionicons 
                name={star <= rating ? 'star' : 'star-outline'} 
                size={40} 
                color={star <= rating ? colors.semantic.warning : colors.text.muted} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {rating > 0 && (
          <Text style={styles.ratingText}>
            {rating === 5 ? '😍 Amazing!' : 
             rating === 4 ? '😄 Great!' : 
             rating === 3 ? '🙂 Good' : 
             rating === 2 ? '😕 Okay' : '😞 Poor'}
          </Text>
        )}

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Average Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>12K+</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton 
          title="Submit Rating"
          onPress={handleSubmit}
          disabled={rating === 0}
        />
        <SecondaryButton 
          title="Maybe Later"
          onPress={() => router.back()}
          style={styles.laterButton}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: `${colors.semantic.error}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
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
    paddingHorizontal: spacing.xxl,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  starButton: {
    padding: spacing.sm,
  },
  ratingText: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.default,
  },
  statValue: {
    ...typography.h2,
    color: colors.semantic.warning,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
  laterButton: {
    marginTop: spacing.md,
  },
});
