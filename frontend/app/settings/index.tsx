import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, ListItem } from '../../src/components';
import { colors, spacing, radius, typography } from '../../src/theme';
import { getIsPro, activatePro, deactivatePro } from '../../src/services/proStatus';

export default function SettingsScreen() {
  const router = useRouter();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => { getIsPro().then(setIsPro); }, []);

  function handleProToggle() {
    Alert.alert(
      isPro ? 'Deactivate Pro (test)' : 'Activate Pro (test)',
      isPro ? 'Remove Pro access for testing?' : 'Enable Pro access for testing?',
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

      {/* Subscription row */}
      <View style={[styles.section, { marginBottom: spacing.lg }]}>
        <ListItem
          title={isPro ? '⭐ EntrepeneuerAI Pro' : '⚡ Upgrade to Pro'}
          subtitle={isPro ? 'Active — manage subscription' : 'Unlock all courses, AI & community'}
          leftIcon={isPro ? 'diamond' : 'flash-outline'}
          onPress={() => router.push('/paywall')}
          showDivider={false}
        />
      </View>

      <View style={styles.section}>
        <ListItem
          title="Notifications"
          subtitle="Manage push notifications"
          leftIcon="notifications-outline"
          onPress={() => router.push('/settings/notifications')}
        />
        <ListItem
          title="Learning Goals"
          subtitle="Set your daily learning targets"
          leftIcon="flag-outline"
          onPress={() => router.push('/settings/goals')}
        />
        <ListItem
          title="Privacy"
          subtitle="Manage your data and privacy"
          leftIcon="shield-outline"
          onPress={() => router.push('/settings/privacy')}
        />
        <ListItem
          title="Help & Support"
          subtitle="FAQs and contact us"
          leftIcon="help-circle-outline"
          onPress={() => router.push('/settings/help')}
        />
        <ListItem
          title="About"
          subtitle="App version and info"
          leftIcon="information-circle-outline"
          onPress={() => router.push('/settings/about')}
          showDivider={false}
        />
      </View>
      {/* Hidden dev toggle */}
      <TouchableOpacity style={styles.devBtn} onPress={handleProToggle}>
        <Text style={styles.devBtnText}>{isPro ? '🔴 Deactivate Pro (dev)' : '🟢 Activate Pro (dev)'}</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  devBtn: {
    marginTop: spacing.xxl, alignSelf: 'center',
    paddingVertical: spacing.sm, paddingHorizontal: spacing.lg,
  },
  devBtnText: { ...typography.caption, color: colors.text.muted },
});
