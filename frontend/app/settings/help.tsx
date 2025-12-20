import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function HelpSettingsScreen() {
  const router = useRouter();

  const faqItems = [
    { question: 'How do I reset my progress?', answer: 'Go to Settings > Privacy > Reset Progress' },
    { question: 'How do streaks work?', answer: 'Complete at least one lesson each day to maintain your streak' },
    { question: 'Can I use the app offline?', answer: 'Yes! Download lessons for offline access' },
  ];

  return (
    <ScreenWrapper scroll>
      <AppHeader showBack onBack={() => router.back()} title="Help & Support" />
      
      <Text style={styles.sectionLabel}>Contact Us</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.contactItem}>
          <View style={[styles.contactIcon, { backgroundColor: `${colors.accent.primary}20` }]}>
            <Ionicons name="mail-outline" size={22} color={colors.accent.primary} />
          </View>
          <View style={styles.contactText}>
            <Text style={styles.contactTitle}>Email Support</Text>
            <Text style={styles.contactSubtitle}>support@entrepreneurai.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.contactItem, styles.itemBorder]}>
          <View style={[styles.contactIcon, { backgroundColor: `${colors.semantic.purple}20` }]}>
            <Ionicons name="chatbubble-outline" size={22} color={colors.semantic.purple} />
          </View>
          <View style={styles.contactText}>
            <Text style={styles.contactTitle}>Live Chat</Text>
            <Text style={styles.contactSubtitle}>Available 9am - 5pm EST</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>FAQs</Text>
      <View style={styles.section}>
        {faqItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.faqItem, index > 0 && styles.itemBorder]}
          >
            <Text style={styles.faqQuestion}>{item.question}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Resources</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.linkItem}>
          <Text style={styles.linkText}>Getting Started Guide</Text>
          <Ionicons name="book-outline" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.linkItem, styles.itemBorder]}>
          <Text style={styles.linkText}>Video Tutorials</Text>
          <Ionicons name="play-circle-outline" size={20} color={colors.text.secondary} />
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  contactText: {
    flex: 1,
  },
  contactTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  contactSubtitle: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  itemBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  faqQuestion: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.md,
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
});
