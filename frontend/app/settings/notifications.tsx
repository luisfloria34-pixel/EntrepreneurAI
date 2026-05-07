import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  scheduleDailyReminder,
  scheduleStreakReminder,
  cancelAllNotifications,
  requestPermissions,
} from '../../src/services/notifications';

const PREFS_KEY = '@notif_prefs';

interface Prefs {
  pushEnabled: boolean;
  dailyReminder: boolean;
  streakReminder: boolean;
  communityUpdates: boolean;
  newCourses: boolean;
}

const DEFAULT: Prefs = {
  pushEnabled: true,
  dailyReminder: true,
  streakReminder: true,
  communityUpdates: false,
  newCourses: true,
};

export default function NotificationsSettingsScreen() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PREFS_KEY).then(val => {
      if (val) setPrefs(JSON.parse(val));
    });
  }, []);

  function update(key: keyof Prefs, val: boolean) {
    setPrefs(p => ({ ...p, [key]: val }));
  }

  async function handleSave() {
    setSaving(true);
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));

    if (!prefs.pushEnabled) {
      await cancelAllNotifications();
    } else {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert('Permission required', 'Enable notifications in your device settings.');
        setSaving(false);
        return;
      }
      if (prefs.dailyReminder) await scheduleDailyReminder();
      if (prefs.streakReminder) await scheduleStreakReminder();
      if (!prefs.dailyReminder && !prefs.streakReminder) await cancelAllNotifications();
    }
    setSaving(false);
    router.back();
  }

  function SwitchRow({ title, sub, value, onVal }: { title: string; sub: string; value: boolean; onVal: (v: boolean) => void }) {
    return (
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSub}>{sub}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onVal}
          trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
          thumbColor={colors.text.inverse}
        />
      </View>
    );
  }

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title="Notifications" />

      <View style={styles.section}>
        <SwitchRow
          title="Push Notifications"
          sub="Enable all notifications"
          value={prefs.pushEnabled}
          onVal={v => update('pushEnabled', v)}
        />
      </View>

      <Text style={styles.label}>Learning Reminders</Text>
      <View style={styles.section}>
        <SwitchRow
          title="Daily Reminder"
          sub="Remind me to learn every day at 9 AM"
          value={prefs.dailyReminder}
          onVal={v => update('dailyReminder', v)}
        />
        <View style={styles.divider} />
        <SwitchRow
          title="Streak Reminder"
          sub="Don't lose your streak! (8 PM)"
          value={prefs.streakReminder}
          onVal={v => update('streakReminder', v)}
        />
      </View>

      <Text style={styles.label}>Other</Text>
      <View style={styles.section}>
        <SwitchRow
          title="Community Updates"
          sub="New posts and replies"
          value={prefs.communityUpdates}
          onVal={v => update('communityUpdates', v)}
        />
        <View style={styles.divider} />
        <SwitchRow
          title="New Courses"
          sub="Get notified when new courses arrive"
          value={prefs.newCourses}
          onVal={v => update('newCourses', v)}
        />
      </View>

      <View style={styles.cta}>
        <PrimaryButton title={saving ? 'Saving...' : 'Save Preferences'} onPress={handleSave} disabled={saving} />
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
  rowText: { flex: 1, marginRight: spacing.md },
  rowTitle: { ...typography.body, color: colors.text.primary },
  rowSub: { ...typography.caption, color: colors.text.secondary, marginTop: spacing.xs },
  divider: { height: 1, backgroundColor: colors.border.default },
  cta: { marginTop: spacing.xxl },
});
