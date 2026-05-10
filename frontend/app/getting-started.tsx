import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../src/components';
import { spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/context/ThemeContext';
import { useLanguage } from '../src/context/LanguageContext';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/services/supabase';

const STEPS = [
  { id: 1, icon: 'person-circle-outline', title: 'Complete Your Profile', desc: 'Add your name, bio, and photo so the community knows you.', check: (p: any) => !!p?.name && !!p?.bio },
  { id: 2, icon: 'school-outline', title: 'Start Your First Course', desc: 'Pick a course and complete your first lesson.', check: (p: any) => (p?.lessons_completed ?? 0) > 0 },
  { id: 3, icon: 'chatbubbles-outline', title: 'Ask the AI Coach', desc: 'Send your first message to your AI business coach.', check: () => false },
  { id: 4, icon: 'checkmark-circle-outline', title: 'Complete 3 Daily Tasks', desc: 'Finish 3 tasks in a single day to build momentum.', check: () => false },
  { id: 5, icon: 'flame-outline', title: 'Build a 3-Day Streak', desc: 'Come back 3 days in a row to start your streak.', check: (p: any) => (p?.streak ?? 0) >= 3 },
  { id: 6, icon: 'ribbon-outline', title: 'Earn Your First Badge', desc: 'Unlock your first achievement badge.', check: () => false },
  { id: 7, icon: 'people-outline', title: 'Join the Community', desc: 'Read or interact with a community post.', check: () => false },
];

export default function GettingStartedScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('name, bio, lessons_completed, streak').eq('id', user.id).single()
      .then(({ data }) => { if (data) setProfile(data); });
  }, [user]);

  const completed = STEPS.filter(s => s.check(profile)).length;

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title={t('titleGettingStarted')} />

      <View style={{ backgroundColor: `${colors.accent.primary}10`, borderRadius: radius.lg, padding: spacing.xl, marginBottom: spacing.xxl, borderWidth: 1, borderColor: `${colors.accent.primary}30` }}>
        <Text style={{ ...typography.h2, color: colors.text.primary }}>{completed}/{STEPS.length} Complete</Text>
        <Text style={{ ...typography.body, color: colors.text.secondary, marginTop: spacing.xs }}>
          {completed === STEPS.length ? '🎉 You crushed it! All steps done.' : `${STEPS.length - completed} steps remaining to master the basics`}
        </Text>
        <View style={{ height: 6, backgroundColor: colors.border.default, borderRadius: radius.full, marginTop: spacing.lg }}>
          <View style={{ width: `${(completed / STEPS.length) * 100}%`, height: '100%', backgroundColor: colors.accent.primary, borderRadius: radius.full }} />
        </View>
      </View>

      <View style={{ gap: spacing.md }}>
        {STEPS.map((step) => {
          const done = step.check(profile);
          return (
            <View key={step.id} style={{
              flexDirection: 'row',
              backgroundColor: colors.background.card,
              borderRadius: radius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: done ? `${colors.semantic.success}40` : colors.border.default,
            }}>
              <View style={{
                width: 48, height: 48, borderRadius: radius.full,
                backgroundColor: done ? `${colors.semantic.success}20` : colors.background.tertiary,
                alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
              }}>
                {done
                  ? <Ionicons name="checkmark-circle" size={28} color={colors.semantic.success} />
                  : <Ionicons name={step.icon as keyof typeof Ionicons.glyphMap} size={24} color={colors.text.tertiary} />
                }
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...typography.bodyMedium, color: done ? colors.text.secondary : colors.text.primary, textDecorationLine: done ? 'line-through' : 'none' }}>
                  {step.title}
                </Text>
                <Text style={{ ...typography.small, color: colors.text.tertiary, marginTop: spacing.xs }}>{step.desc}</Text>
              </View>
              <Text style={{ ...typography.h3, color: colors.text.muted, alignSelf: 'center' }}>{step.id}</Text>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        style={{ backgroundColor: colors.accent.primary, borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center', marginTop: spacing.xxl }}
        onPress={() => router.push('/(tabs)/courses')}
      >
        <Text style={{ ...typography.h3, color: colors.text.inverse }}>Start Learning Now</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}
