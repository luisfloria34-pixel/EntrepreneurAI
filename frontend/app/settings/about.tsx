import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function AboutSettingsScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title="About" />
      
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="rocket" size={40} color={colors.accent.primary} />
        </View>
        <Text style={styles.appName}>EntrepreneurAI</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.linkItem}>
          <Text style={styles.linkText}>Rate the App</Text>
          <Ionicons name="star-outline" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.linkItem, styles.itemBorder]}>
          <Text style={styles.linkText}>Share with Friends</Text>
          <Ionicons name="share-outline" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.linkItem, styles.itemBorder]}>
          <Text style={styles.linkText}>Follow us on Twitter</Text>
          <Ionicons name="logo-twitter" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.section, styles.sectionMargin]}>
        <TouchableOpacity style={styles.linkItem}>
          <Text style={styles.linkText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.linkItem, styles.itemBorder]}>
          <Text style={styles.linkText}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.linkItem, styles.itemBorder]}>
          <Text style={styles.linkText}>Licenses</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.copyright}>
        © 2025 EntrepreneurAI.{"\n"}All rights reserved.
      </Text>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  logoSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  appName: {
    ...typography.h2,
    color: colors.text.primary,
  },
  version: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  section: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionMargin: {
    marginTop: spacing.lg,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  itemBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  linkText: {
    ...typography.body,
    color: colors.text.primary,
  },
  copyright: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.xxxl,
    lineHeight: 20,
  },
});
