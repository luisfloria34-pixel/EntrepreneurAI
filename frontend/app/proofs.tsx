import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { profileData } from '../src/data/profileMock';

export default function ProofsScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <AppHeader 
        title="Proof of Work" 
        showBack 
        onBack={() => router.back()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profileData.totalProofs}</Text>
            <Text style={styles.statLabel}>Total Proofs</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profileData.proofs.filter(p => p.type === 'image').length}</Text>
            <Text style={styles.statLabel}>Images</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profileData.proofs.filter(p => p.type === 'video').length}</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
        </View>

        {/* Proofs Grid */}
        <Text style={styles.sectionTitle}>Your Proofs</Text>
        <View style={styles.proofsGrid}>
          {profileData.proofs.map((proof) => (
            <TouchableOpacity key={proof.id} style={styles.proofItem}>
              <View style={styles.proofPlaceholder}>
                <Ionicons 
                  name={proof.type === 'video' ? 'play-circle' : 'image'} 
                  size={32} 
                  color={colors.text.tertiary} 
                />
              </View>
              <Text style={styles.proofTitle} numberOfLines={1}>{proof.title}</Text>
              <Text style={styles.proofDate}>{proof.date}</Text>
            </TouchableOpacity>
          ))}
          
          {/* Empty slots */}
          {[...Array(Math.max(0, 8 - profileData.proofs.length))].map((_, i) => (
            <View key={`empty-${i}`} style={styles.proofItem}>
              <View style={[styles.proofPlaceholder, styles.emptyPlaceholder]}>
                <Ionicons name="add" size={24} color={colors.text.muted} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Upload FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/proof-upload')}
      >
        <Ionicons name="add" size={28} color={colors.text.inverse} />
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.accent.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  proofsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  proofItem: {
    width: '48%',
    marginBottom: spacing.md,
  },
  proofPlaceholder: {
    aspectRatio: 1,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyPlaceholder: {
    borderWidth: 2,
    borderColor: colors.border.default,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  proofTitle: {
    ...typography.smallMedium,
    color: colors.text.primary,
  },
  proofDate: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xxl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
