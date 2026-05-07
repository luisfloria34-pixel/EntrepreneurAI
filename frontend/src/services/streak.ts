import { supabase } from './supabase';

export async function checkAndUpdateStreak(userId: string): Promise<void> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('streak, best_streak, last_active_date')
    .eq('id', userId)
    .single();

  if (error || !profile) return;

  const today = new Date().toISOString().split('T')[0];
  const lastActive = profile.last_active_date as string | null;

  if (lastActive === today) return;

  let newStreak = 1;
  if (lastActive) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    newStreak = lastActive === yesterdayStr ? (profile.streak ?? 0) + 1 : 1;
  }

  const newBest = Math.max(newStreak, profile.best_streak ?? 0);

  await supabase
    .from('profiles')
    .update({ streak: newStreak, best_streak: newBest, last_active_date: today })
    .eq('id', userId);
}
