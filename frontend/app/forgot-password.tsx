import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton, TextInput } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = () => {
    setSent(true);
  };

  return (
    <ScreenWrapper scroll keyboardAvoiding>
      <AppHeader showBack onBack={() => router.back()} />
      
      <View style={styles.content}>
        {!sent ? (
          <>
            <View style={styles.headerSection}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed-outline" size={40} color={colors.accent.primary} />
              </View>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                No worries! Enter your email and we'll send you a reset link.
              </Text>
            </View>

            <TextInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              leftIcon="mail-outline"
            />

            <PrimaryButton 
              title="Send Reset Link"
              onPress={handleReset}
              style={styles.button}
            />
          </>
        ) : (
          <View style={styles.successSection}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={64} color={colors.semantic.success} />
            </View>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successText}>
              We've sent a password reset link to{"\n"}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
            <PrimaryButton 
              title="Back to Login"
              onPress={() => router.push('/login')}
              style={styles.button}
            />
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: spacing.xxl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 24,
  },
  button: {
    marginTop: spacing.xxl,
  },
  successSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.section,
  },
  successIcon: {
    marginBottom: spacing.xxl,
  },
  successTitle: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
  },
  successText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 24,
  },
  emailText: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
});
