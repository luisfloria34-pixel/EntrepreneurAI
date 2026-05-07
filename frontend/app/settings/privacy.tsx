import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/services/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { useProfile } from '../../src/hooks/useProfile';

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { profile } = useProfile();
  const [analytics, setAnalytics] = useState(true);
  const [profilePublic, setProfilePublic] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleChangePassword() {
    if (!user?.email) return;
    setResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    setResetting(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Email sent', `A password reset link was sent to ${user.email}`);
    }
  }

  async function handleDownloadData() {
    if (!profile) return;
    const data = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      hustle_score: profile.hustle_score,
      level: profile.level,
      streak: profile.streak,
      total_xp: profile.total_xp,
      lessons_completed: profile.lessons_completed,
      created_at: profile.created_at,
    };
    Alert.alert('Your Data', JSON.stringify(data, null, 2));
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Delete Account',
      'Permanently delete your account and all data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            setDeleting(true);
            await supabase.from('profiles').delete().eq('id', user.id);
            await signOut();
          },
        },
      ],
    );
  }

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title="Privacy & Security" />

      <Text style={styles.label}>Account Security</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.row} onPress={handleChangePassword} disabled={resetting}>
          <View style={styles.rowLeft}>
            <Ionicons name="key-outline" size={20} color={colors.text.secondary} />
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Change Password</Text>
              <Text style={styles.rowSub}>Send a reset link to your email</Text>
            </View>
          </View>
          {resetting
            ? <ActivityIndicator size="small" color={colors.accent.primary} />
            : <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />}
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Privacy</Text>
      <View style={styles.section}>
        <View style={styles.switchRow}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Public Profile</Text>
            <Text style={styles.rowSub}>Let others see your profile</Text>
          </View>
          <Switch value={profilePublic} onValueChange={setProfilePublic}
            trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
            thumbColor={colors.text.inverse} />
        </View>
        <View style={[styles.switchRow, styles.bordered]}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Analytics</Text>
            <Text style={styles.rowSub}>Help us improve with usage data</Text>
          </View>
          <Switch value={analytics} onValueChange={setAnalytics}
            trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
            thumbColor={colors.text.inverse} />
        </View>
      </View>

      <Text style={styles.label}>Data</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.row} onPress={handleDownloadData}>
          <View style={styles.rowLeft}>
            <Ionicons name="download-outline" size={20} color={colors.text.secondary} />
            <Text style={styles.rowTitle}>Download My Data</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.row, styles.bordered]} onPress={handleDeleteAccount} disabled={deleting}>
          <View style={styles.rowLeft}>
            <Ionicons name="trash-outline" size={20} color={colors.semantic.error} />
            <Text style={[styles.rowTitle, { color: colors.semantic.error }]}>Delete Account</Text>
          </View>
          {deleting
            ? <ActivityIndicator size="small" color={colors.semantic.error} />
            : <Ionicons name="chevron-forward" size={18} color={colors.semantic.error} />}
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Legal</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="document-text-outline" size={20} color={colors.text.secondary} />
            <Text style={styles.rowTitle}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.row, styles.bordered]}>
          <View style={styles.rowLeft}>
            <Ionicons name="reader-outline" size={20} color={colors.text.secondary} />
            <Text style={styles.rowTitle}>Terms of Service</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.captionMedium,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  section: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  bordered: { borderTopWidth: 1, borderTopColor: colors.border.default },
  rowText: { flex: 1 },
  rowTitle: { ...typography.body, color: colors.text.primary },
  rowSub: { ...typography.caption, color: colors.text.secondary, marginTop: spacing.xs },
});
