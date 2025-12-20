import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background.primary },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="lesson/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="course/[id]" />
        <Stack.Screen name="challenge" />
        <Stack.Screen name="tasks" />
        <Stack.Screen name="community" />
        <Stack.Screen name="community/post/[id]" />
        <Stack.Screen name="community/create" />
        <Stack.Screen name="community/user/[id]" />
        <Stack.Screen name="analytics" />
        <Stack.Screen name="badges" />
        <Stack.Screen name="badge/[id]" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="settings/notifications" />
        <Stack.Screen name="settings/goals" />
        <Stack.Screen name="settings/privacy" />
        <Stack.Screen name="settings/help" />
        <Stack.Screen name="settings/about" />
      </Stack>
    </>
  );
}
