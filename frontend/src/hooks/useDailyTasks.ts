import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export interface DailyTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  xp: number;
  completed: boolean;
  type: string | null;
  date: string;
}

export function useDailyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .order('created_at', { ascending: true });
    setTasks(data ?? []);
    setLoading(false);
  }, [user, today]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTask = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !user) return;

    const newCompleted = !task.completed;

    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: newCompleted } : t))
    );

    await supabase
      .from('daily_tasks')
      .update({ completed: newCompleted })
      .eq('id', taskId);

    if (newCompleted) {
      try {
        await supabase.rpc('increment_xp', { user_id: user.id, xp_amount: task.xp });
      } catch {
        const { data } = await supabase
          .from('profiles')
          .select('total_xp, hustle_score')
          .eq('id', user.id)
          .single();
        if (data) {
          await supabase
            .from('profiles')
            .update({
              total_xp: (data.total_xp ?? 0) + task.xp,
              hustle_score: (data.hustle_score ?? 0) + task.xp,
            })
            .eq('id', user.id);
        }
      }
    }
  }, [tasks, user]);

  return { tasks, loading, toggleTask };
}
