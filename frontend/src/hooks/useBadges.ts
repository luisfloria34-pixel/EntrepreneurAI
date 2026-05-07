import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export interface BadgeDef {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export interface Badge extends BadgeDef {
  earned: boolean;
  earnedAt: string | null;
}

export const ALL_BADGES: BadgeDef[] = [
  { id: 'b1', name: 'Early Bird', emoji: '🌅', color: '#F59E0B', description: 'Complete a lesson before 8 AM' },
  { id: 'b2', name: 'First Course', emoji: '🎓', color: '#10B981', description: 'Complete your first course' },
  { id: 'b3', name: 'Week Streak', emoji: '🔥', color: '#EF4444', description: 'Learn 7 days in a row' },
  { id: 'b4', name: 'Idea Machine', emoji: '💡', color: '#8B5CF6', description: 'Generate 10 ideas with AI Coach' },
  { id: 'b5', name: 'Proof Master', emoji: '📸', color: '#00D4FF', description: 'Upload 5 proofs of work' },
  { id: 'b6', name: 'Community Star', emoji: '⭐', color: '#EC4899', description: 'Get 50 likes on your posts' },
  { id: 'b7', name: 'Mentor', emoji: '🧑‍🏫', color: '#06B6D4', description: 'Help 10 community members' },
  { id: 'b8', name: 'Marathon', emoji: '🏆', color: '#F59E0B', description: 'Complete 100 lessons' },
  { id: 'b9', name: 'Night Owl', emoji: '🦉', color: '#6366F1', description: 'Complete a lesson after midnight' },
  { id: 'b10', name: 'Perfectionist', emoji: '💎', color: '#14B8A6', description: 'Complete all tasks for 30 days' },
];

export function useBadges() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>(
    ALL_BADGES.map(b => ({ ...b, earned: false, earnedAt: null }))
  );
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('user_badges')
      .select('badge_id, earned_at')
      .eq('user_id', user.id);

    const earnedMap = new Map<string, string>(
      (data ?? []).map(r => [r.badge_id, r.earned_at])
    );

    setBadges(
      ALL_BADGES.map(b => ({
        ...b,
        earned: earnedMap.has(b.id),
        earnedAt: earnedMap.get(b.id) ?? null,
      }))
    );
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const earnedCount = badges.filter(b => b.earned).length;
  return { badges, earnedCount, loading };
}
