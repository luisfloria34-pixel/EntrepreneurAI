import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useProofs } from '../src/hooks/useProofs';

export default function ProofsScreen() {
  const router = useRouter();
  const { proofs, loading } = useProofs();

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
            <Text style={styles.statValue}>{proofs.length}</Text>
            <Text style={styles.statLabel}>Total Proofs</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{proofs.length}</Text>
            <Text style={styles.statLabel}>Images</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
        </View>

        {/* Proofs Grid */}
        <Text style={styles.sectionTitle}>Your Proofs</Text>
        <View style={styles.proofsGrid}>
          {proofs.map((proof) => (
            <TouchableOpacity key={proof.id} style={styles.proofItem}>
              <View style={styles.proofPlaceholder}>
                <Ionicons name="image" size={32} color={colors.text.tertiary} />
              </View>
              <Text style={styles.proofTitle} numberOfLines={1}>{proof.title ?? 'Proof'}</Text>
              <Text style={styles.proofDate}>{proof.created_at.split('T')[0]}</Text>
            </TouchableOpacity>
          ))}

          {proofs.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Ionicons name="camera-outline" size={48} color={colors.text.muted} />
              <Text style={styles.emptyText}>No proofs yet. Upload your first win!</Text>
            </View>
          )}
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
  emptyState: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.section,
    gap: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
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
