import React, { useState } from 'react';
import { 
  Bot, Send, Sparkles, ShieldCheck, User, 
  HelpCircle, RefreshCw, CheckCircle2, FileText, ChevronRight 
} from 'lucide-react';

export const AICareerCopilotPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; grounded?: boolean }>>([
    {
      role: 'assistant',
      content: "Hello Alex! I am your AI Career Copilot, strictly bound by Anti-Gravity Grounding rules. I only make claims backed by your verified resume text and active job descriptions. How can I assist your career progression today?",
      grounded: true
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    "Am I a match for this job?",
    "What skills am I missing?",
    "Which projects are relevant?",
    "How should I improve my resume?",
    "What should I learn next?",
    "Give me interview questions.",
    "Explain this job description."
  ];

  const handleSend = async (queryText?: string) => {
    const query = queryText || input;
    if (!query.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: query }];
    setMessages(newMessages);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.response,
          grounded: true
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: "Encountered a connection issue. Please ensure the backend is running.",
          grounded: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 bg-purple-950/70 px-2.5 py-0.5 rounded-full border border-purple-800 mb-2">
            <Bot className="w-3.5 h-3.5" /> Multi-Agent AI Architecture
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            AI Career Copilot
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time conversational career intelligence grounded in stored candidate evidence.
          </p>
        </div>

        {/* Candidate Context Pill */}
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-2.5 self-start sm:self-auto">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
            AR
          </div>
          <div>
            <div className="font-bold text-white">Alex Rivera</div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Resume Grounded (3 Yrs)
            </div>
          </div>
        </div>
      </div>

      {/* Preset Query Chips */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-400" /> Grounded Career Queries
        </div>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span>{q}</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
              }`}
            >
              <div className="whitespace-pre-line">{m.content}</div>

              {m.role === 'assistant' && m.grounded && (
                <div className="pt-2 border-t border-slate-900 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Anti-Gravity Verified • Grounded in stored resume evidence</span>
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-xs text-slate-400">
            <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <span>Consulting Anti-Gravity Grounding Engine...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your resume, job fit, skill gaps, or interview strategy..."
          className="flex-1 py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500 transition"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow"
        >
          <span>Ask</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
