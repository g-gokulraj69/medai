import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Paperclip, X, Activity, User, RefreshCw, AlertCircle } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { callClaude, fileToBase64, ClaudeMessage } from '../lib/claudeApi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  imageBase64?: string;
  imageType?: string;
  error?: boolean;
  timestamp: Date;
}

const SUGGESTED = [
  'What are the side effects of Ibuprofen?',
  'Can I take Metformin with alcohol?',
  'What is Paracetamol used for?',
  'How does Omeprazole work?',
  'What medicines interact with Warfarin?',
  'Is it safe to take Melatonin every night?',
];

const QUICK_TOPICS = ['Dosage Guide', 'Side Effects', 'Drug Interactions', 'Pregnancy Safety', 'Storage Info', 'Generic Alternatives'];

const SYSTEM = `You are MedAI Health Assistant, a knowledgeable, friendly, compassionate AI specializing in medicines and prescriptions. Help users understand medicine uses, dosage, side effects, interactions, prescriptions, and safe medication practices. Speak clearly and simply. Use bullet points and markdown for complex info. Respond in the SAME LANGUAGE the user writes in — if they write Tamil, respond in Tamil; Hindi, respond in Hindi; etc. When analyzing images describe thoroughly. Always add medical disclaimers. For emergencies say call 102 (India). Never diagnose diseases. Be warm and supportive.`;

const GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  content: `Hello! I'm MedAI Health Assistant 👋

I can help you with:
- 💊 Complete medicine information
- 📋 Prescription explanation  
- ⚠️ Drug interaction checks
- 🌡️ Dosage guidance and timing
- 🌿 Food and drug interactions
- 🤱 Pregnancy and breastfeeding safety
- 📸 Medicine/prescription image analysis

Ask me anything! I respond in English, Tamil, Hindi, Telugu, and more 🌐`,
  timestamp: new Date(),
};

function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${isUser ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white' : 'bg-gradient-to-br from-slate-700 to-slate-600 border border-white/10 text-cyan-400'}`}>
        {isUser ? <User size={14} /> : 'M'}
      </div>
      <div className={`max-w-[80%] space-y-2 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {msg.image && <img src={msg.image} alt="Attachment" className="max-w-xs rounded-xl border border-white/10 object-cover" />}
        <div className={`px-4 py-3 rounded-2xl text-sm ${isUser ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm' : msg.error ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-tl-sm' : 'bg-slate-800/80 border border-white/5 rounded-tl-sm'}`}>
          {isUser || msg.error ? (
            <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
          ) : (
            <MarkdownRenderer content={msg.content} />
          )}
        </div>
        <span className="text-xs text-slate-600 px-1">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </motion.div>
  );
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null); setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content && !imageFile) return;
    setShowQuickReplies(false);

    let base64: string | undefined, mediaType: string | undefined;
    if (imageFile) {
      const r = await fileToBase64(imageFile);
      base64 = r.base64; mediaType = r.mediaType;
    }

    const userMsg: Message = {
      id: Date.now().toString(), role: 'user',
      content: content || '(Analyze this image)',
      image: imagePreview ?? undefined,
      imageBase64: base64, imageType: mediaType,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput(''); clearImage(); setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const apiHistory: ClaudeMessage[] = newMessages.slice(-20).map(m => {
        if (m.role === 'assistant') return { role: 'assistant' as const, content: m.content };
        if (m.imageBase64 && m.imageType) return {
          role: 'user' as const,
          content: [
            { type: 'image', source: { type: 'base64', media_type: m.imageType, data: m.imageBase64 } },
            { type: 'text', text: m.content || 'Analyze this image' },
          ],
        };
        return { role: 'user' as const, content: m.content };
      });

      const reply = await callClaude({ system: SYSTEM, messages: apiHistory, maxTokens: 1500 });
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: reply, timestamp: new Date() }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: e instanceof Error ? e.message : 'Something went wrong.', error: true, timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="bg-slate-950 text-white flex" style={{ height: 'calc(100vh - 64px)', marginTop: '64px' }}>
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-slate-900/40 p-4">
        <button onClick={() => { setMessages([GREETING]); setShowQuickReplies(true); }}
          className="w-full btn-primary flex items-center justify-center gap-2 mb-4">
          <MessageSquare size={16} /> New Chat
        </button>
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2 px-1">Quick Topics</div>
        <div className="space-y-1">
          {QUICK_TOPICS.map(topic => (
            <button key={topic} onClick={() => send(topic)}
              className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              {topic}
            </button>
          ))}
        </div>
        <div className="mt-auto p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-300">💡 You can also send a photo of any medicine or prescription</p>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">MedAI Health Assistant</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-xs text-slate-500">Powered by Claude AI · Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
          <AnimatePresence initial={false}>
            {messages.map(msg => <ChatBubble key={msg.id} msg={msg} />)}
          </AnimatePresence>

          {/* Quick replies */}
          {showQuickReplies && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-wrap gap-2 mt-2">
              {SUGGESTED.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="text-xs px-3 py-2 rounded-xl bg-slate-800/60 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all">
                  {s}
                </button>
              ))}
            </motion.div>
          )}

          {loading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-600 border border-white/10 flex items-center justify-center shrink-0 text-cyan-400 font-bold text-xs">M</div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-800/80 border border-white/5 flex items-center gap-2">
                <RefreshCw size={14} className="text-slate-500 animate-spin" />
                <span className="text-slate-500 text-sm">Thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="px-4 py-3 border-t border-white/5 bg-slate-900/40">
          <AnimatePresence>
            {imagePreview && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                  <img src={imagePreview} alt="Attachment" className="w-full h-full object-cover" />
                  <button onClick={clearImage} className="absolute top-0.5 right-0.5 w-5 h-5 bg-slate-900/80 rounded-md flex items-center justify-center hover:bg-red-500/80 transition-colors">
                    <X size={11} className="text-white" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2 items-end">
            <button onClick={() => fileRef.current?.click()}
              className="p-2.5 rounded-xl bg-slate-800/60 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors shrink-0">
              <Paperclip size={18} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />

            <textarea ref={textareaRef} value={input} onChange={handleTextareaChange} onKeyDown={handleKeyDown}
              placeholder="Ask about medicines, side effects, interactions..." rows={1}
              className="flex-1 px-4 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/40 resize-none transition-colors text-sm leading-relaxed"
              style={{ minHeight: '46px' }} />

            <button onClick={() => send()} disabled={loading || (!input.trim() && !imageFile)}
              className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-lg shadow-blue-500/20">
              <Send size={18} />
            </button>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <AlertCircle size={11} className="text-slate-700" />
            <p className="text-xs text-slate-700">Educational only · Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </div>
  );
}
