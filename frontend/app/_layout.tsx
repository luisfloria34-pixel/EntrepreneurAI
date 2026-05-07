import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme';
import { OnboardingProvider } from '../src/context/OnboardingContext';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inTabsGroup = segments[0] === '(tabs)';
    if (!session && inTabsGroup) {
      router.replace('/login');
    } else if (session && (segments[0] === 'login' || segments[0] === 'signup')) {
      router.replace('/(tabs)/dashboard');
    }
  }, [session, loading, segments]);

  return (
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
      <Stack.Screen name="phone-verify" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="survey/[step]" />
      <Stack.Screen name="survey/result" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      <Stack.Screen name="lesson/[id]" options={{ presentation: 'card' }} />
      <Stack.Screen name="course/[id]" />
      <Stack.Screen name="challenge" />
      <Stack.Screen name="tasks" />
      <Stack.Screen name="community/index" />
      <Stack.Screen name="community/post/[id]" />
      <Stack.Screen name="community/create" />
      <Stack.Screen name="community/user/[id]" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="badges" />
      <Stack.Screen name="badge/[id]" />
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="settings/notifications" />
      <Stack.Screen name="settings/goals" />
      <Stack.Screen name="settings/privacy" />
      <Stack.Screen name="settings/help" />
      <Stack.Screen name="settings/about" />
      <Stack.Screen name="settings/edit-profile" />
      <Stack.Screen name="settings/language" />
      <Stack.Screen name="settings/theme" />
      <Stack.Screen name="settings/rate" />
      <Stack.Screen name="proofs" />
      <Stack.Screen name="proof-upload" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <StatusBar style="light" />
        <RootLayoutNav />
      </OnboardingProvider>
    </AuthProvider>
  );
}
