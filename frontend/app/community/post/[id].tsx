import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../../src/components';
import { colors, spacing, typography, radius } from '../../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../src/services/supabase';
import { useAuth } from '../../../src/context/AuthContext';
import { getIsPro } from '../../../src/services/proStatus';

interface Post {
  id: string;
  content: string;
  likes: number;
  created_at: string;
  user_id: string;
  profiles: { name: string | null; level: number } | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: { name: string | null; level: number } | null;
}

function timeAgo(ts: string) {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => { getIsPro().then(setIsPro); }, []);
  const scrollRef = useRef<ScrollView>(null);

  const postId = Array.isArray(id) ? id[0] : id;

  useEffect(() => { loadPost(); }, [postId, user]);

  async function loadPost() {
    setLoading(true);
    const [postRes, commentsRes, likeRes] = await Promise.all([
      supabase.from('community_posts').select('id, content, likes, created_at, user_id, profiles(name, level)').eq('id', postId).single(),
      supabase.from('post_comments').select('id, content, created_at, profiles(name, level)').eq('post_id', postId).order('created_at'),
      user ? supabase.from('post_likes').select('id').eq('post_id', postId).eq('user_id', user.id).maybeSingle() : Promise.resolve({ data: null }),
    ]);

    if (postRes.data) {
      const p = postRes.data;
      setPost({ ...p, profiles: Array.isArray(p.profiles) ? p.profiles[0] ?? null : p.profiles });
    }
    setComments((commentsRes.data ?? []).map(c => ({
      ...c,
      profiles: Array.isArray(c.profiles) ? c.profiles[0] ?? null : c.profiles,
    })));
    setLiked(!!(likeRes as any).data);
    setLoading(false);
  }

  async function toggleLike() {
    if (!user || !post) return;
    const nowLiked = !liked;
    setLiked(nowLiked);
    setPost(p => p ? { ...p, likes: p.likes + (nowLiked ? 1 : -1) } : p);

    if (nowLiked) {
      await supabase.from('post_likes').insert({ user_id: user.id, post_id: post.id });
      await supabase.from('community_posts').update({ likes: post.likes + 1 }).eq('id', post.id);
    } else {
      await supabase.from('post_likes').delete().eq('user_id', user.id).eq('post_id', post.id);
      await supabase.from('community_posts').update({ likes: Math.max(0, post.likes - 1) }).eq('id', post.id);
    }
  }

  async function submitComment() {
    if (!user || !commentText.trim() || sending) return;
    setSending(true);
    const { error } = await supabase.from('post_comments').insert({
      user_id: user.id,
      post_id: postId,
      content: commentText.trim(),
    });
    if (error) {
      Alert.alert('Error', 'Could not post comment.');
    } else {
      setCommentText('');
      await loadPost();
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
    }
    setSending(false);
  }

  if (loading) {
    return (
      <ScreenWrapper edges={['top']} padded={false}>
        <View style={styles.header}><AppHeader showBack onBack={() => router.back()} title="Post" /></View>
        <View style={styles.loading}><ActivityIndicator color={colors.accent.primary} /></View>
      </ScreenWrapper>
    );
  }

  if (!post) {
    return (
      <ScreenWrapper edges={['top']} padded={false}>
        <View style={styles.header}><AppHeader showBack onBack={() => router.back()} title="Post" /></View>
        <View style={styles.loading}><Text style={styles.emptyText}>Post not found.</Text></View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper edges={['top']} padded={false}>
      <View style={styles.header}>
        <AppHeader showBack onBack={() => router.back()} title="Post" />
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.authorAvatar}>
              <Text style={styles.avatarText}>{(post.profiles?.name ?? 'U')[0].toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.authorName}>{post.profiles?.name ?? 'User'}</Text>
              <Text style={styles.postTime}>Level {post.profiles?.level ?? 1} · {timeAgo(post.created_at)}</Text>
            </View>
          </View>

          <Text style={styles.postContent}>{post.content}</Text>

          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? colors.semantic.error : colors.text.secondary} />
              <Text style={[styles.actionText, liked && styles.actionTextActive]}>{post.likes}</Text>
            </TouchableOpacity>
            <View style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={20} color={colors.text.secondary} />
              <Text style={styles.actionText}>{comments.length}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>

        {comments.length === 0 && (
          <Text style={styles.emptyText}>No comments yet. Start the conversation!</Text>
        )}

        {comments.map(comment => (
          <View key={comment.id} style={styles.commentCard}>
            <View style={styles.commentAvatar}>
              <Text style={styles.commentAvatarText}>{(comment.profiles?.name ?? 'U')[0].toUpperCase()}</Text>
            </View>
            <View style={styles.commentContent}>
              <Text style={styles.commentAuthor}>
                {comment.profiles?.name ?? 'User'} · Lvl {comment.profiles?.level ?? 1}
              </Text>
              <Text style={styles.commentText}>{comment.content}</Text>
              <Text style={styles.commentTime}>{timeAgo(comment.created_at)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {isPro ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            placeholderTextColor={colors.text.muted}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, (!commentText.trim() || sending) && styles.sendButtonDisabled]}
            onPress={submitComment}
            disabled={!commentText.trim() || sending}
          >
            <Ionicons name="send" size={20} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.commentLockBanner}
          onPress={() => router.push({ pathname: '/paywall', params: { message: 'Join Pro to comment' } })}
        >
          <Ionicons name="lock-closed" size={16} color={colors.accent.primary} />
          <Text style={styles.commentLockText}>Join Pro to comment</Text>
          <Text style={styles.commentLockCta}>Upgrade ⚡</Text>
        </TouchableOpacity>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.lg },
  postCard: {
    backgroundColor: colors.background.card, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.xxl,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  authorAvatar: {
    width: 44, height: 44, borderRadius: radius.full,
    backgroundColor: colors.accent.primary, alignItems: 'center',
    justifyContent: 'center', marginRight: spacing.md,
  },
  avatarText: { ...typography.bodyMedium, color: colors.text.inverse },
  authorName: { ...typography.bodyMedium, color: colors.text.primary },
  postTime: { ...typography.caption, color: colors.text.tertiary, marginTop: spacing.xs },
  postContent: { ...typography.body, color: colors.text.primary, lineHeight: 24 },
  postActions: {
    flexDirection: 'row', marginTop: spacing.lg, paddingTop: spacing.lg,
    borderTopWidth: 1, borderTopColor: colors.border.default, gap: spacing.xxl,
  },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  actionText: { ...typography.small, color: colors.text.secondary },
  actionTextActive: { color: colors.semantic.error },
  commentsTitle: { ...typography.h3, color: colors.text.primary, marginBottom: spacing.lg },
  emptyText: { ...typography.body, color: colors.text.tertiary, marginBottom: spacing.lg },
  commentCard: { flexDirection: 'row', marginBottom: spacing.lg },
  commentAvatar: {
    width: 36, height: 36, borderRadius: radius.full,
    backgroundColor: colors.background.tertiary, alignItems: 'center',
    justifyContent: 'center', marginRight: spacing.md,
  },
  commentAvatarText: { ...typography.small, color: colors.text.secondary },
  commentContent: {
    flex: 1, backgroundColor: colors.background.card,
    borderRadius: radius.lg, padding: spacing.md,
  },
  commentAuthor: { ...typography.smallMedium, color: colors.text.primary },
  commentText: { ...typography.body, color: colors.text.secondary, marginTop: spacing.sm },
  commentTime: { ...typography.caption, color: colors.text.tertiary, marginTop: spacing.sm },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.lg,
    borderTopWidth: 1, borderTopColor: colors.border.default,
    backgroundColor: colors.background.primary, gap: spacing.md,
  },
  input: {
    flex: 1, backgroundColor: colors.background.tertiary,
    borderRadius: radius.full, paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md, ...typography.body, color: colors.text.primary,
  },
  sendButton: {
    width: 44, height: 44, borderRadius: radius.full,
    backgroundColor: colors.accent.primary, alignItems: 'center', justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.4 },
  commentLockBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },
  commentLockText: { ...typography.body, color: colors.text.secondary, flex: 1 },
  commentLockCta: { ...typography.smallMedium, color: colors.accent.primary },
});
