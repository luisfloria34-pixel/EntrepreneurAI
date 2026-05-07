import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export interface WeeklyXPDay {
  day: string;
  xp: number;
}

export interface CalendarDay {
  date: string;
  completed: boolean;
}

export interface AnalyticsData {
  weeklyXP: WeeklyXPDay[];
  streakCalendar: CalendarDay[];
  weeklyTotal: number;
}

function buildLast7Days(): WeeklyXPDay[] {
  const days: WeeklyXPDay[] = [];
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ day: labels[d.getDay()], xp: 0 });
  }
  return days;
}

function buildLast28Days(): CalendarDay[] {
  const days: CalendarDay[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ date: d.toISOString().split('T')[0], completed: false });
  }
  return days;
}

export function useAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData>({
    weeklyXP: buildLast7Days(),
    streakCalendar: buildLast28Days(),
    weeklyTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 27);
    const monthAgoStr = monthAgo.toISOString().split('T')[0];

    const [xpRes, activityRes] = await Promise.all([
      supabase
        .from('xp_history')
        .select('xp, created_at')
        .eq('user_id', user.id)
        .gte('created_at', `${weekAgoStr}T00:00:00`),
      supabase
        .from('daily_activity')
        .select('activity_date')
        .eq('user_id', user.id)
        .gte('activity_date', monthAgoStr),
    ]);

    const weeklyXP = buildLast7Days();
    if (!xpRes.error && xpRes.data) {
      for (const row of xpRes.data) {
        const dayLabel = new Date(row.created_at).toLocaleDateString('en-US', { weekday: 'short' });
        const entry = weeklyXP.find(d => d.day === dayLabel);
        if (entry) entry.xp += row.xp;
      }
    }

    const streakCalendar = buildLast28Days();
    if (!activityRes.error && activityRes.data) {
      const activeDates = new Set(activityRes.data.map(r => r.activity_date));
      for (const day of streakCalendar) {
        day.completed = activeDates.has(day.date);
      }
    }

    setData({
      weeklyXP,
      streakCalendar,
      weeklyTotal: weeklyXP.reduce((sum, d) => sum + d.xp, 0),
    });
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading };
}
