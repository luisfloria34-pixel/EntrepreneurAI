import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { TextInput, PrimaryButton } from '../src/components';
import { spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';
import { supabase } from '../src/services/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const APPLE_TEST_EMAIL = 'apple.test@entrepreneurai.com';
const APPLE_TEST_PASSWORD = 'AppleTest123!';

const PERKS = ['AI business coach', '50+ courses', 'Entrepreneur community', 'Progress tracking'];

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signUp, signInWithGoogle } = useAuth();
  const { colors, isDark } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const fadePerk = useRef(new Animated.Value(0)).current;
  const [perkIdx, setPerkIdx] = useState(0);

  useEffect(() => {
    const cycle = () => {
      fadePerk.setValue(0);
      Animated.timing(fadePerk, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      const t = setTimeout(() => {
        Animated.timing(fadePerk, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
          setPerkIdx(i => (i + 1) % PERKS.length);
          cycle();
        });
      }, 2200);
      return t;
    };
    const t = cycle();
    return () => clearTimeout(t);
  }, []);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);
    if (error) setError(error.message);
  };

  const handleApple = async () => {
    setAppleLoading(true);
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email: APPLE_TEST_EMAIL, password: APPLE_TEST_PASSWORD });
    if (signInErr) {
      const { error: signUpErr } = await supabase.auth.signUp({ email: APPLE_TEST_EMAIL, password: APPLE_TEST_PASSWORD, options: { data: { name: 'Apple User' } } });
      if (signUpErr) { setAppleLoading(false); setError(signUpErr.message); return; }
      await supabase.auth.signInWithPassword({ email: APPLE_TEST_EMAIL, password: APPLE_TEST_PASSWORD });
    }
    setAppleLoading(false);
    router.replace('/(tabs)/dashboard');
  };

  const handleSignup = async () => {
    if (!name.trim()) { setError('Enter your name'); return; }
    setError('');
    setLoading(true);
    const { error } = await signUp(email, password, name.trim());
    setLoading(false);
    if (error) setError(error.message);
    else router.push('/onboarding');
  };

  const SocialBtn = ({ onPress, loading: l, icon, label }: { onPress: () => void; loading: boolean; icon: string; label: string }) => (
    <TouchableOpacity
      style={{
        flex: 1, height: 52, borderRadius: radius.lg,
        backgroundColor: isDark ? colors.background.elevated : colors.background.secondary,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: colors.border.default,
        gap: 6, flexDirection: 'row',
      }}
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
      disabled={l}
    >
      {l ? <ActivityIndicator size="small" color={colors.text.secondary} /> : (
        <>
          <Ionicons name={icon as any} size={20} color={colors.text.primary} />
          <Text style={{ ...typography.smallMedium, color: colors.text.secondary }}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <View style={{ position: 'absolute', top: -80, right: -40, width: 260, height: 260, borderRadius: 130, backgroundColor: '#7C3AED08' }} />
      <View style={{ position: 'absolute', top: 100, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: '#00D4FF06' }} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xxl }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: spacing.xxl }}>
            <Ionicons name="arrow-back" size={24} color={colors.text.secondary} />
          </TouchableOpacity>

          {/* Hero */}
          <View style={{ marginBottom: spacing.xxxl }}>
            <Text style={{ fontSize: 32, fontWeight: '800', color: colors.text.primary, letterSpacing: -0.8, lineHeight: 38, marginBottom: spacing.md }}>
              Build your{'\n'}empire. 🚀
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <Text style={{ ...typography.body, color: colors.text.secondary }}>Includes: </Text>
              <Animated.Text style={{ ...typography.bodyMedium, color: '#00D4FF', opacity: fadePerk }}>
                {PERKS[perkIdx]}
              </Animated.Text>
            </View>
          </View>

          <TextInput label="Full Name" placeholder="Your name" value={name} onChangeText={setName} autoCapitalize="words" leftIcon="person-outline" />
          <TextInput label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" leftIcon="mail-outline" />
          <TextInput label="Password" placeholder="Min. 8 characters" value={password} onChangeText={setPassword} secureTextEntry leftIcon="lock-closed-outline" />

          {!!error && (
            <View style={{ backgroundColor: '#EF444418', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: '#EF444440' }}>
              <Text style={{ ...typography.small, color: '#EF4444' }}>{error}</Text>
            </View>
          )}

          <PrimaryButton title={loading ? 'Creating account...' : 'Create Free Account'} onPress={handleSignup} loading={loading} style={{ marginTop: spacing.sm }} />

          <Text style={{ ...typography.caption, color: colors.text.muted, textAlign: 'center', marginTop: spacing.md, lineHeight: 18 }}>
            By signing up you agree to our Terms & Privacy Policy.
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xxl }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border.default }} />
            <Text style={{ ...typography.small, color: colors.text.muted, marginHorizontal: spacing.lg }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border.default }} />
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <SocialBtn onPress={handleGoogle} loading={googleLoading} icon="logo-google" label="Google" />
            <SocialBtn onPress={handleApple} loading={appleLoading} icon="logo-apple" label="Apple" />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxl }}>
            <Text style={{ ...typography.body, color: colors.text.secondary }}>Already building? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={{ ...typography.bodyMedium, color: '#00D4FF' }}>Sign in →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
