const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const TEXT_MODEL = 'llama-3.3-70b-versatile';
const VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

const BASE_SYSTEM_PROMPT =
  'You are an expert entrepreneur and business coach. Give concise, actionable advice. Max 3 sentences per response. Focus on practical steps.';

function buildSystemPrompt(language?: string): string {
  const langInstructions: Record<string, string> = {
    de: 'Always respond in German (Deutsch).',
    es: 'Always respond in Spanish (Español).',
    fr: 'Always respond in French (Français).',
    pt: 'Always respond in Portuguese (Português).',
    en: '',
  };
  const langInstruction = language ? (langInstructions[language] ?? '') : '';
  return langInstruction ? `${BASE_SYSTEM_PROMPT} ${langInstruction}` : BASE_SYSTEM_PROMPT;
}

export type GroqMessage = {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
};

function buildApiMessages(messages: GroqMessage[]) {
  return messages.map((msg) => {
    if (msg.imageUrl) {
      return {
        role: msg.role,
        content: [
          { type: 'image_url', image_url: { url: msg.imageUrl } },
          { type: 'text', text: msg.content || 'What do you see in this image? Give me entrepreneurial advice based on it.' },
        ],
      };
    }
    return { role: msg.role, content: msg.content };
  });
}

export async function sendMessage(messages: GroqMessage[], language?: string): Promise<string> {
  if (!GROQ_API_KEY) {
    console.error('[Groq] EXPO_PUBLIC_GROQ_API_KEY is not set');
    throw new Error('Groq API key not configured');
  }

  const hasImage = messages.some((m) => m.imageUrl);
  const model = hasImage ? VISION_MODEL : TEXT_MODEL;

  const body = JSON.stringify({
    model,
    messages: [{ role: 'system', content: buildSystemPrompt(language) }, ...buildApiMessages(messages)],
    max_tokens: 500,
  });

  console.log('[Groq] model:', model, '| messages:', messages.length, '| hasImage:', hasImage);

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
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
