import React, { useState, useEffect, useRef } from 'react';
import api from '../api';

export default function ChatPanel({ onOpenCitation, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am FinancePilot AI, your reconciliation-first financial copilot. Ask me questions like:\n- *What is my current cash runway and burn rate?*\n- *Who owes me the most money?*\n- *Are there any unusual expenses?*\n- *Which transactions need review?*",
      reasoning: "Initialized assistant with default suggestions.",
      citations: []
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyError, setKeyError] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: text }]);
    if (!textToSend) setInput("");
    
    setLoading(true);
    setKeyError(false);

    try {
      const res = await api.sendChatMessage(text);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: res.answer,
        reasoning: res.reasoning,
        citations: res.citations
      }]);
    } catch (err) {
      const errMsg = err.message || "Failed to communicate with AI backend.";
      
      if (errMsg.includes("Groq API Key not found") || errMsg.includes("API key")) {
        setKeyError(true);
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "⚠️ **Groq API Key Missing**\n\nThe AI Copilot needs a Groq API Key to orchestrate tool calls.\n\n**To resolve this:**\n1. Paste your Groq API key in the `.env` file at the root of your project:\n   `GROQ_API_KEY=gsk_your_key`\n2. Restart your FastAPI backend server.",
          reasoning: "API Key Validation Check Failed.",
          citations: []
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: `⚠️ **Error**: ${errMsg}`,
          reasoning: "Communication failure.",
          citations: []
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const parseCitations = (text) => {
    if (!text) return "";
    const cleanText = text.replace(/<reasoning>.*?<\/reasoning>\n?/gs, "");
    const regex = /(\[(?:Source:\s*)?(INV-\d+|TXN-\d+|account\.json)\])/g;
    const parts = cleanText.split(regex);
    
    return parts.map((part, i) => {
      const match = part.match(/\[(?:Source:\s*)?(INV-\d+|TXN-\d+|account\.json)\]/);
      if (match) {
        const id = match[1];
        return (
          <button
            key={i}
            onClick={() => onOpenCitation(id)}
            className="inline-flex items-center px-1.5 py-0.5 mx-0.5 bg-secondary-container/30 hover:bg-secondary-container/50 text-secondary font-bold font-mono rounded text-[10px] border border-secondary-container/50 uppercase transition-all"
          >
            {id}
          </button>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-full w-full bg-white select-none">
      
      {/* Docked Header */}
      <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-background shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary animate-pulse text-md">smart_toy</span>
          <div>
            <h3 className="text-xs font-bold font-display text-primary">Ask FinancePilot</h3>
            <p className="text-[10px] text-on-surface-variant/80">Traceable Financial Auditor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
            keyError ? 'bg-error-container/30 text-error' : 'bg-secondary-container/30 text-secondary'
          }`}>
            {keyError ? 'API Key Required' : 'Groq Llama 3.3'}
          </div>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors p-0.5 rounded hover:bg-slate-200"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <div key={i} className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1.5 max-w-full`}>
              
              {/* Reasoning Accordion */}
              {!isUser && m.reasoning && (
                <details className="w-full text-[11px] bg-background border border-outline-variant/60 rounded-lg overflow-hidden group">
                  <summary className="px-3 py-1.5 text-on-surface-variant/80 hover:text-primary font-semibold cursor-pointer select-none list-none flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-secondary">psychology</span>
                      Reasoning Trace
                    </span>
                    <span className="material-symbols-outlined text-xs group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="px-3 pb-2 pt-1 border-t border-outline-variant/40 font-mono text-[10px] text-on-surface-variant bg-background/50 leading-relaxed whitespace-pre-line">
                    {m.reasoning}
                  </div>
                </details>
              )}

              {/* Message Bubble */}
              <div className={`p-3 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                isUser 
                  ? "bg-primary text-white rounded-br-none" 
                  : "bg-background text-on-surface rounded-bl-none border border-outline-variant/80"
              }`}>
                {isUser ? m.content : (
                  <div className="whitespace-pre-line">
                    {parseCitations(m.content)}
                  </div>
                )}
              </div>

              {/* Citations list footer */}
              {!isUser && m.citations && m.citations.length > 0 && (
                <div className="flex flex-wrap gap-1 px-1">
                  <span className="text-[9px] text-on-surface-variant font-semibold mr-1">Cited Records:</span>
                  {m.citations.map(c => (
                    <button
                      key={c}
                      onClick={() => onOpenCitation(c)}
                      className="text-[9px] font-bold font-mono text-secondary hover:underline uppercase"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

            </div>
          );
        })}
        {loading && (
          <div className="flex items-center gap-2 p-3 bg-background text-on-surface rounded-xl rounded-bl-none max-w-[50%] border border-outline-variant/80">
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></span>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Suggested Prompts */}
      <div className="p-2 border-t border-outline-variant bg-background/30 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0">
        {[
          { label: "Runway", text: "What is my current cash runway and monthly burn?" },
          { label: "Owed Money", text: "Who owes us the most money, and how much do they owe?" },
          { label: "Anomalies", text: "Are there any unusual expense transactions or anomalies?" },
          { label: "Pending Reviews", text: "Show me the transactions pending manual review." }
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(btn.text)}
            className="px-2.5 py-1 bg-white hover:bg-surface-container text-on-surface-variant hover:text-secondary border border-outline-variant rounded-lg text-[10px] font-semibold transition-all shrink-0"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Chat Form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
        className="p-3 border-t border-outline-variant bg-white flex gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about runway, debtors, anomalies..."
          className="flex-1 bg-background border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-secondary transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-3.5 bg-secondary hover:bg-on-secondary-container disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg transition-all flex items-center justify-center"
          disabled={loading}
        >
          <span className="material-symbols-outlined text-[16px]">send</span>
        </button>
      </form>

    </div>
  );
}
