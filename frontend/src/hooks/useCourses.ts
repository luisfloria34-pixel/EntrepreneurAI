import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor: string | null;
  rating: number;
  total_lessons: number;
  duration: string | null;
  level: string;
  icon: string | null;
  icon_color: string | null;
}

export interface CourseWithProgress extends Course {
  completed_lessons: number;
  progress: number;
}

export function useCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);

    const [coursesRes, progressRes] = await Promise.all([
      supabase.from('courses').select('*').order('created_at', { ascending: true }),
      user
        ? supabase
            .from('user_progress')
            .select('course_id, completed_lessons, progress')
            .eq('user_id', user.id)
        : Promise.resolve({ data: [], error: null }),
    ]);

    const progressMap = new Map<string, { completed_lessons: number; progress: number }>(
      ((progressRes as any).data ?? []).map((p: any) => [
        p.course_id,
        { completed_lessons: p.completed_lessons, progress: p.progress },
      ])
    );

    const merged: CourseWithProgress[] = (coursesRes.data ?? []).map((c: Course) => {
      const p = progressMap.get(c.id);
      return {
        ...c,
        completed_lessons: p?.completed_lessons ?? 0,
        progress: p?.progress ?? 0,
      };
    });

    setCourses(merged);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const inProgress = courses.filter(c => c.progress > 0 && c.progress < 100);
  const available = courses.filter(c => c.progress === 0);

  return { courses, inProgress, available, loading, refetch: fetch };
}
