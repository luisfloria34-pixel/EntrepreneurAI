import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, ListItem } from '../../src/components';
import { colors, spacing, radius, typography } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { getIsPro, activatePro, deactivatePro } from '../../src/services/proStatus';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/services/supabase';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => { getIsPro().then(setIsPro); }, []);

  function handleLogout() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all your data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            await supabase.from('profiles').delete().eq('id', user.id);
            await supabase.auth.admin?.deleteUser?.(user.id).catch(() => {});
            await signOut();
          },
        },
      ],
    );
  }

  function handleDevToggle() {
    Alert.alert(
      isPro ? 'Deactivate Pro (dev)' : 'Activate Pro (dev)',
      isPro ? 'Remove Pro for testing?' : 'Enable Pro for testing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            if (isPro) { await deactivatePro(); setIsPro(false); }
            else { await activatePro(); setIsPro(true); }
          },
        },
      ],
    );
  }

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title="Settings" />

      {/* Account section */}
      <Text style={styles.sectionLabel}>Account</Text>
      <View style={styles.section}>
        <ListItem
          title="Edit Profile"
          subtitle="Change name, bio and photo"
          leftIcon="person-outline"
          onPress={() => router.push('/settings/edit-profile')}
        />
        <ListItem
          title={isPro ? '⭐ EntrepeneuerAI Pro' : '⚡ Upgrade to Pro'}
          subtitle={isPro ? 'Active — manage subscription' : 'Unlock all features'}
          leftIcon={isPro ? 'diamond' : 'flash-outline'}
          onPress={() => router.push('/settings/subscription')}
        />
        <ListItem
          title="Notifications"
          subtitle="Manage push notifications"
          leftIcon="notifications-outline"
          onPress={() => router.push('/settings/notifications')}
        />
        <ListItem
          title="Privacy & Security"
          subtitle="Password, data and account"
          leftIcon="shield-outline"
          onPress={() => router.push('/settings/privacy')}
          showDivider={false}
        />
      </View>

      {/* Preferences section */}
      <Text style={styles.sectionLabel}>Preferences</Text>
      <View style={styles.section}>
        <ListItem
          title="Theme"
          subtitle="Dark, light, or system"
          leftIcon="moon-outline"
          onPress={() => router.push('/settings/theme')}
        />
        <ListItem
          title="Learning Goals"
          subtitle="Daily and weekly targets"
          leftIcon="flag-outline"
          onPress={() => router.push('/settings/goals')}
        />
        <ListItem
          title="Language"
          subtitle="App language"
          leftIcon="language-outline"
          onPress={() => router.push('/settings/language')}
        />
        <ListItem
          title="Help & Support"
          subtitle="FAQs and contact"
          leftIcon="help-circle-outline"
          onPress={() => router.push('/settings/help')}
        />
        <ListItem
          title="About"
          subtitle="Version and info"
          leftIcon="information-circle-outline"
          onPress={() => router.push('/settings/about')}
          showDivider={false}
        />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.semantic.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* Delete account */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>

      {/* Dev toggle */}
      <TouchableOpacity style={styles.devBtn} onPress={handleDevToggle}>
        <Text style={styles.devText}>{isPro ? '🔴 Deactivate Pro (dev)' : '🟢 Activate Pro (dev)'}</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
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
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
    backgroundColor: `${colors.semantic.error}15`,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  logoutText: { ...typography.bodyMedium, color: colors.semantic.error },
  deleteBtn: { alignItems: 'center', marginTop: spacing.md, padding: spacing.md },
  deleteText: { ...typography.small, color: colors.text.muted, textDecorationLine: 'underline' },
  devBtn: { alignItems: 'center', marginTop: spacing.lg, padding: spacing.md },
  devText: { ...typography.caption, color: colors.text.muted },
});
