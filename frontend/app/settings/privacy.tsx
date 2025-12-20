import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(true);
  const [profilePublic, setProfilePublic] = useState(true);

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title="Privacy" />
      
      <View style={styles.section}>
        <View style={styles.item}>
          <View style={styles.itemText}>
            <Text style={styles.itemTitle}>Public Profile</Text>
            <Text style={styles.itemSubtitle}>Let others see your profile</Text>
          </View>
          <Switch
            value={profilePublic}
            onValueChange={setProfilePublic}
            trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
            thumbColor={colors.text.primary}
          />
        </View>
        <View style={[styles.item, styles.itemBorder]}>
          <View style={styles.itemText}>
            <Text style={styles.itemTitle}>Analytics</Text>
            <Text style={styles.itemSubtitle}>Help us improve with usage data</Text>
          </View>
          <Switch
            value={analytics}
            onValueChange={setAnalytics}
            trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
            thumbColor={colors.text.primary}
          />
        </View>
      </View>

      <Text style={styles.sectionLabel}>Data</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.linkItem}>
          <Text style={styles.linkText}>Download My Data</Text>
          <Ionicons name="download-outline" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.linkItem, styles.itemBorder]}>
          <Text style={[styles.linkText, styles.dangerText]}>Delete Account</Text>
          <Ionicons name="trash-outline" size={20} color={colors.semantic.error} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>Legal</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.linkItem}>
          <Text style={styles.linkText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.linkItem, styles.itemBorder]}>
          <Text style={styles.linkText}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    ...typography.smallMedium,
    color: colors.text.secondary,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  itemBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  itemText: {
    flex: 1,
    marginRight: spacing.md,
  },
  itemTitle: {
    ...typography.body,
    color: colors.text.primary,
  },
  itemSubtitle: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  linkText: {
    ...typography.body,
    color: colors.text.primary,
  },
  dangerText: {
    color: colors.semantic.error,
  },
});
