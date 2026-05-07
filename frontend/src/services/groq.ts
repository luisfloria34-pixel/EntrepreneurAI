const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT =
  'You are an expert entrepreneur and business coach. Give concise, actionable advice. Max 3 sentences per response. Focus on practical steps.';

export async function sendMessage(
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  if (!GROQ_API_KEY) {
    console.error('[Groq] EXPO_PUBLIC_GROQ_API_KEY is not set');
    throw new Error('Groq API key not configured');
  }

  const body = JSON.stringify({
    model: 'llama3-8b-8192',
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    max_tokens: 500,
  });

  console.log('[Groq] Sending request, message count:', messages.length);

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Groq] HTTP error:', response.status, errorText);
    throw new Error(`Groq API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('[Groq] Response received');
  return data.choices[0]?.message?.content ?? '';
}
