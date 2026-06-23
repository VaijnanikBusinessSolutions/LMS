import React, { useState, useEffect } from 'react';
import {
  Brain, Sparkles, AlertTriangle, MessageSquare,
  Send, Loader2, ShieldCheck
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/lms';

// ==========================================
// 1. DEFINE TYPES (INTERFACES)
// ==========================================

interface Recommendation {
  id: number;
  title: string;
  reason: string;
  priority: string;
  match_score: number;
}

interface RiskData {
  risk_score: number;
  risk_level: string;
  factors: string[];
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

const AIFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // FIX: Provide the Type to useState so it's not 'never[]'
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [riskData, setRiskData] = useState<RiskData | null>(null);

  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'ai', text: "Hi! I'm your Free AI Assistant. How can I help?" }
  ]);
  const [loading, setLoading] = useState(false);

  // Helper to get token
  const getAuthHeaders = (): Record<string, string> => {
    try {
      const authData = localStorage.getItem("auth");
      const token = authData ? JSON.parse(authData).accessToken : "";
      return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    } catch (e) {
      return { 'Content-Type': 'application/json' };
    }
  };

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // try {
      //   const [recRes, riskRes] = await Promise.all([
      //     fetch(`${API_BASE}/ai/recommendations/`, { headers: getAuthHeaders() }),
      //     fetch(`${API_BASE}/ai/risk_analysis/`, { headers: getAuthHeaders() })
      //   ]);

      //   if (recRes.ok) setRecommendations(await recRes.json());
      //   if (riskRes.ok) setRiskData(await riskRes.json());
      // } catch (e) {
      //   console.error(e);
      // } finally {
      //   setLoading(false);
      // }
      try {
        const [recRes, riskRes] = await Promise.all([
          fetch(`${API_BASE}/ai/recommendations/`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE}/ai/risk_analysis/`, { headers: getAuthHeaders() })
        ]);

        if (recRes.ok) {
          const data = await recRes.json();
          setRecommendations(Array.isArray(data) ? data : []);
        }

        if (riskRes.ok) {
          const data = await riskRes.json();
          // Ensure factors exists so .length doesn't fail later
          setRiskData({
            ...data,
            factors: data.factors || []
          });
        } else if (riskRes.status === 404) {
          console.warn("Risk analysis endpoint not found (404)");
          // Optional: set a default state so the UI stays pretty
        }
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Chat Handler
  // FIX: Explicitly type the event 'e' as React.FormEvent
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 p-8 font-sans text-slate-900">

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/20">
          <Brain className="text-white w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            AI Control Center
          </h1>
          <p className="text-slate-500 font-medium">Free Statistical Intelligence & NLP</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* 1. RECOMMENDATIONS CARD */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border-2 border-slate-200 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-amber-500" />
            <h2 className="text-2xl font-black text-slate-800">Smart Recommendations</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-500" /></div>
          ) : recommendations.length === 0 ? (
            <p className="text-slate-400">No recommendations generated yet.</p>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:border-indigo-300 transition-all group">
                  <div className="flex justify-between items-start">
                    <div>
                      {/* FIX: Types are now recognized here */}
                      <h4 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">{rec.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{rec.reason}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${rec.priority === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {rec.match_score}% Match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. RISK ANALYSIS CARD */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border-2 border-slate-200 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="text-rose-500" />
            <h2 className="text-2xl font-black text-slate-800">Risk Analytics</h2>
          </div>

          {loading || !riskData ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-rose-500" /></div>
          ) : (
            <div className="text-center py-6">
              <div className="relative inline-block">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * riskData.risk_score) / 100}
                    className={`${riskData.risk_score > 50 ? 'text-rose-500' : 'text-emerald-500'} transition-all duration-1000`}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-4xl font-black text-slate-800">{riskData.risk_score}</span>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Risk Score</span>
                </div>
              </div>

              <div className="mt-6 text-left bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-2">Risk Factors Detected:</h4>
                {riskData?.factors && riskData.factors.length > 0 ? (
                  <ul className="space-y-2">
                    {riskData.factors.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-rose-600 font-medium">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> {f}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-emerald-600 text-sm font-bold flex items-center gap-2">
                    <ShieldCheck size={16} /> No significant risks found. Great job!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. AI CHATBOT CARD (Full Width) */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border-2 border-slate-200 shadow-xl h-[500px] flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="text-indigo-500" />
            <h2 className="text-2xl font-black text-slate-800">LMS Assistant</h2>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-4 pr-2">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-4 rounded-2xl text-sm font-medium ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-700 rounded-bl-none'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleChat} className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about your courses, progress, or certificates..."
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-4 pl-6 pr-14 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-slate-700"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AIFeatures;