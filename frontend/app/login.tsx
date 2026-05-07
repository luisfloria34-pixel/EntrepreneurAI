import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton, TextInput } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle, signInWithPhone } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPhone, setShowPhone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.replace('/(tabs)/dashboard');
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);
    if (error) setError(error.message);
  };

  const handlePhoneSend = async () => {
    if (!phone.trim()) return;
    setError('');
    setPhoneLoading(true);
    const { error } = await signInWithPhone(phone.trim());
    setPhoneLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push({ pathname: '/phone-verify', params: { phone: phone.trim() } });
    }
  };

  return (
    <ScreenWrapper scroll keyboardAvoiding>
      <AppHeader showBack onBack={() => router.back()} />

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey</Text>
        </View>

        <View style={styles.formSection}>
          {!showPhone ? (
            <>
              <TextInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                leftIcon="mail-outline"
              />
              <TextInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon="lock-closed-outline"
              />

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => router.push('/forgot-password')}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <PrimaryButton
                title={loading ? 'Signing In...' : 'Sign In'}
                onPress={handleLogin}
                style={styles.loginButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.altButtons}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleGoogle}
                  disabled={googleLoading}
                >
                  {googleLoading
                    ? <ActivityIndicator size="small" color={colors.text.primary} />
                    : <Ionicons name="logo-google" size={22} color={colors.text.primary} />
                  }
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.phoneButton}
                  onPress={() => { setShowPhone(true); setError(''); }}
                >
                  <Ionicons name="call-outline" size={20} color={colors.accent.primary} />
                  <Text style={styles.phoneButtonText}>Phone Number</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.backRow} onPress={() => { setShowPhone(false); setError(''); }}>
                <Ionicons name="arrow-back" size={18} color={colors.text.secondary} />
                <Text style={styles.backText}>Back to email</Text>
              </TouchableOpacity>

              <TextInput
                label="Phone Number"
                placeholder="+1 234 567 8900"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                leftIcon="call-outline"
              />

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <PrimaryButton
                title={phoneLoading ? 'Sending Code...' : 'Send OTP Code'}
                onPress={handlePhoneSend}
                style={styles.loginButton}
              />
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerSection: {
    paddingTop: spacing.xxl,
    marginBottom: spacing.xxxl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  formSection: {
    flex: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xxl,
    marginTop: -spacing.sm,
  },
  forgotPasswordText: {
    ...typography.smallMedium,
    color: colors.accent.primary,
  },
  errorText: {
    ...typography.small,
    color: '#FF4444',
    marginBottom: spacing.sm,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xxxl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.default,
  },
  dividerText: {
    ...typography.small,
    color: colors.text.tertiary,
    marginHorizontal: spacing.lg,
  },
  altButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  phoneButton: {
    flex: 1,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.background.tertiary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  phoneButtonText: {
    ...typography.bodyMedium,
    color: colors.accent.primary,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  backText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  footerText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  footerLink: {
    ...typography.bodyMedium,
    color: colors.accent.primary,
  },
});
