import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, AlertTriangle } from 'lucide-react';

// Reuse your interfaces
interface ChatMessage { role: 'user' | 'ai'; text: string; }
const API_BASE = 'http://127.0.0.1:8000/lms';

const FloatingAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'ai', text: "Hi! I'm your LMS Assistant. How can I help you today?" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const getAuthHeaders = (): Record<string, string> => {
    try {
      const authData = localStorage.getItem("auth");
      const token = authData ? JSON.parse(authData).accessToken : "";
      return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    } catch (e) { return { 'Content-Type': 'application/json' }; }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    try {
      const res = await fetch(`${API_BASE}/ai/chat/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ query: userMsg })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "Sorry, I'm offline right now." }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* 1. CHAT WINDOW */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 origin-bottom-right">
          
          {/* Header with your Glow style */}
          <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <Bot className="text-white" size={24} />
              <div>
                <h3 className="text-white font-bold text-sm">LMS AI Assistant</h3>
                <span className="text-[10px] text-indigo-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f172a] custom-scrollbar">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md' 
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleChat} className="p-4 bg-slate-900 border-t border-slate-800">
            <div className="relative">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500">
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. FLOATING BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-rose-500 rotate-90' : 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-indigo-500/40'
        }`}
        style={{ boxShadow: isOpen ? '0 0 20px rgba(244, 63, 94, 0.4)' : '0 0 25px rgba(99, 102, 241, 0.5)' }}
      >
        {isOpen ? <X className="text-white" size={28} /> : <Bot className="text-white" size={28} />}
        
        {/* Subtle Ring Glow */}
        <span className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-20 pointer-events-none"></span>
      </button>
    </div>
  );
};

export default FloatingAI;