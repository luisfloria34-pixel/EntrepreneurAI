import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, PrimaryButton, Badge, ProgressBar } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { courseLessons } from '../../src/data/dummyData';

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Find lesson from all courses
  const allLessons = Object.values(courseLessons).flat();
  const lesson = allLessons.find(l => l.id === id) || allLessons[2]; // Default to lesson 3
  const courseLessonsList = courseLessons[lesson.courseId] || courseLessons['1'];
  const currentIndex = courseLessonsList.findIndex(l => l.id === lesson.id);
  const completedCount = courseLessonsList.filter(l => l.completed).length;

  const handleMarkDone = () => {
    setIsCompleted(true);
  };

  const handleNext = () => {
    if (currentIndex < courseLessonsList.length - 1) {
      router.replace(`/lesson/${courseLessonsList[currentIndex + 1].id}`);
    } else {
      router.back();
    }
  };

  return (
    <ScreenWrapper edges={['top']} padded={false}>
      <View style={styles.headerContainer}>
        <AppHeader showBack onBack={() => router.back()} rightIcon="bookmark-outline" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video Placeholder */}
        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={40} color={colors.text.inverse} />
            </TouchableOpacity>
            <Text style={styles.videoDuration}>{lesson.duration}</Text>
          </View>
          <View style={styles.videoProgress}>
            <View style={styles.videoProgressFill} />
          </View>
        </View>

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

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Course Progress</Text>
            <Text style={styles.progressText}>{completedCount} of {courseLessonsList.length}</Text>
          </View>
          <ProgressBar 
            progress={(completedCount / courseLessonsList.length) * 100} 
            height={6} 
            showPercentage={false} 
          />
        </View>

        {/* Lesson Content */}
        <View style={styles.lessonContent}>
          <Text style={styles.contentTitle}>In This Lesson</Text>
          <View style={styles.contentList}>
            <ContentItem icon="checkmark-circle" text="Key concepts and fundamentals" completed />
            <ContentItem icon="checkmark-circle" text="Practical examples and case studies" completed />
            <ContentItem icon="ellipse-outline" text="Interactive exercises" />
            <ContentItem icon="ellipse-outline" text="Summary and key takeaways" />
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Your Notes</Text>
          <TouchableOpacity style={styles.notesInput}>
            <Ionicons name="create-outline" size={20} color={colors.text.tertiary} />
            <Text style={styles.notesPlaceholder}>Tap to add notes for this lesson...</Text>
          </TouchableOpacity>
        </View>

        {/* Resources */}
        <View style={styles.resourcesSection}>
          <Text style={styles.resourcesTitle}>Resources</Text>
          <TouchableOpacity style={styles.resourceItem}>
            <View style={styles.resourceIcon}>
              <Ionicons name="document-text" size={20} color={colors.accent.primary} />
            </View>
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceName}>Lesson Worksheet</Text>
              <Text style={styles.resourceType}>PDF Document</Text>
            </View>
            <Ionicons name="download-outline" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        {isCompleted ? (
          <PrimaryButton title="Next Lesson" onPress={handleNext} />
        ) : (
          <PrimaryButton title="Mark as Complete" onPress={handleMarkDone} />
        )}
      </View>
    </ScreenWrapper>
  );
}

const ContentItem = ({ icon, text, completed }: { icon: keyof typeof Ionicons.glyphMap; text: string; completed?: boolean }) => (
  <View style={styles.contentItem}>
    <Ionicons name={icon} size={20} color={completed ? colors.semantic.success : colors.text.tertiary} />
    <Text style={[styles.contentItemText, completed && styles.contentItemCompleted]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    paddingBottom: spacing.section,
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
  videoDuration: {
    ...typography.small,
    color: colors.text.secondary,
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.background.overlay,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
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
  lessonInfo: {
    padding: spacing.lg,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  durationText: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  lessonTitle: {
    ...typography.h1,
    color: colors.text.primary,
  },
  lessonDescription: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
    lineHeight: 24,
  },
  progressCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  progressText: {
    ...typography.small,
    color: colors.text.secondary,
  },
  lessonContent: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  contentTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  contentList: {
    gap: spacing.lg,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  contentItemText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  contentItemCompleted: {
    color: colors.text.primary,
  },
  notesSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  notesTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  notesInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  notesPlaceholder: {
    ...typography.body,
    color: colors.text.tertiary,
  },
  resourcesSection: {
    paddingHorizontal: spacing.lg,
  },
  resourcesTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
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
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  resourceType: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  bottomCta: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },
});
