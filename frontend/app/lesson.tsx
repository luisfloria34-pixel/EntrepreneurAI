import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton, Badge, ProgressBar } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { lessons } from '../src/data/dummyData';

export default function LessonScreen() {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Using first incomplete lesson as example
  const lesson = lessons.find((l) => !l.completed) || lessons[0];

  const handleMarkDone = () => {
    setIsCompleted(true);
    // In real app, this would update the lesson status
  };

  return (
    <ScreenWrapper padded={false}>
      <View style={styles.headerContainer}>
        <AppHeader 
          showBack
          onBack={() => router.back()}
          rightIcon="bookmark-outline"
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Video Placeholder */}
        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={40} color={colors.text.inverse} />
            </TouchableOpacity>
          </View>
          <View style={styles.videoProgress}>
            <View style={styles.videoProgressFill} />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Lesson Info */}
          <View style={styles.lessonInfo}>
            <View style={styles.lessonMeta}>
              <Badge label={`Lesson ${lesson.order}`} size="small" />
              <View style={styles.duration}>
                <Ionicons name="time-outline" size={14} color={colors.text.tertiary} />
                <Text style={styles.durationText}>{lesson.duration}</Text>
              </View>
            </View>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.lessonDescription}>{lesson.description}</Text>
          </View>

          {/* Course Progress */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Course Progress</Text>
              <Text style={styles.progressText}>8 of 12 completed</Text>
            </View>
            <ProgressBar progress={65} height={6} showPercentage={false} />
          </View>

          {/* Lesson Content (Placeholder) */}
          <View style={styles.lessonContent}>
            <Text style={styles.contentTitle}>In This Lesson</Text>
            <View style={styles.contentList}>
              <ContentItem 
                icon="checkmark-circle"
                text="Understanding your target market"
                completed
              />
              <ContentItem 
                icon="checkmark-circle"
                text="Identifying customer pain points"
                completed
              />
              <ContentItem 
                icon="ellipse-outline"
                text="Analyzing your competition"
              />
              <ContentItem 
                icon="ellipse-outline"
                text="Creating your unique value proposition"
              />
            </View>
          </View>

          {/* Resources */}
          <View style={styles.resourcesSection}>
            <Text style={styles.resourcesTitle}>Resources</Text>
            <TouchableOpacity style={styles.resourceItem}>
              <View style={styles.resourceIcon}>
                <Ionicons name="document-text" size={20} color={colors.accent.primary} />
              </View>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceName}>Market Research Template</Text>
                <Text style={styles.resourceType}>PDF Document</Text>
              </View>
              <Ionicons name="download-outline" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        <PrimaryButton 
          title={isCompleted ? "Completed!" : "Mark as Complete"}
          onPress={handleMarkDone}
          disabled={isCompleted}
        />
      </View>
    </ScreenWrapper>
  );
}

const ContentItem = ({ icon, text, completed }: { icon: keyof typeof Ionicons.glyphMap; text: string; completed?: boolean }) => (
  <View style={styles.contentItem}>
    <Ionicons 
      name={icon} 
      size={20} 
      color={completed ? colors.semantic.success : colors.text.tertiary} 
    />
    <Text style={[styles.contentItemText, completed && styles.contentItemCompleted]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: spacing.md,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  videoContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: colors.background.secondary,
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.tertiary,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  videoProgress: {
    height: 4,
    backgroundColor: colors.background.tertiary,
  },
  videoProgressFill: {
    width: '35%',
    height: '100%',
    backgroundColor: colors.accent.primary,
  },
  content: {
    padding: spacing.md,
  },
  lessonInfo: {
    marginBottom: spacing.lg,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  durationText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  lessonTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  lessonDescription: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  progressCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  lessonContent: {
    marginBottom: spacing.lg,
  },
  contentTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  contentList: {
    gap: spacing.md,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  contentItemText: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  contentItemCompleted: {
    color: colors.text.primary,
  },
  resourcesSection: {
    marginTop: spacing.md,
  },
  resourcesTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  resourceIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: `${colors.accent.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  resourceType: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  bottomCta: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },
});
