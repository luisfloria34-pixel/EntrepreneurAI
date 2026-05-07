import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export interface Proof {
  id: string;
  title: string | null;
  image_url: string | null;
  created_at: string;
}

export function useProofs() {
  const { user } = useAuth();
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('proofs')
      .select('id, title, image_url, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setProofs(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  return { proofs, loading, refetch: fetch };
}
