import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../../../src/components';
import { colors, spacing, typography, radius } from '../../../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { communityPosts, postComments } from '../../../../src/data/dummyData';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const post = communityPosts.find(p => p.id === id) || communityPosts[0];
  const comments = postComments.filter(c => c.postId === post.id);

  const formatTime = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <ScreenWrapper edges={['top']} padded={false}>
      <View style={styles.header}>
        <AppHeader showBack onBack={() => router.back()} title="Post" />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Post */}
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.authorAvatar}>
              <Text style={styles.avatarText}>{post.author.name[0]}</Text>
            </View>
            <View>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <Text style={styles.postTime}>Level {post.author.level} • {formatTime(post.timestamp)}</Text>
            </View>
          </View>
          <Text style={styles.postContent}>{post.content}</Text>
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name={post.liked ? 'heart' : 'heart-outline'} size={22} color={post.liked ? colors.semantic.error : colors.text.secondary} />
              <Text style={styles.actionText}>{post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={20} color={colors.text.secondary} />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments */}
        <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
        {comments.map((comment) => (
          <View key={comment.id} style={styles.commentCard}>
            <View style={styles.commentAvatar}>
              <Text style={styles.commentAvatarText}>{comment.author.name[0]}</Text>
            </View>
            <View style={styles.commentContent}>
              <Text style={styles.commentAuthor}>{comment.author.name} • Lvl {comment.author.level}</Text>
              <Text style={styles.commentText}>{comment.content}</Text>
              <Text style={styles.commentTime}>{formatTime(comment.timestamp)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor={colors.text.muted}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={20} color={colors.text.inverse} />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    padding: spacing.lg,
  },
  postCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.bodyMedium,
    color: colors.text.inverse,
  },
  authorName: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  postTime: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  postContent: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 24,
  },
  postActions: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    gap: spacing.xxl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionText: {
    ...typography.small,
    color: colors.text.secondary,
  },
  commentsTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  commentCard: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  commentAvatarText: {
    ...typography.small,
    color: colors.text.secondary,
  },
  commentContent: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  commentAuthor: {
    ...typography.smallMedium,
    color: colors.text.primary,
  },
  commentText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  commentTime: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    backgroundColor: colors.background.primary,
    gap: spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text.primary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
