import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, ListItem } from '../src/components';
import { colors, spacing, radius } from '../src/theme';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title="Settings" />
      
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
});
