import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = 'You are an expert entrepreneur coach. Give concise, actionable advice in 2-3 sentences max.';

export async function sendMessage(messages: { role: 'user' | 'assistant'; content: string }[]): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
  });
  return completion.choices[0]?.message?.content ?? '';
}
