import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Loader2, Lightbulb, FileText, Globe, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Stepper from '../components/Stepper';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  { icon: Globe, text: 'What export markets are best for shea butter from Ghana?', label: 'Market Research' },
  { icon: FileText, text: 'Draft a brief export compliance checklist for agricultural products.', label: 'Compliance' },
  { icon: Package, text: 'What HS code should I use for dried cocoa beans?', label: 'HS Codes' },
  { icon: Lightbulb, text: 'Explain Incoterms CIF vs FOB for a first-time exporter.', label: 'Trade Terms' },
];

const SYSTEM_PROMPT = `You are Lexi, ExpoGen's AI export intelligence assistant. ExpoGen is a platform that helps African businesses — especially Ghanaian exporters — manage export compliance, documentation, and market readiness.

You are knowledgeable about:
- International trade and export compliance
- HS codes and product classification
- Incoterms (FOB, CIF, EXW, DDP, CFR, etc.)
- Export documentation (Certificate of Origin, Commercial Invoice, Packing List, etc.)
- African export markets, AFCFTA, and regional trade
- Customs procedures and port processes (especially Tema Port, Ghana)
- Market access and phytosanitary requirements

Be concise, practical, and encouraging. Format responses clearly with short paragraphs. Use bullet points for lists. When relevant, remind users that ExpoGen can auto-generate their export documents. Keep responses focused and helpful for SME exporters.`;

export default function AIGeneratorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hello! I'm **Lexi**, your ExpoGen AI export assistant. I can help you with market research, HS codes, Incoterms, compliance questions, and trade documentation strategy. What export challenge can I help you navigate today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatContent = (text: string) => {
    // Simple markdown-like rendering
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc list-inside space-y-1 my-2 text-gray-600 text-sm">$1</ul>')
      .replace(/\n\n/g, '</p><p class="mb-2">')
      .replace(/\n/g, '<br/>');
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const replyText =
        data?.content?.find((b: { type: string }) => b.type === 'text')?.text ||
        "I'm sorry, I couldn't generate a response. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: replyText,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error('AI request failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please check your connection and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 flex flex-col h-full">
        <Stepper currentStep={5} />

        {/* Header */}
        <div>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">AI Assistant</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles size={22} className="text-teal-500" />
            Lexi — Export Intelligence
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ask Lexi anything about export compliance, trade documentation, market research, or HS codes.
          </p>
        </div>

        {/* Chat Window */}
        <div className="flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden" style={{ minHeight: '520px' }}>
          {/* Chat header bar */}
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-teal-600 to-teal-500">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">Lexi</p>
              <p className="text-[10px] text-teal-100 mt-0.5">ExpoGen AI • Export Intelligence</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-xs text-teal-100">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ maxHeight: '400px' }}>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={14} className="text-teal-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-teal-600 text-white rounded-tr-sm'
                        : 'bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: `<p class="mb-2">${formatContent(msg.content)}</p>` }}
                      />
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                      <User size={14} className="text-gray-600" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start"
              >
                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-teal-600" />
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-teal-500" />
                  <span className="text-xs text-gray-400">Lexi is thinking…</span>
                </div>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggestions (only when just the welcome message exists) */}
          {messages.length === 1 && (
            <div className="px-5 pb-3 grid grid-cols-2 gap-2">
              {SUGGESTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.text}
                    onClick={() => sendMessage(s.text)}
                    className="flex items-center gap-2 text-left text-xs text-gray-600 bg-gray-50 hover:bg-teal-50 hover:text-teal-700 border border-gray-100 hover:border-teal-200 rounded-xl px-3 py-2.5 transition-all"
                  >
                    <Icon size={13} className="text-teal-500 shrink-0" />
                    <span className="line-clamp-2 leading-relaxed">{s.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-teal-400/30 focus-within:border-teal-400 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Lexi about exports, HS codes, compliance…"
                rows={1}
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 resize-none outline-none leading-relaxed max-h-28"
                style={{ scrollbarWidth: 'none' }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
              >
                <Send size={14} className="text-white" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 text-center">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}