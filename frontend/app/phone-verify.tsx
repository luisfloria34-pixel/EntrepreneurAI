import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { useAuth } from '../src/context/AuthContext';

const CODE_LENGTH = 6;

export default function PhoneVerifyScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { verifyOTP, signInWithPhone } = useAuth();

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputs = useRef<(RNTextInput | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const token = code.join('');
    if (token.length < CODE_LENGTH) {
      setError('Enter all 6 digits.');
      return;
    }
    setError('');
    setLoading(true);
    const { error } = await verifyOTP(phone ?? '', token);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.replace('/(tabs)/dashboard');
    }
  };

  const handleResend = async () => {
    if (!phone) return;
    setError('');
    setResending(true);
    const { error } = await signInWithPhone(phone);
    setResending(false);
    if (error) setError(error.message);
    else setCode(Array(CODE_LENGTH).fill(''));
  };

  const masked = phone ? phone.replace(/(\+?\d{1,3})(\d+)(\d{4})/, '$1****$3') : '';

  return (
    <ScreenWrapper scroll keyboardAvoiding>
      <AppHeader showBack onBack={() => router.back()} />

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Verify Phone</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to {masked}
          </Text>
        </View>

        <View style={styles.codeRow}>
          {code.map((digit, i) => (
            <RNTextInput
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
              value={digit}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <PrimaryButton
          title={loading ? 'Verifying...' : 'Verify Code'}
          onPress={handleVerify}
          style={styles.verifyButton}
        />

        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>Didn't receive a code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={resending}>
            <Text style={styles.resendLink}>{resending ? 'Sending...' : 'Resend'}</Text>
          </TouchableOpacity>
        </View>
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
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  codeInput: {
    flex: 1,
    height: 60,
    borderRadius: radius.lg,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.default,
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  codeInputFilled: {
    borderColor: colors.accent.primary,
    backgroundColor: `${colors.accent.primary}10`,
  },
  errorText: {
    ...typography.small,
    color: '#FF4444',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  verifyButton: {
    marginTop: spacing.sm,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  resendLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  resendLink: {
    ...typography.bodyMedium,
    color: colors.accent.primary,
  },
});
