import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader, Badge } from '../src/components';
import { colors, spacing, typography, radius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { communityPosts } from '../src/data/dummyData';

export default function CommunityScreen() {
  const router = useRouter();

  const formatTime = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <ScreenWrapper scroll>
      <AppHeader 
        showBack 
        onBack={() => router.back()} 
        title="Community" 
        rightIcon="add-circle-outline"
        onRightPress={() => router.push('/community/create')}
      />
      
      {/* Posts */}
      {communityPosts.map((post) => (
        <TouchableOpacity 
          key={post.id}
          style={styles.postCard}
          onPress={() => router.push(`/community/post/${post.id}`)}
          activeOpacity={0.7}
        >
          <View style={styles.postHeader}>
            <TouchableOpacity 
              style={styles.authorInfo}
              onPress={() => router.push(`/community/user/${post.author.id}`)}
            >
              <View style={styles.authorAvatar}>
                <Text style={styles.avatarText}>{post.author.name[0]}</Text>
              </View>
              <View>
                <Text style={styles.authorName}>{post.author.name}</Text>
                <Text style={styles.postTime}>Level {post.author.level} • {formatTime(post.timestamp)}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.postContent}>{post.content}</Text>
          
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons 
                name={post.liked ? 'heart' : 'heart-outline'} 
                size={22} 
                color={post.liked ? colors.semantic.error : colors.text.secondary} 
              />
              <Text style={[styles.actionText, post.liked && styles.actionTextActive]}>{post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={20} color={colors.text.secondary} />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
  actionTextActive: {
    color: colors.semantic.error,
  },
});
