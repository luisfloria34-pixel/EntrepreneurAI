import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, AppHeader } from '../../src/components';
import { colors, spacing, typography, radius } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/services/supabase';
import { useAuth } from '../../src/context/AuthContext';

interface Post {
  id: string;
  content: string;
  likes: number;
  created_at: string;
  user_id: string;
  profiles: { name: string | null; level: number } | null;
  comment_count: number;
  liked: boolean;
}

function timeAgo(ts: string) {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function CommunityScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('community_posts')
      .select('id, content, likes, created_at, user_id, profiles(name, level)')
      .order('created_at', { ascending: false })
      .limit(30);

    if (!data) { setLoading(false); return; }

    const postIds = data.map(p => p.id);

    const [commentsRes, likesRes] = await Promise.all([
      supabase.from('post_comments').select('post_id').in('post_id', postIds),
      user
        ? supabase.from('post_likes').select('post_id').eq('user_id', user.id).in('post_id', postIds)
        : Promise.resolve({ data: [] }),
    ]);

    const commentCounts = new Map<string, number>();
    (commentsRes.data ?? []).forEach(r => commentCounts.set(r.post_id, (commentCounts.get(r.post_id) ?? 0) + 1));
    const likedSet = new Set((likesRes.data ?? []).map(r => r.post_id));

    setPosts(data.map(p => ({
      ...p,
      profiles: Array.isArray(p.profiles) ? p.profiles[0] ?? null : p.profiles,
      comment_count: commentCounts.get(p.id) ?? 0,
      liked: likedSet.has(p.id),
    })));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPosts();
    const channel = supabase
      .channel('community_posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, fetchPosts)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  async function toggleLike(post: Post) {
    if (!user) return;
    const optimisticLiked = !post.liked;
    setPosts(prev => prev.map(p => p.id === post.id
      ? { ...p, liked: optimisticLiked, likes: p.likes + (optimisticLiked ? 1 : -1) }
      : p
    ));

    if (optimisticLiked) {
      await supabase.from('post_likes').insert({ user_id: user.id, post_id: post.id });
      await supabase.from('community_posts').update({ likes: post.likes + 1 }).eq('id', post.id);
    } else {
      await supabase.from('post_likes').delete().eq('user_id', user.id).eq('post_id', post.id);
      await supabase.from('community_posts').update({ likes: Math.max(0, post.likes - 1) }).eq('id', post.id);
    }
  }

  return (
    <ScreenWrapper scroll>
      <AppHeader
        showBack
        onBack={() => router.back()}
        title="Community"
        rightIcon="add-circle-outline"
        onRightPress={() => router.push('/community/create')}
      />

      {loading ? (
        <View style={styles.loading}><ActivityIndicator color={colors.accent.primary} /></View>
      ) : posts.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="people-outline" size={48} color={colors.text.muted} />
          <Text style={styles.emptyText}>No posts yet. Be the first!</Text>
        </View>
      ) : (
        posts.map(post => (
          <TouchableOpacity
            key={post.id}
            style={styles.postCard}
            onPress={() => router.push(`/community/post/${post.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.postHeader}>
              <View style={styles.authorInfo}>
                <View style={styles.authorAvatar}>
                  <Text style={styles.avatarText}>
                    {(post.profiles?.name ?? 'U')[0].toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={styles.authorName}>{post.profiles?.name ?? 'User'}</Text>
                  <Text style={styles.postTime}>
                    Level {post.profiles?.level ?? 1} · {timeAgo(post.created_at)}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(post)}>
                <Ionicons
                  name={post.liked ? 'heart' : 'heart-outline'}
                  size={22}
                  color={post.liked ? colors.semantic.error : colors.text.secondary}
                />
                <Text style={[styles.actionText, post.liked && styles.actionTextActive]}>
                  {post.likes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(`/community/post/${post.id}`)}
              >
                <Ionicons name="chatbubble-outline" size={20} color={colors.text.secondary} />
                <Text style={styles.actionText}>{post.comment_count}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loading: { paddingTop: spacing.section, alignItems: 'center' },
  empty: { paddingTop: spacing.section, alignItems: 'center', gap: spacing.md },
  emptyText: { ...typography.body, color: colors.text.tertiary },
  postCard: {
    backgroundColor: colors.background.card, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.lg,
  },
  postHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: spacing.lg,
  },
  authorInfo: { flexDirection: 'row', alignItems: 'center' },
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
});
