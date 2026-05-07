import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('daily-reminder').catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: 'daily-reminder',
    content: {
      title: 'Time to hustle! 🔥',
      body: "Complete today's tasks and keep your streak alive.",
    },
    trigger: { hour: 9, minute: 0, repeats: true } as any,
  });
}

export async function scheduleStreakReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('streak-reminder').catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: 'streak-reminder',
    content: {
      title: "Don't break your streak! 💪",
      body: 'You still have time to complete a task today.',
    },
    trigger: { hour: 20, minute: 0, repeats: true } as any,
  });
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
