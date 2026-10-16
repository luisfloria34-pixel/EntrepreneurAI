import { supabase } from './supabase';

export type GroqMessage = {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
};

export async function sendMessage(messages: GroqMessage[], language?: string): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Please sign in to use the AI coach');

  const { data, error } = await supabase.functions.invoke('ai-coach', {
    body: { messages: messages.slice(-30), language },
  });

  if (error) {
    const response = (error as any).context as Response | undefined;
    if (response?.status === 429) throw new Error('DAILY_LIMIT');
    throw new Error('AI service is temporarily unavailable');
  }
  if (!data || typeof data.reply !== 'string') {
    throw new Error('Invalid AI response');
  }
  return data.reply;
}
