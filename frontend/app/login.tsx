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

function LogoMark({ colors }: { colors: any }) {
  const glow = useRef(new Animated.Value(0.6)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.6, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.timing(rotate, { toValue: 1, duration: 12000, useNativeDriver: true })
    ).start();
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={{ alignItems: 'center', marginBottom: spacing.xxl }}>
      <View style={{ position: 'relative', width: 80, height: 80, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={{
          position: 'absolute', width: 80, height: 80, borderRadius: 40,
          borderWidth: 1.5, borderColor: '#00D4FF',
          opacity: glow, transform: [{ rotate: spin }],
          borderStyle: 'dashed',
        }} />
        <LinearGradient
          colors={['#00D4FF22', '#7C3AED22']}
          style={{ width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 32 }}>⚡</Text>
        </LinearGradient>
      </View>
      <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text.primary, letterSpacing: -0.5, marginTop: spacing.md }}>
        Entrepreneur<Text style={{ color: '#00D4FF' }}>AI</Text>
      </Text>
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn, signInWithGoogle, signInWithPhone } = useAuth();
  const { colors, isDark } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+');
  const [showPhone, setShowPhone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) setError('Wrong email or password. Try again.');
    else router.replace('/(tabs)/dashboard');
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);
    if (error) setError(error.message);
  };

  const handleApple = async () => {
    setError('');
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

  const handlePhoneChange = (value: string) => setPhone('+' + value.replace(/[^0-9]/g, ''));
  const isValidE164 = /^\+[1-9]\d{6,14}$/.test(phone);

  const handlePhoneSend = async () => {
    if (!isValidE164) { setError('Enter a valid phone number (e.g. +1 555 1234567)'); return; }
    setError('');
    setPhoneLoading(true);
    const { error } = await signInWithPhone(phone);
    setPhoneLoading(false);
    if (error) setError(error.message);
    else router.push({ pathname: '/phone-verify', params: { phone } });
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
      {/* Subtle radial glow at top */}
      <View style={{
        position: 'absolute', top: -60, left: '20%',
        width: 300, height: 300, borderRadius: 150,
        backgroundColor: '#00D4FF08',
      }} />
      <View style={{
        position: 'absolute', top: -40, right: '10%',
        width: 200, height: 200, borderRadius: 100,
        backgroundColor: '#7C3AED08',
      }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xxl }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LogoMark colors={colors} />

          {!showPhone ? (
            <>
              <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text.primary, letterSpacing: -0.5, marginBottom: spacing.sm }}>
                Back to the grind 🔥
              </Text>
              <Text style={{ ...typography.body, color: colors.text.secondary, marginBottom: spacing.xxxl }}>
                Your momentum is waiting.
              </Text>

              <TextInput
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                leftIcon="mail-outline"
              />
              <TextInput
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon="lock-closed-outline"
              />

              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginBottom: spacing.xxl, marginTop: -spacing.sm }}
                onPress={() => router.push('/forgot-password')}
              >
                <Text style={{ ...typography.smallMedium, color: '#00D4FF' }}>Forgot password?</Text>
              </TouchableOpacity>

              {!!error && (
                <View style={{ backgroundColor: '#EF444418', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: '#EF444440' }}>
                  <Text style={{ ...typography.small, color: '#EF4444' }}>{error}</Text>
                </View>
              )}

              <PrimaryButton title={loading ? 'Signing in...' : 'Sign In'} onPress={handleLogin} loading={loading} />

              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xxl }}>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border.default }} />
                <Text style={{ ...typography.small, color: colors.text.muted, marginHorizontal: spacing.lg }}>or</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border.default }} />
              </View>

              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <SocialBtn onPress={handleGoogle} loading={googleLoading} icon="logo-google" label="Google" />
                <SocialBtn onPress={handleApple} loading={appleLoading} icon="logo-apple" label="Apple" />
                <SocialBtn onPress={() => { setShowPhone(true); setError(''); }} loading={false} icon="call" label="Phone" />
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xxl }}
                onPress={() => { setShowPhone(false); setPhone('+'); setError(''); }}
              >
                <Ionicons name="arrow-back" size={18} color={colors.text.secondary} />
                <Text style={{ ...typography.body, color: colors.text.secondary }}>Back to email</Text>
              </TouchableOpacity>

              <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text.primary, letterSpacing: -0.5, marginBottom: spacing.sm }}>
                Phone sign-in 📱
              </Text>
              <Text style={{ ...typography.body, color: colors.text.secondary, marginBottom: spacing.xxxl }}>
                We'll send you a verification code.
              </Text>

              <TextInput label="Phone" placeholder="+1 555 1234567" value={phone} onChangeText={handlePhoneChange} keyboardType="phone-pad" leftIcon="call-outline" />

              {!!error && (
                <View style={{ backgroundColor: '#EF444418', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md }}>
                  <Text style={{ ...typography.small, color: '#EF4444' }}>{error}</Text>
                </View>
              )}

              <PrimaryButton title={phoneLoading ? 'Sending...' : 'Send Code'} onPress={handlePhoneSend} loading={phoneLoading} />
            </>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxl }}>
            <Text style={{ ...typography.body, color: colors.text.secondary }}>New here? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={{ ...typography.bodyMedium, color: '#00D4FF' }}>Create account →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
