// Using Groq API - 100% free, no credit card needed
// Get your free key at: https://console.groq.com
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string | Array<{ type: string; [key: string]: unknown }>;
}

export async function callClaude({
  messages,
  system = '',
  maxTokens = 2000,
}: {
  messages: ClaudeMessage[];
  system?: string;
  maxTokens?: number;
}): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('Please add your Groq API key to the .env file as VITE_GROQ_API_KEY');
  }

  // Convert messages - Groq uses OpenAI format
  const groqMessages: Array<{ role: string; content: string }> = [];

  if (system) {
    groqMessages.push({ role: 'system', content: system });
  }

  for (const m of messages) {
    if (typeof m.content === 'string') {
      groqMessages.push({ role: m.role, content: m.content });
    } else {
      // For image messages, extract just the text (Groq free tier = text only)
      const textParts = m.content
        .filter((c: Record<string, unknown>) => c.type === 'text')
        .map((c: Record<string, unknown>) => c.text as string)
        .join(' ');
      const hasImage = m.content.some((c: Record<string, unknown>) => c.type === 'image');
      const content = hasImage
        ? `[User uploaded a medicine/prescription image] ${textParts || 'Please analyze this image and provide detailed information.'}`
        : textParts;
      groqMessages.push({ role: m.role, content });
    }
  }

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: groqMessages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const e = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(e?.error?.message || `API Error ${res.status}`);
  }

  const data = await res.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  return data.choices?.[0]?.message?.content ?? '';
}

export function safeParseJSON<T>(text: string): T | null {
  try {
    return JSON.parse(text.replace(/```json\n?|```\n?/g, '').trim()) as T;
  } catch {
    return null;
  }
}

export async function fileToBase64(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve({ base64: result.split(',')[1], mediaType: file.type });
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}
