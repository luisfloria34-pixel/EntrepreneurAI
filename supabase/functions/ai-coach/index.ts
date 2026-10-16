import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const system = 'You are an expert entrepreneur and business coach. Give concise, actionable advice. Max 3 sentences per response. Focus on practical steps.';
const languages: Record<string,string> = { de: 'Always respond in German.', es: 'Always respond in Spanish.', fr: 'Always respond in French.', pt: 'Always respond in Portuguese.', en: '' };

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'Authentication required' }, 401);
  const url = Deno.env.get('SUPABASE_URL')!;
  const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const groqKey = Deno.env.get('GROQ_API_KEY');
  if (!groqKey) return json({ error: 'AI service not configured' }, 503);
  const authClient = createClient(url, anon);
  const { data: { user }, error: authError } = await authClient.auth.getUser(token);
  if (authError || !user) return json({ error: 'Invalid session' }, 401);
  let body: { messages?: Array<{ role: string; content: string; imageUrl?: string }>; language?: string };
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 30 ||
      messages.some(m => !['user','assistant'].includes(m.role) || typeof m.content !== 'string' || m.content.length > 4000 ||
        (m.imageUrl !== undefined && (typeof m.imageUrl !== 'string' || !m.imageUrl.startsWith('https://'))))) {
    return json({ error: 'Invalid messages' }, 400);
  }
  // Server checks the entitlement; client-supplied isPro is deliberately ignored.
  let isPro = false;
  const rcSecret = Deno.env.get('REVENUECAT_SECRET_API_KEY');
  const entitlement = Deno.env.get('REVENUECAT_ENTITLEMENT_ID') || 'EntrepeneuerAI Pro';
  if (rcSecret) {
    try {
      const rc = await fetch('https://api.revenuecat.com/v1/subscribers/' + encodeURIComponent(user.id), {
        headers: { Authorization: 'Bearer ' + rcSecret },
      });
      if (!rc.ok) return json({ error: 'Subscription validation unavailable' }, 503);
      const info = await rc.json();
      const item = info.subscriber?.entitlements?.[entitlement];
      isPro = !!item && (!item.expires_date || new Date(item.expires_date).getTime() > Date.now());
    } catch { return json({ error: 'Subscription validation unavailable' }, 503); }
  }
  const admin = createClient(url, serviceKey);
  const { data: allowed, error: quotaError } = await admin.rpc('consume_ai_message', { p_user_id: user.id, p_is_pro: isPro });
  if (quotaError) return json({ error: 'Usage check unavailable' }, 503);
  if (!allowed) return json({ error: 'Daily message limit reached', code: 'DAILY_LIMIT' }, 429);
  const hasImage = messages.some(m => !!m.imageUrl);
  const mapped = messages.map(m => ({ role: m.role, content: m.imageUrl
    ? [{ type: 'image_url', image_url: { url: m.imageUrl } }, { type: 'text', text: m.content || 'Describe this image.' }]
    : m.content }));
  try {
    const result = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + groqKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: hasImage ? 'meta-llama/llama-4-scout-17b-16e-instruct' : 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: system + ' ' + (languages[body.language || 'en'] || '') }, ...mapped],
        max_tokens: 500,
      }),
    });
    if (!result.ok) return json({ error: 'AI provider unavailable' }, 502);
    const data = await result.json();
    return json({ reply: data.choices?.[0]?.message?.content ?? '' });
  } catch { return json({ error: 'AI service unavailable' }, 502); }
});
