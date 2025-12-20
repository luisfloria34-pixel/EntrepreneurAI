import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';

export default function NotificationsSettingsScreen() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakReminder, setStreakReminder] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(false);
  const [newCourses, setNewCourses] = useState(true);

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title="Notifications" />
      
      <View style={styles.section}>
        <View style={styles.item}>
          <View style={styles.itemText}>
            <Text style={styles.itemTitle}>Push Notifications</Text>
            <Text style={styles.itemSubtitle}>Enable all notifications</Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
            thumbColor={colors.text.primary}
          />
        </View>
      </View>

      <Text style={styles.sectionLabel}>Learning Reminders</Text>
      <View style={styles.section}>
        <View style={styles.item}>
          <View style={styles.itemText}>
            <Text style={styles.itemTitle}>Daily Reminder</Text>
            <Text style={styles.itemSubtitle}>Get reminded to learn every day</Text>
          </View>
          <Switch
            value={dailyReminder}
            onValueChange={setDailyReminder}
            trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
            thumbColor={colors.text.primary}
          />
        </View>
        <View style={[styles.item, styles.itemBorder]}>
          <View style={styles.itemText}>
            <Text style={styles.itemTitle}>Streak Reminder</Text>
            <Text style={styles.itemSubtitle}>Don't lose your streak!</Text>
          </View>
          <Switch
            value={streakReminder}
            onValueChange={setStreakReminder}
            trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
            thumbColor={colors.text.primary}
          />
        </View>
      </View>

      <Text style={styles.sectionLabel}>Other</Text>
      <View style={styles.section}>
        <View style={styles.item}>
          <View style={styles.itemText}>
            <Text style={styles.itemTitle}>Community Updates</Text>
            <Text style={styles.itemSubtitle}>New posts and comments</Text>
          </View>
          <Switch
            value={communityUpdates}
            onValueChange={setCommunityUpdates}
            trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
            thumbColor={colors.text.primary}
          />
        </View>
        <View style={[styles.item, styles.itemBorder]}>
          <View style={styles.itemText}>
            <Text style={styles.itemTitle}>New Courses</Text>
            <Text style={styles.itemSubtitle}>Get notified about new courses</Text>
          </View>
          <Switch
            value={newCourses}
            onValueChange={setNewCourses}
            trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
            thumbColor={colors.text.primary}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    ...typography.smallMedium,
    color: colors.text.secondary,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  itemBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  itemText: {
    flex: 1,
    marginRight: spacing.md,
  },
  itemTitle: {
    ...typography.body,
    color: colors.text.primary,
  },
  itemSubtitle: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
