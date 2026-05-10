import { supabase } from './supabase';

interface ProfileSnapshot {
  streak: number;
  lessons_completed: number;
}

async function awardBadge(userId: string, badgeId: string): Promise<void> {
  try {
    await supabase
      .from('user_badges')
      .insert({ user_id: userId, badge_id: badgeId });
  } catch {}
}

async function getEarnedIds(userId: string): Promise<Set<string>> {
  const { data } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId);
  return new Set((data ?? []).map(r => r.badge_id));
}

export async function checkAndAwardBadges(
  userId: string,
  profile: ProfileSnapshot,
  context?: { lessonCompletedAt?: Date; aiMessageCount?: number }
): Promise<void> {
  const earned = await getEarnedIds(userId);
  const now = context?.lessonCompletedAt ?? new Date();
  const hour = now.getHours();

  const checks: Array<{ id: string; condition: boolean }> = [
    { id: 'b1', condition: hour < 8 },
    { id: 'b2', condition: (profile.lessons_completed ?? 0) >= 1 },
    { id: 'b3', condition: (profile.streak ?? 0) >= 7 },
    { id: 'b4', condition: (context?.aiMessageCount ?? 0) >= 10 },
    { id: 'b8', condition: (profile.lessons_completed ?? 0) >= 100 },
    { id: 'b9', condition: hour === 0 || hour >= 23 },
  ];

  await Promise.all(
    checks
      .filter(c => c.condition && !earned.has(c.id))
      .map(c => awardBadge(userId, c.id))
  );
}
