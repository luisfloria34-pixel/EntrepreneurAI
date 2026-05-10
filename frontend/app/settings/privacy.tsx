import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/services/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { useProfile } from '../../src/hooks/useProfile';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import * as Haptics from 'expo-haptics';

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { profile } = useProfile();
  const { colors } = useTheme();
  const { t } = useLanguage();
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
      created_at: profile.created_at,
    };
    Alert.alert('Your Data', JSON.stringify(data, null, 2));
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Delete Account',
      'Type DELETE to confirm permanent account deletion.',
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

  function SwitchRow({ title, sub, value, onVal, bordered }: { title: string; sub: string; value: boolean; onVal: (v: boolean) => void; bordered?: boolean }) {
    return (
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: spacing.lg,
        borderTopWidth: bordered ? 1 : 0,
        borderTopColor: colors.border.default,
      }}>
        <View style={{ flex: 1, marginRight: spacing.md }}>
          <Text style={{ ...typography.body, color: colors.text.primary }}>{title}</Text>
          <Text style={{ ...typography.caption, color: colors.text.secondary, marginTop: spacing.xs }}>{sub}</Text>
        </View>
        <Switch value={value} onValueChange={onVal}
          trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
          thumbColor={colors.text.inverse} />
      </View>
    );
  }

  function ActionRow({ icon, label, onPress, destructive, loading: rowLoading, bordered }: {
    icon: string; label: string; onPress: () => void; destructive?: boolean; loading?: boolean; bordered?: boolean;
  }) {
    const c = destructive ? colors.semantic.error : colors.text.primary;
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.lg, borderTopWidth: bordered ? 1 : 0, borderTopColor: colors.border.default }}
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 }}>
          <Ionicons name={icon as any} size={20} color={destructive ? colors.semantic.error : colors.text.secondary} />
          <Text style={{ ...typography.body, color: c }}>{label}</Text>
        </View>
        {rowLoading
          ? <ActivityIndicator size="small" color={c} />
          : <Ionicons name="chevron-forward" size={18} color={destructive ? colors.semantic.error : colors.text.muted} />}
      </TouchableOpacity>
    );
  }

  function Label({ text }: { text: string }) {
    return (
      <Text style={{ ...typography.captionMedium, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: 1, marginTop: spacing.xl, marginBottom: spacing.sm, marginLeft: spacing.xs }}>
        {text}
      </Text>
    );
  }

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title={t('titlePrivacy')} />

      <Label text="Account Security" />
      <View style={{ backgroundColor: colors.background.card, borderRadius: radius.lg, paddingHorizontal: spacing.lg }}>
        <ActionRow icon="key-outline" label="Change Password" onPress={handleChangePassword} loading={resetting} />
      </View>

      <Label text="Privacy" />
      <View style={{ backgroundColor: colors.background.card, borderRadius: radius.lg, paddingHorizontal: spacing.lg }}>
        <SwitchRow title="Public Profile" sub="Let others see your profile" value={profilePublic} onVal={setProfilePublic} />
        <SwitchRow title="Analytics" sub="Help us improve with usage data" value={analytics} onVal={setAnalytics} bordered />
      </View>

      <Label text="Data" />
      <View style={{ backgroundColor: colors.background.card, borderRadius: radius.lg, paddingHorizontal: spacing.lg }}>
        <ActionRow icon="download-outline" label="Download My Data" onPress={handleDownloadData} />
        <ActionRow icon="trash-outline" label="Delete Account" onPress={handleDeleteAccount} destructive loading={deleting} bordered />
      </View>

      <Label text="Legal" />
      <View style={{ backgroundColor: colors.background.card, borderRadius: radius.lg, paddingHorizontal: spacing.lg }}>
        <ActionRow icon="document-text-outline" label={t('titlePrivacyPolicy')} onPress={() => router.push('/settings/privacy-policy')} />
        <ActionRow icon="reader-outline" label={t('titleTerms')} onPress={() => router.push('/settings/terms')} bordered />
      </View>
    </ScreenWrapper>
  );
}
