// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import {
//     Send, Plus, MessageSquare, User, Menu,
//     Sparkles, FileType, Loader2,
//     Library, PlayCircle, Download, Clock, FileText
// } from 'lucide-react';

// // ─── TYPES ────────────────────────────────────────────────────────────────────
// interface Message {
//     sender: 'user' | 'ai';
//     text: string;
//     type?: 'text' | 'ppt_success';
// }
// interface ChatSession    { id: number; title: string; }
// interface GeneratedMedia { id: number; title: string; url: string; type: 'video' | 'ppt'; created_at: string; prompt?: string; }
// type GenerationMode = 'chat' | 'ppt';

// // ─── FALLING BLUE DOTS ────────────────────────────────────────────────────────
// const FallingDots: React.FC = () => {
//     const ref = useRef<HTMLCanvasElement>(null);
//     useEffect(() => {
//         const canvas = ref.current; if (!canvas) return;
//         const ctx = canvas.getContext('2d')!;
//         let raf: number;
//         interface Dot { x: number; y: number; r: number; vy: number; alpha: number; phase: number; }
//         const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
//         resize(); window.addEventListener('resize', resize);
//         const dots: Dot[] = Array.from({ length: 65 }, () => ({
//             x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
//             r: Math.random() * 4 + 1.5, vy: Math.random() * 0.9 + 0.3,
//             alpha: Math.random() * 0.18 + 0.05, phase: Math.random() * Math.PI * 2,
//         }));
//         const tick = () => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             for (const d of dots) {
//                 d.phase += 0.016; d.y += d.vy; d.x += Math.sin(d.phase) * 0.4;
//                 if (d.y > canvas.height + 10) { d.y = -10; d.x = Math.random() * canvas.width; }
//                 const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 3.5);
//                 g.addColorStop(0,   `rgba(59,130,246,${d.alpha})`);
//                 g.addColorStop(0.5, `rgba(59,130,246,${d.alpha * 0.4})`);
//                 g.addColorStop(1,   `rgba(59,130,246,0)`);
//                 ctx.beginPath(); ctx.arc(d.x, d.y, d.r * 3.5, 0, Math.PI * 2);
//                 ctx.fillStyle = g; ctx.fill();
//                 ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
//                 ctx.fillStyle = `rgba(37,99,235,${Math.min(d.alpha * 3, 0.5)})`; ctx.fill();
//             }
//             raf = requestAnimationFrame(tick);
//         };
//         tick();
//         return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
//     }, []);
//     return <canvas ref={ref} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', background:'#f8faff' }} />;
// };

// // ─── MEDIA CARD ───────────────────────────────────────────────────────────────
// const MediaCard: React.FC<{ item: GeneratedMedia }> = ({ item }) => {
//     const [hov, setHov] = useState(false);
//     return (
//         <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
//             background: '#fff', borderRadius: 16, overflow: 'hidden',
//             border: `1.5px solid ${hov ? '#93c5fd' : '#e0eaff'}`,
//             boxShadow: hov ? '0 16px 40px rgba(37,99,235,0.14)' : '0 2px 12px rgba(37,99,235,0.06)',
//             transform: hov ? 'translateY(-4px)' : 'none',
//             transition: 'all 0.28s cubic-bezier(.4,0,.2,1)',
//         }}>
//             <div style={{ aspectRatio:'16/9', background:'linear-gradient(135deg,#eff6ff,#dbeafe)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
//                 {item.type === 'video' ? (
//                     <video src={item.url} style={{ width:'100%', height:'100%', objectFit:'cover' }}
//                         onMouseOver={e => e.currentTarget.play()}
//                         onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
//                         muted loop />
//                 ) : (
//                     <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
//                         <div style={{ width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#6366f1,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 20px rgba(99,102,241,0.3)' }}>
//                             <FileType size={26} color="#fff" />
//                         </div>
//                         <span style={{ fontSize:10, fontWeight:800, color:'#a5b4fc', letterSpacing:'0.16em', textTransform:'uppercase' }}>PowerPoint</span>
//                     </div>
//                 )}
//                 {hov && (
//                     <div style={{ position:'absolute', inset:0, background:'rgba(17,40,95,0.55)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
//                         <a href={item.url} target="_blank" rel="noreferrer" style={{
//                             display:'inline-flex', alignItems:'center', gap:8, padding:'11px 24px',
//                             borderRadius:100, textDecoration:'none', color:'#fff', fontWeight:700, fontSize:13, fontFamily:'inherit',
//                             background: item.type === 'video' ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
//                             boxShadow:'0 8px 24px rgba(0,0,0,0.25)',
//                         }}>
//                             {item.type === 'video' ? <><PlayCircle size={15} color="#fff" />Watch Video</> : <><Download size={15} color="#fff" />Download</>}
//                         </a>
//                     </div>
//                 )}
//                 <div style={{ position:'absolute', top:10, right:10, background: item.type === 'video' ? 'rgba(37,99,235,0.9)' : 'rgba(99,102,241,0.9)', color:'#fff', fontSize:9, fontWeight:800, letterSpacing:'0.14em', textTransform:'uppercase', padding:'4px 10px', borderRadius:100, backdropFilter:'blur(4px)' }}>
//                     {item.type}
//                 </div>
//             </div>
//             <div style={{ padding:'14px 16px 16px' }}>
//                 <p style={{ fontSize:14, fontWeight:700, color:'#0f1d3a', marginBottom:10, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', lineHeight:1.4 }}>{item.title}</p>
//                 <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
//                     <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#93c5fd', fontWeight:600 }}>
//                         <Clock size={11} color="#93c5fd" />{new Date(item.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
//                     </span>
//                     <span style={{ fontSize:10, fontWeight:800, color: item.type === 'video' ? '#2563eb' : '#6366f1', background: item.type === 'video' ? '#eff6ff' : '#eef2ff', padding:'3px 10px', borderRadius:100, textTransform:'uppercase', letterSpacing:'0.1em' }}>{item.type}</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// const AiAssistant: React.FC = () => {
//     const [sessions, setSessions]                   = useState<ChatSession[]>([]);
//     const [currentSessionId, setCurrentSessionId]   = useState<number | null>(null);
//     const [messages, setMessages]                   = useState<Message[]>([]);
//     const [myMedia, setMyMedia]                     = useState<GeneratedMedia[]>([]);
//     const [input, setInput]                         = useState<string>('');
//     const [loading, setLoading]                     = useState<boolean>(false);
//     const [loadingText, setLoadingText]             = useState<string>('');
//     const [activeTab, setActiveTab]                 = useState<'chat' | 'library'>('chat');
//     const [isSidebarOpen, setIsSidebarOpen]         = useState(true);
//     const [mode, setMode]                           = useState<GenerationMode>('chat');

//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const inputRef       = useRef<HTMLInputElement>(null);
//     const token = localStorage.getItem('access_token');

//     useEffect(() => { fetchHistory(); fetchLibrary(); }, []);
//     useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

//     const fetchHistory = async () => {
//         try {
//             const res = await axios.get('http://127.0.0.1:8000/lms/ai/history/', { headers: { Authorization: `Bearer ${token}` } });
//             setSessions(res.data);
//         } catch (err) { console.error('History fetch failed', err); }
//     };

//     const fetchLibrary = async () => {
//         try {
//             const res = await axios.get('http://127.0.0.1:8000/lms/ai/my_media/', { headers: { Authorization: `Bearer ${token}` } });
//             setMyMedia(res.data);
//         } catch (err) { console.error('Library fetch failed', err); }
//     };

//     // ─── NEW: Load specific chat session when clicked in sidebar ───
//     const loadSession = async (sessionId: number) => {
//         if (loading) return;
//         setCurrentSessionId(sessionId);
//         setActiveTab('chat');
//         setMode('chat');
//         setLoading(true);
//         setLoadingText('Loading conversation...');
//         setMessages([]); // Clear current view

//         try {
//             const res = await axios.get(`http://127.0.0.1:8000/lms/ai/${sessionId}/messages/`, { 
//                 headers: { Authorization: `Bearer ${token}` } 
//             });
//             // Map backend structure to frontend structure
//             const historyMessages: Message[] = res.data.map((m: any) => ({
//                 sender: m.sender,
//                 text: m.text,
//                 type: 'text'
//             }));
//             setMessages(historyMessages);
//         } catch (err) {
//             console.error('Failed to load session messages', err);
//         } finally {
//             setLoading(false);
//             setLoadingText('');
//         }
//     };

//     const handleSend = async () => {
//         if (!input.trim() || loading) return;
//         const prompt = input;
//         setInput(''); setLoading(true);
//         setMessages(prev => [...prev, { sender:'user', text:prompt }]);
//         try {
//             if (mode === 'chat') {
//                 setLoadingText('AI is thinking…');
//                 const res = await axios.post('http://127.0.0.1:8000/lms/ai/chat/',
//                     { query: prompt, session_id: currentSessionId },
//                     { headers: { Authorization: `Bearer ${token}` } });
                
//                 setMessages(prev => [...prev, { sender:'ai', text:res.data.response, type:'text' }]);
                
//                 // If it was a new session, update the ID and refresh the sidebar list
//                 if (!currentSessionId) { 
//                     setCurrentSessionId(res.data.session_id); 
//                     await fetchHistory(); 
//                 }
//             } else if (mode === 'ppt') {
//                 setLoadingText('Generating slides & creating PPT…');
//                 const res = await axios.post('http://127.0.0.1:8000/lms/ai/generate_ppt/',
//                     { content: prompt },
//                     { headers: { Authorization: `Bearer ${token}` }, responseType:'blob' });
//                 const url = window.URL.createObjectURL(new Blob([res.data]));
//                 const a = document.createElement('a'); a.href = url; a.setAttribute('download', 'Training_Module.pptx');
//                 document.body.appendChild(a); a.click(); document.body.removeChild(a);
//                 setMessages(prev => [...prev, { sender:'ai', text:`✅ **Presentation Ready!** Your PowerPoint for *"${prompt}"* has been downloaded.`, type:'ppt_success' }]);
//                 await fetchLibrary();
//             }
//         } catch (err) {
//             console.error(err);
//             setMessages(prev => [...prev, { sender:'ai', text:'❌ **Error:** Could not generate content. Please check your connection.', type:'text' }]);
//         } finally { setLoading(false); setLoadingText(''); }
//     };

//     const accent = mode === 'ppt' ? '#6366f1' : '#2563eb';
//     const placeholder = mode === 'chat' ? 'Ask anything about training…' : 'Topic or outline for your slides…';

//     return (
//         <>
//         <style>{`
//             @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
//             *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
//             html, body { height:100%; }
//             body { font-family:'Outfit',sans-serif; background:#f8faff; color:#0f1d3a; }
//             ::-webkit-scrollbar       { width:5px; }
//             ::-webkit-scrollbar-track { background:transparent; }
//             ::-webkit-scrollbar-thumb { background:#c7d9ff; border-radius:10px; }
//             @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
//             @keyframes slideUp { from{opacity:0;transform:translateY(16px) scale(.97)} to{opacity:1;transform:none} }
//             @keyframes bobble  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
//             @keyframes spin    { to{transform:rotate(360deg)} }
//             @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.9)} }
//             @keyframes dotup   { 0%,100%{transform:translateY(0);opacity:.3} 50%{transform:translateY(-6px);opacity:1} }
//             .msg-in { animation:slideUp .36s cubic-bezier(.34,1.56,.64,1) both; }
//             .md-ai p        { font-size:14px; line-height:1.8; color:#1e3a5f; margin-bottom:8px }
//             .md-ai p:last-child { margin-bottom:0 }
//             .md-ai strong   { font-weight:700; color:#1d4ed8 }
//             .md-ai em       { color:#3b82f6; font-style:italic }
//             .md-ai ul,.md-ai ol { padding-left:20px; margin:6px 0 }
//             .md-ai li       { font-size:14px; line-height:1.7; color:#1e3a5f; margin-bottom:3px }
//             .md-ai code     { font-family:'JetBrains Mono',monospace; font-size:12px; background:#eff6ff; color:#1d4ed8; padding:2px 6px; border-radius:5px }
//             .md-user p      { font-size:14px; line-height:1.8; color:#fff; margin-bottom:8px }
//             .md-user p:last-child { margin-bottom:0 }
//             .md-user strong { font-weight:700; color:#bfdbfe }
//             .md-user em     { color:rgba(255,255,255,.8) }
//             input::placeholder { color:#93c5fd; }
//             input:focus { outline:none; }
//             button { font-family:'Outfit',sans-serif; cursor:pointer; }
//         `}</style>

//         <FallingDots />

//         <div style={{ display:'flex', height:'100vh', overflow:'hidden', position:'relative', zIndex:1, fontFamily:"'Outfit',sans-serif" }}>

//             {/* ══════════ SIDEBAR ══════════ */}
//             <aside style={{
//                 width: isSidebarOpen ? 272 : 0, minWidth: isSidebarOpen ? 272 : 0,
//                 flexShrink:0, overflow:'hidden',
//                 background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)',
//                 borderRight:'1px solid #e0eaff',
//                 display:'flex', flexDirection:'column',
//                 transition:'all .32s cubic-bezier(.4,0,.2,1)',
//                 boxShadow: isSidebarOpen ? '4px 0 24px rgba(37,99,235,0.06)' : 'none',
//             }}>
//                 {/* Brand */}
//                 <div style={{ padding:'24px 20px 18px', borderBottom:'1px solid #e0eaff' }}>
//                     <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
//                         <div style={{
//                             width:42, height:42, borderRadius:14, flexShrink:0,
//                             background:'linear-gradient(135deg,#2563eb,#1e40af)',
//                             display:'flex', alignItems:'center', justifyContent:'center',
//                             boxShadow:'0 6px 20px rgba(37,99,235,0.4)',
//                             animation:'bobble 4s ease-in-out infinite',
//                         }}>
//                             <Sparkles size={20} color="#fff" />
//                         </div>
//                         <div>
//                             <div style={{ fontSize:17, fontWeight:800, color:'#0f1d3a', letterSpacing:'-0.02em', lineHeight:1.1 }}>LMS AI</div>
//                             <div style={{ fontSize:10, fontWeight:600, color:'#93c5fd', textTransform:'uppercase', letterSpacing:'0.14em', marginTop:3 }}>Training Studio</div>
//                         </div>
//                     </div>

//                     {/* New Session */}
//                     <button onClick={() => { setActiveTab('chat'); setCurrentSessionId(null); setMessages([]); setMode('chat'); }} style={{
//                         width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
//                         padding:'11px 0', borderRadius:12, border:'none',
//                         background:'linear-gradient(135deg,#2563eb,#1d4ed8)',
//                         color:'#fff', fontWeight:700, fontSize:14, marginBottom:8,
//                         boxShadow:'0 4px 16px rgba(37,99,235,0.35)', transition:'all .2s',
//                     }}
//                         onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(37,99,235,0.45)'; }}
//                         onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 16px rgba(37,99,235,0.35)'; }}
//                     >
//                         <Plus size={16} color="#fff" strokeWidth={2.5} />New Session
//                     </button>

//                     {/* Generate PPT */}
//                     <button onClick={() => { setActiveTab('chat'); setMode('ppt'); }} style={{
//                         width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
//                         padding:'10px 0', borderRadius:12, border:'1.5px solid #e0eaff',
//                         background: mode === 'ppt' && activeTab === 'chat' ? '#eef2ff' : '#fff',
//                         color: mode === 'ppt' && activeTab === 'chat' ? '#6366f1' : '#64748b',
//                         fontWeight:700, fontSize:14, marginBottom:8, transition:'all .2s',
//                     }}
//                         onMouseEnter={e => { e.currentTarget.style.background='#eef2ff'; e.currentTarget.style.color='#6366f1'; e.currentTarget.style.borderColor='#a5b4fc'; }}
//                         onMouseLeave={e => {
//                             e.currentTarget.style.background = mode === 'ppt' && activeTab === 'chat' ? '#eef2ff' : '#fff';
//                             e.currentTarget.style.color = mode === 'ppt' && activeTab === 'chat' ? '#6366f1' : '#64748b';
//                             e.currentTarget.style.borderColor = '#e0eaff';
//                         }}
//                     >
//                         <FileText size={15} color={mode === 'ppt' && activeTab === 'chat' ? '#6366f1' : '#a5b4fc'} />Generate PPT
//                     </button>

//                     {/* Media Library */}
//                     <button onClick={() => setActiveTab('library')} style={{
//                         width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
//                         padding:'10px 13px', borderRadius:11, border:`1.5px solid ${activeTab==='library' ? '#93c5fd' : 'transparent'}`,
//                         background: activeTab==='library' ? '#eff6ff' : 'transparent',
//                         transition:'all .18s',
//                     }}>
//                         <span style={{ display:'flex', alignItems:'center', gap:9, fontSize:14, fontWeight:600, color: activeTab==='library' ? '#2563eb' : '#64748b' }}>
//                             <Library size={15} color={activeTab==='library' ? '#2563eb' : '#93c5fd'} />Media Library
//                         </span>
//                         <span style={{ background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', fontSize:10, fontWeight:800, padding:'3px 9px', borderRadius:100, minWidth:24, textAlign:'center' }}>
//                             {myMedia.length}
//                         </span>
//                     </button>
//                 </div>

//                 {/* Chat History */}
//                 {activeTab === 'chat' && (
//                     <div style={{ flex:1, overflowY:'auto', padding:'16px 12px 12px' }}>
//                         <div style={{ fontSize:10, fontWeight:700, color:'#c7d9ff', textTransform:'uppercase', letterSpacing:'0.16em', padding:'0 8px', marginBottom:12 }}>Recent Sessions</div>
//                         {sessions.length === 0 && (
//                             <div style={{ textAlign:'center', padding:'24px 0', color:'#c7d9ff', fontSize:13, fontWeight:500 }}>No sessions yet</div>
//                         )}
//                         {sessions.map(s => (
//                             <button key={s.id} onClick={() => loadSession(s.id)} style={{
//                                 width:'100%', display:'flex', alignItems:'center', gap:9,
//                                 padding:'10px 10px', borderRadius:10, marginBottom:3, border:'none',
//                                 background: currentSessionId===s.id ? '#eff6ff' : 'transparent',
//                                 borderLeft: currentSessionId===s.id ? '3px solid #2563eb' : '3px solid transparent',
//                                 transition:'all .15s', textAlign:'left',
//                             }}>
//                                 <MessageSquare size={13} color={currentSessionId===s.id ? '#2563eb' : '#93c5fd'} />
//                                 <span style={{
//                                     fontSize:13, fontWeight: currentSessionId===s.id ? 700 : 500,
//                                     color: currentSessionId===s.id ? '#2563eb' : '#64748b',
//                                     overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1,
//                                 }}>{s.title}</span>
//                             </button>
//                         ))}
//                     </div>
//                 )}
//             </aside>

//             {/* ══════════ MAIN ══════════ */}
//             <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0, position:'relative' }}>

//                 {/* Header */}
//                 <header style={{
//                     height:64, flexShrink:0,
//                     display:'flex', alignItems:'center', justifyContent:'space-between',
//                     padding:'0 24px',
//                     background:'rgba(255,255,255,0.88)', backdropFilter:'blur(20px)',
//                     borderBottom:'1px solid #e0eaff',
//                     boxShadow:'0 1px 12px rgba(37,99,235,0.06)',
//                 }}>
//                     <div style={{ display:'flex', alignItems:'center', gap:14 }}>
//                         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{
//                             width:36, height:36, borderRadius:10, border:'1.5px solid #e0eaff', background:'#fff',
//                             display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .18s',
//                         }}
//                             onMouseEnter={e => { e.currentTarget.style.background='#eff6ff'; e.currentTarget.style.borderColor='#93c5fd'; }}
//                             onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor='#e0eaff'; }}
//                         >
//                             <Menu size={16} color="#64748b" />
//                         </button>
//                         <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
//                             <span style={{ fontSize:15, fontWeight:800, color:'#0f1d3a', letterSpacing:'-0.015em', lineHeight:1 }}>
//                                 {activeTab === 'chat'
//                                     ? mode === 'ppt' ? 'Generate PPT' : 'AI Training Assistant'
//                                     : 'Media Library'}
//                             </span>
//                             <span style={{ fontSize:11, fontWeight:600, color:'#93c5fd', textTransform:'uppercase', letterSpacing:'0.1em' }}>
//                                 {activeTab === 'chat' ? (mode === 'ppt' ? 'PPT Generation Mode' : 'Chat Mode') : `${myMedia.length} Assets`}
//                             </span>
//                         </div>
//                     </div>
//                     <div style={{ display:'flex', alignItems:'center', gap:8 }}>
//                         <div style={{ display:'flex', alignItems:'center', gap:6, background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:100, padding:'5px 12px' }}>
//                             <span style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', display:'block', animation:'pulse 2s ease-in-out infinite', boxShadow:'0 0 0 3px rgba(34,197,94,0.2)' }} />
//                             <span style={{ fontSize:11, fontWeight:700, color:'#16a34a', letterSpacing:'0.08em' }}>ONLINE</span>
//                         </div>
//                     </div>
//                 </header>

//                 {/* ── CHAT / PPT VIEW ── */}
//                 {activeTab === 'chat' && (
//                     <>
//                         <div style={{ flex:1, overflowY:'auto', padding:'32px 24px 160px' }}>
//                             <div style={{ maxWidth:780, margin:'0 auto' }}>

//                                 {/* Empty State */}
//                                 {messages.length === 0 && !loading && (
//                                     <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'55vh', gap:20, textAlign:'center', animation:'fadeIn .6s ease' }}>
//                                         <div style={{
//                                             width:88, height:88, borderRadius:28,
//                                             background: mode === 'ppt' ? 'linear-gradient(135deg,#eef2ff,#e0e7ff)' : 'linear-gradient(135deg,#eff6ff,#dbeafe)',
//                                             border: `2px solid ${mode === 'ppt' ? '#a5b4fc' : '#93c5fd'}`,
//                                             display:'flex', alignItems:'center', justifyContent:'center',
//                                             boxShadow: mode === 'ppt' ? '0 12px 32px rgba(99,102,241,0.18)' : '0 12px 32px rgba(37,99,235,0.18)',
//                                             animation:'bobble 4s ease-in-out infinite',
//                                         }}>
//                                             {mode === 'ppt' ? <FileText size={40} color="#6366f1" /> : <Sparkles size={40} color="#2563eb" />}
//                                         </div>
//                                         <div>
//                                             <h2 style={{ fontSize:26, fontWeight:800, color:'#0f1d3a', letterSpacing:'-0.025em', lineHeight:1.2, marginBottom:10 }}>
//                                                 {mode === 'ppt' ? 'Generate a Presentation' : 'What are we creating today?'}
//                                             </h2>
//                                             <p style={{ fontSize:15, color:'#64748b', maxWidth:320, lineHeight:1.7, margin:'0 auto' }}>
//                                                 {mode === 'ppt'
//                                                     ? 'Describe your topic and I\'ll build a PowerPoint presentation for you.'
//                                                     : 'Ask anything or switch to PPT mode to generate a presentation.'}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Messages */}
//                                 {messages.map((msg, i) => {
//                                     const isUser = msg.sender === 'user';
//                                     return (
//                                         <div key={i} className="msg-in" style={{ display:'flex', flexDirection: isUser ? 'row-reverse' : 'row', alignItems:'flex-start', gap:12, marginBottom:24 }}>
//                                             <div style={{
//                                                 width:36, height:36, borderRadius:11, flexShrink:0,
//                                                 display:'flex', alignItems:'center', justifyContent:'center',
//                                                 background: isUser ? 'linear-gradient(135deg,#374151,#1f2937)' : 'linear-gradient(135deg,#2563eb,#1e40af)',
//                                                 boxShadow: isUser ? '0 4px 12px rgba(0,0,0,0.2)' : '0 4px 12px rgba(37,99,235,0.35)',
//                                             }}>
//                                                 {isUser ? <User size={16} color="#fff" /> : <Sparkles size={16} color="#fff" />}
//                                             </div>
//                                             <div style={{ display:'flex', flexDirection:'column', alignItems: isUser ? 'flex-end' : 'flex-start', maxWidth:'72%', gap:6 }}>
//                                                 <div className={isUser ? 'md-user' : 'md-ai'} style={{
//                                                     padding:'13px 17px',
//                                                     borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
//                                                     background: isUser ? 'linear-gradient(135deg,#2563eb,#1d4ed8)'
//                                                         : msg.type === 'ppt_success' ? '#eef2ff' : '#ffffff',
//                                                     border: isUser ? 'none'
//                                                         : msg.type === 'ppt_success' ? '1.5px solid #a5b4fc' : '1.5px solid #e0eaff',
//                                                     boxShadow: isUser ? '0 4px 18px rgba(37,99,235,0.3)' : '0 2px 10px rgba(37,99,235,0.07)',
//                                                 }}>
//                                                     <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
//                                                 </div>
//                                                 <span style={{ fontSize:10.5, color:'#c7d9ff', fontWeight:600, padding:'0 2px' }}>
//                                                     {new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}

//                                 {/* Loading */}
//                                 {loading && (
//                                     <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:24 }}>
//                                         <div style={{ width:36, height:36, borderRadius:11, flexShrink:0, background:'linear-gradient(135deg,#2563eb,#1e40af)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(37,99,235,0.35)' }}>
//                                             <Loader2 size={16} color="#fff" style={{ animation:'spin 1s linear infinite' }} />
//                                         </div>
//                                         <div style={{ background:'#fff', border:'1.5px solid #e0eaff', borderRadius:'4px 18px 18px 18px', padding:'13px 18px', display:'flex', alignItems:'center', gap:14, boxShadow:'0 2px 10px rgba(37,99,235,0.07)' }}>
//                                             <span style={{ display:'flex', gap:5 }}>
//                                                 {[0,1,2].map(i => (
//                                                     <span key={i} style={{ width:7, height:7, borderRadius:'50%', background: accent, display:'inline-block', animation:'dotup 1.1s ease-in-out infinite', animationDelay:`${i*0.18}s` }} />
//                                                 ))}
//                                             </span>
//                                             <span style={{ fontSize:13, color:'#64748b', fontStyle:'italic', fontWeight:500 }}>{loadingText}</span>
//                                         </div>
//                                     </div>
//                                 )}
//                                 <div ref={messagesEndRef} />
//                             </div>
//                         </div>

//                         {/* ── INPUT BAR ── */}
//                         <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'0 24px 24px', background:'linear-gradient(to top,rgba(248,250,255,1) 70%,rgba(248,250,255,0))' }}>
//                             <div style={{ maxWidth:780, margin:'0 auto' }}>
//                                 <div style={{ background:'#fff', borderRadius:20, border:`1.5px solid ${mode === 'ppt' ? '#a5b4fc' : '#e0eaff'}`, boxShadow:'0 8px 32px rgba(37,99,235,0.1)', overflow:'hidden' }}>
//                                     <div style={{ display:'flex', alignItems:'center', padding:'12px 12px 12px 20px', gap:10 }}>
//                                         <input
//                                             ref={inputRef}
//                                             value={input}
//                                             onChange={e => setInput(e.target.value)}
//                                             onKeyDown={e => e.key==='Enter' && !e.shiftKey && handleSend()}
//                                             disabled={loading}
//                                             placeholder={placeholder}
//                                             style={{ flex:1, border:'none', background:'transparent', fontSize:15, color:'#0f1d3a', fontFamily:"'Outfit',sans-serif", lineHeight:1.5, fontWeight:400 }}
//                                         />
//                                         <button onClick={handleSend} disabled={loading || !input.trim()} style={{
//                                             width:42, height:42, borderRadius:13, border:'none', flexShrink:0,
//                                             display:'flex', alignItems:'center', justifyContent:'center',
//                                             background: loading || !input.trim() ? '#f1f5f9' : `linear-gradient(135deg,${accent},${accent}dd)`,
//                                             boxShadow: loading || !input.trim() ? 'none' : `0 4px 14px ${accent}50`,
//                                             cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
//                                             transition:'all .2s',
//                                         }}
//                                             onMouseEnter={e => { if (!loading && input.trim()) e.currentTarget.style.transform='scale(1.08)'; }}
//                                             onMouseLeave={e => { e.currentTarget.style.transform='none'; }}
//                                         >
//                                             {loading
//                                                 ? <Loader2 size={17} color="#94a3b8" style={{ animation:'spin 1s linear infinite' }} />
//                                                 : <Send size={16} color={!input.trim() ? '#94a3b8' : '#fff'} strokeWidth={2.2} />
//                                             }
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <p style={{ textAlign:'center', marginTop:10, fontSize:11, color:'#c7d9ff', fontWeight:600, letterSpacing:'0.06em' }}>
//                                     LMS AI · Powered by Gemini · Enterprise Training Platform
//                                 </p>
//                             </div>
//                         </div>
//                     </>
//                 )}

//                 {/* ── MEDIA LIBRARY ── */}
//                 {activeTab === 'library' && (
//                     <div style={{ flex:1, overflowY:'auto', padding:'32px 24px' }}>
//                         <div style={{ maxWidth:1080, margin:'0 auto' }}>
//                             <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28, paddingBottom:20, borderBottom:'1px solid #e0eaff' }}>
//                                 <div>
//                                     <h2 style={{ fontSize:26, fontWeight:800, color:'#0f1d3a', letterSpacing:'-0.025em', lineHeight:1.1, marginBottom:6 }}>My Training Assets</h2>
//                                     <p style={{ fontSize:14, color:'#93c5fd', fontWeight:500 }}>{myMedia.length} generated {myMedia.length===1 ? 'file' : 'files'}</p>
//                                 </div>
//                                 <button onClick={fetchLibrary} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, border:'1.5px solid #e0eaff', background:'#fff', color:'#2563eb', fontSize:13, fontWeight:700, boxShadow:'0 2px 8px rgba(37,99,235,0.06)', transition:'all .2s' }}
//                                     onMouseEnter={e => { e.currentTarget.style.background='#eff6ff'; e.currentTarget.style.borderColor='#93c5fd'; }}
//                                     onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor='#e0eaff'; }}
//                                 >
//                                     <Loader2 size={13} color="#2563eb" />Refresh
//                                 </button>
//                             </div>
//                             {myMedia.length === 0 ? (
//                                 <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 0', gap:16, textAlign:'center' }}>
//                                     <div style={{ width:72, height:72, borderRadius:22, background:'linear-gradient(135deg,#eff6ff,#dbeafe)', border:'1.5px solid #c7d9ff', display:'flex', alignItems:'center', justifyContent:'center' }}>
//                                         <Library size={32} color="#93c5fd" />
//                                     </div>
//                                     <div>
//                                         <p style={{ fontSize:17, fontWeight:700, color:'#1e3a5f', marginBottom:6 }}>No assets yet</p>
//                                         <p style={{ fontSize:14, color:'#93c5fd', fontWeight:500 }}>Generate a PPT to see it here.</p>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:18 }}>
//                                     {myMedia.map(item => <MediaCard key={item.id} item={item} />)}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </main>
//         </div>
//         </>
//     );
// };

// export default AiAssistant;


import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Send, Plus, MessageSquare, User, Menu,
    Sparkles, FileType, Loader2,
    Library, PlayCircle, Download, Clock, FileText
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Message {
    sender: 'user' | 'ai';
    text: string;
    type?: 'text' | 'ppt_success';
}

// Ensure your backend sends 'created_at' or 'updated_at'
interface ChatSession { 
    id: number; 
    title: string; 
    created_at: string; 
    updated_at?: string; 
}

interface GeneratedMedia { id: number; title: string; url: string; type: 'video' | 'ppt'; created_at: string; prompt?: string; }
type GenerationMode = 'chat' | 'ppt';

// ─── FALLING BLUE DOTS ────────────────────────────────────────────────────────
const FallingDots: React.FC = () => {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let raf: number;
        interface Dot { x: number; y: number; r: number; vy: number; alpha: number; phase: number; }
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize(); window.addEventListener('resize', resize);
        const dots: Dot[] = Array.from({ length: 65 }, () => ({
            x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
            r: Math.random() * 4 + 1.5, vy: Math.random() * 0.9 + 0.3,
            alpha: Math.random() * 0.18 + 0.05, phase: Math.random() * Math.PI * 2,
        }));
        const tick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const d of dots) {
                d.phase += 0.016; d.y += d.vy; d.x += Math.sin(d.phase) * 0.4;
                if (d.y > canvas.height + 10) { d.y = -10; d.x = Math.random() * canvas.width; }
                const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 3.5);
                g.addColorStop(0,   `rgba(59,130,246,${d.alpha})`);
                g.addColorStop(0.5, `rgba(59,130,246,${d.alpha * 0.4})`);
                g.addColorStop(1,   `rgba(59,130,246,0)`);
                ctx.beginPath(); ctx.arc(d.x, d.y, d.r * 3.5, 0, Math.PI * 2);
                ctx.fillStyle = g; ctx.fill();
                ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(37,99,235,${Math.min(d.alpha * 3, 0.5)})`; ctx.fill();
            }
            raf = requestAnimationFrame(tick);
        };
        tick();
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={ref} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', background:'#f8faff' }} />;
};

// ─── MEDIA CARD ───────────────────────────────────────────────────────────────
const MediaCard: React.FC<{ item: GeneratedMedia }> = ({ item }) => {
    const [hov, setHov] = useState(false);
    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
            background: '#fff', borderRadius: 16, overflow: 'hidden',
            border: `1.5px solid ${hov ? '#93c5fd' : '#e0eaff'}`,
            boxShadow: hov ? '0 16px 40px rgba(37,99,235,0.14)' : '0 2px 12px rgba(37,99,235,0.06)',
            transform: hov ? 'translateY(-4px)' : 'none',
            transition: 'all 0.28s cubic-bezier(.4,0,.2,1)',
        }}>
            <div style={{ aspectRatio:'16/9', background:'linear-gradient(135deg,#eff6ff,#dbeafe)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                {item.type === 'video' ? (
                    <video src={item.url} style={{ width:'100%', height:'100%', objectFit:'cover' }}
                        onMouseOver={e => e.currentTarget.play()}
                        onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                        muted loop />
                ) : (
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                        <div style={{ width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#6366f1,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 20px rgba(99,102,241,0.3)' }}>
                            <FileType size={26} color="#fff" />
                        </div>
                        <span style={{ fontSize:10, fontWeight:800, color:'#a5b4fc', letterSpacing:'0.16em', textTransform:'uppercase' }}>PowerPoint</span>
                    </div>
                )}
                {hov && (
                    <div style={{ position:'absolute', inset:0, background:'rgba(17,40,95,0.55)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <a href={item.url} target="_blank" rel="noreferrer" style={{
                            display:'inline-flex', alignItems:'center', gap:8, padding:'11px 24px',
                            borderRadius:100, textDecoration:'none', color:'#fff', fontWeight:700, fontSize:13, fontFamily:'inherit',
                            background: item.type === 'video' ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
                            boxShadow:'0 8px 24px rgba(0,0,0,0.25)',
                        }}>
                            {item.type === 'video' ? <><PlayCircle size={15} color="#fff" />Watch Video</> : <><Download size={15} color="#fff" />Download</>}
                        </a>
                    </div>
                )}
                <div style={{ position:'absolute', top:10, right:10, background: item.type === 'video' ? 'rgba(37,99,235,0.9)' : 'rgba(99,102,241,0.9)', color:'#fff', fontSize:9, fontWeight:800, letterSpacing:'0.14em', textTransform:'uppercase', padding:'4px 10px', borderRadius:100, backdropFilter:'blur(4px)' }}>
                    {item.type}
                </div>
            </div>
            <div style={{ padding:'14px 16px 16px' }}>
                <p style={{ fontSize:14, fontWeight:700, color:'#0f1d3a', marginBottom:10, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', lineHeight:1.4 }}>{item.title}</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#93c5fd', fontWeight:600 }}>
                        <Clock size={11} color="#93c5fd" />{new Date(item.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                    </span>
                    <span style={{ fontSize:10, fontWeight:800, color: item.type === 'video' ? '#2563eb' : '#6366f1', background: item.type === 'video' ? '#eff6ff' : '#eef2ff', padding:'3px 10px', borderRadius:100, textTransform:'uppercase', letterSpacing:'0.1em' }}>{item.type}</span>
                </div>
            </div>
        </div>
    );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const AiAssistant: React.FC = () => {
    const [sessions, setSessions]                   = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId]   = useState<number | null>(null);
    const [messages, setMessages]                   = useState<Message[]>([]);
    const [myMedia, setMyMedia]                     = useState<GeneratedMedia[]>([]);
    const [input, setInput]                         = useState<string>('');
    const [loading, setLoading]                     = useState<boolean>(false);
    const [loadingText, setLoadingText]             = useState<string>('');
    const [activeTab, setActiveTab]                 = useState<'chat' | 'library'>('chat');
    const [isSidebarOpen, setIsSidebarOpen]         = useState(true);
    const [mode, setMode]                           = useState<GenerationMode>('chat');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef       = useRef<HTMLInputElement>(null);
    const token = localStorage.getItem('access_token');

    useEffect(() => { fetchHistory(); fetchLibrary(); }, []);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/lms/ai/history/', { headers: { Authorization: `Bearer ${token}` } });
            // Sort by Date Descending
            const sorted = res.data.sort((a: ChatSession, b: ChatSession) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setSessions(sorted);
        } catch (err) { console.error('History fetch failed', err); }
    };

    const fetchLibrary = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/lms/ai/my_media/', { headers: { Authorization: `Bearer ${token}` } });
            setMyMedia(res.data);
        } catch (err) { console.error('Library fetch failed', err); }
    };

    const loadSession = async (sessionId: number) => {
        if (loading) return;
        setCurrentSessionId(sessionId);
        setActiveTab('chat');
        setMode('chat');
        setLoading(true);
        setLoadingText('Loading conversation...');
        setMessages([]);

        try {
            const res = await axios.get(`http://127.0.0.1:8000/lms/ai/${sessionId}/messages/`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            const historyMessages: Message[] = res.data.map((m: any) => ({
                sender: m.sender,
                text: m.text,
                type: 'text'
            }));
            setMessages(historyMessages);
        } catch (err) {
            console.error('Failed to load session messages', err);
        } finally {
            setLoading(false);
            setLoadingText('');
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const prompt = input;
        setInput(''); setLoading(true);
        setMessages(prev => [...prev, { sender:'user', text:prompt }]);
        try {
            if (mode === 'chat') {
                setLoadingText('AI is thinking…');
                const res = await axios.post('http://127.0.0.1:8000/lms/ai/chat/',
                    { query: prompt, session_id: currentSessionId },
                    { headers: { Authorization: `Bearer ${token}` } });
                
                setMessages(prev => [...prev, { sender:'ai', text:res.data.response, type:'text' }]);
                
                if (!currentSessionId) { 
                    setCurrentSessionId(res.data.session_id); 
                    await fetchHistory(); 
                }
            } else if (mode === 'ppt') {
                setLoadingText('Generating slides & creating PPT…');
                const res = await axios.post('http://127.0.0.1:8000/lms/ai/generate_ppt/',
                    { content: prompt },
                    { headers: { Authorization: `Bearer ${token}` }, responseType:'blob' });
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const a = document.createElement('a'); a.href = url; a.setAttribute('download', 'Training_Module.pptx');
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                setMessages(prev => [...prev, { sender:'ai', text:`✅ **Presentation Ready!** Your PowerPoint for *"${prompt}"* has been downloaded.`, type:'ppt_success' }]);
                await fetchLibrary();
            }
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { sender:'ai', text:'❌ **Error:** Could not generate content. Please check your connection.', type:'text' }]);
        } finally { setLoading(false); setLoadingText(''); }
    };

    // ─── CHATGPT STYLE GROUPING LOGIC ─────────────────────────────────────────
    const getGroupName = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        if (date >= today) return 'Today';
        if (date >= yesterday) return 'Yesterday';
        if (date >= sevenDaysAgo) return 'Previous 7 Days';
        if (date >= thirtyDaysAgo) return 'Previous 30 Days';

        // Returns Month Name (e.g., September) for older chats
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    // Group the sessions
    const groupedSessions = sessions.reduce((groups, session) => {
        // Use updated_at if available, otherwise created_at
        const dateKey = session.updated_at || session.created_at;
        const groupName = getGroupName(dateKey);
        
        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(session);
        return groups;
    }, {} as Record<string, ChatSession[]>);

    // Define Sort Order for the Groups
    const groupOrder = Object.keys(groupedSessions).sort((a, b) => {
        if (a === 'Today') return -1;
        if (b === 'Today') return 1;
        if (a === 'Yesterday') return -1;
        if (b === 'Yesterday') return 1;
        if (a === 'Previous 7 Days') return -1;
        if (b === 'Previous 7 Days') return 1;
        if (a === 'Previous 30 Days') return -1;
        if (b === 'Previous 30 Days') return 1;
        return 0; // Keep month names as they appeared
    });

    const accent = mode === 'ppt' ? '#6366f1' : '#2563eb';
    const placeholder = mode === 'chat' ? 'Ask anything about training…' : 'Topic or outline for your slides…';

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
            *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
            html, body { height:100%; }
            body { font-family:'Outfit',sans-serif; background:#f8faff; color:#0f1d3a; }
            ::-webkit-scrollbar       { width:5px; }
            ::-webkit-scrollbar-track { background:transparent; }
            ::-webkit-scrollbar-thumb { background:#c7d9ff; border-radius:10px; }
            @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
            @keyframes slideUp { from{opacity:0;transform:translateY(16px) scale(.97)} to{opacity:1;transform:none} }
            @keyframes bobble  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
            @keyframes spin    { to{transform:rotate(360deg)} }
            @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.9)} }
            @keyframes dotup   { 0%,100%{transform:translateY(0);opacity:.3} 50%{transform:translateY(-6px);opacity:1} }
            .msg-in { animation:slideUp .36s cubic-bezier(.34,1.56,.64,1) both; }
            .md-ai p        { font-size:14px; line-height:1.8; color:#1e3a5f; margin-bottom:8px }
            .md-ai p:last-child { margin-bottom:0 }
            .md-ai strong   { font-weight:700; color:#1d4ed8 }
            .md-ai em       { color:#3b82f6; font-style:italic }
            .md-ai ul,.md-ai ol { padding-left:20px; margin:6px 0 }
            .md-ai li       { font-size:14px; line-height:1.7; color:#1e3a5f; margin-bottom:3px }
            .md-ai code     { font-family:'JetBrains Mono',monospace; font-size:12px; background:#eff6ff; color:#1d4ed8; padding:2px 6px; border-radius:5px }
            .md-user p      { font-size:14px; line-height:1.8; color:#fff; margin-bottom:8px }
            .md-user p:last-child { margin-bottom:0 }
            .md-user strong { font-weight:700; color:#bfdbfe }
            .md-user em     { color:rgba(255,255,255,.8) }
            input::placeholder { color:#93c5fd; }
            input:focus { outline:none; }
            button { font-family:'Outfit',sans-serif; cursor:pointer; }
        `}</style>

        <FallingDots />

        <div style={{ display:'flex', height:'100vh', overflow:'hidden', position:'relative', zIndex:1, fontFamily:"'Outfit',sans-serif" }}>

            {/* ══════════ SIDEBAR ══════════ */}
            <aside style={{
                width: isSidebarOpen ? 272 : 0, minWidth: isSidebarOpen ? 272 : 0,
                flexShrink:0, overflow:'hidden',
                background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)',
                borderRight:'1px solid #e0eaff',
                display:'flex', flexDirection:'column',
                transition:'all .32s cubic-bezier(.4,0,.2,1)',
                boxShadow: isSidebarOpen ? '4px 0 24px rgba(37,99,235,0.06)' : 'none',
            }}>
                {/* Brand */}
                <div style={{ padding:'24px 20px 18px', borderBottom:'1px solid #e0eaff' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                        <div style={{
                            width:42, height:42, borderRadius:14, flexShrink:0,
                            background:'linear-gradient(135deg,#2563eb,#1e40af)',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            boxShadow:'0 6px 20px rgba(37,99,235,0.4)',
                            animation:'bobble 4s ease-in-out infinite',
                        }}>
                            <Sparkles size={20} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize:17, fontWeight:800, color:'#0f1d3a', letterSpacing:'-0.02em', lineHeight:1.1 }}>LMS AI</div>
                            <div style={{ fontSize:10, fontWeight:600, color:'#93c5fd', textTransform:'uppercase', letterSpacing:'0.14em', marginTop:3 }}>Training Studio</div>
                        </div>
                    </div>

                    {/* New Session Button */}
                    <button onClick={() => { setActiveTab('chat'); setCurrentSessionId(null); setMessages([]); setMode('chat'); }} style={{
                        width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                        padding:'11px 0', borderRadius:12, border:'none',
                        background:'linear-gradient(135deg,#2563eb,#1d4ed8)',
                        color:'#fff', fontWeight:700, fontSize:14, marginBottom:8,
                        boxShadow:'0 4px 16px rgba(37,99,235,0.35)', transition:'all .2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(37,99,235,0.45)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 16px rgba(37,99,235,0.35)'; }}
                    >
                        <Plus size={16} color="#fff" strokeWidth={2.5} />New Session
                    </button>

                    {/* Generate PPT */}
                    <button onClick={() => { setActiveTab('chat'); setMode('ppt'); }} style={{
                        width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                        padding:'10px 0', borderRadius:12, border:'1.5px solid #e0eaff',
                        background: mode === 'ppt' && activeTab === 'chat' ? '#eef2ff' : '#fff',
                        color: mode === 'ppt' && activeTab === 'chat' ? '#6366f1' : '#64748b',
                        fontWeight:700, fontSize:14, marginBottom:8, transition:'all .2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background='#eef2ff'; e.currentTarget.style.color='#6366f1'; e.currentTarget.style.borderColor='#a5b4fc'; }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = mode === 'ppt' && activeTab === 'chat' ? '#eef2ff' : '#fff';
                            e.currentTarget.style.color = mode === 'ppt' && activeTab === 'chat' ? '#6366f1' : '#64748b';
                            e.currentTarget.style.borderColor = '#e0eaff';
                        }}
                    >
                        <FileText size={15} color={mode === 'ppt' && activeTab === 'chat' ? '#6366f1' : '#a5b4fc'} />Generate PPT
                    </button>

                    {/* Media Library */}
                    <button onClick={() => setActiveTab('library')} style={{
                        width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
                        padding:'10px 13px', borderRadius:11, border:`1.5px solid ${activeTab==='library' ? '#93c5fd' : 'transparent'}`,
                        background: activeTab==='library' ? '#eff6ff' : 'transparent',
                        transition:'all .18s',
                    }}>
                        <span style={{ display:'flex', alignItems:'center', gap:9, fontSize:14, fontWeight:600, color: activeTab==='library' ? '#2563eb' : '#64748b' }}>
                            <Library size={15} color={activeTab==='library' ? '#2563eb' : '#93c5fd'} />Media Library
                        </span>
                        <span style={{ background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', fontSize:10, fontWeight:800, padding:'3px 9px', borderRadius:100, minWidth:24, textAlign:'center' }}>
                            {myMedia.length}
                        </span>
                    </button>
                </div>

                {/* ── DATE WISE CHAT HISTORY ── */}
                {activeTab === 'chat' && (
                    <div style={{ flex:1, overflowY:'auto', padding:'16px 12px 12px' }}>
                        {sessions.length === 0 && (
                            <div style={{ textAlign:'center', padding:'24px 0', color:'#c7d9ff', fontSize:13, fontWeight:500 }}>No sessions yet</div>
                        )}
                        
                        {groupOrder.map(groupName => {
                             const groupList = groupedSessions[groupName];
                             if(!groupList) return null;
                             
                             return (
                                 <div key={groupName} style={{ marginBottom:20 }}>
                                    <div style={{ 
                                        fontSize:11, fontWeight:700, color:'#9ca3af', 
                                        textTransform:'uppercase', letterSpacing:'0.05em', 
                                        padding:'0 10px', marginBottom:8 
                                    }}>
                                        {groupName}
                                    </div>
                                    {groupList.map(s => (
                                        <button key={s.id} onClick={() => loadSession(s.id)} style={{
                                            width:'100%', display:'flex', alignItems:'center', gap:9,
                                            padding:'10px 10px', borderRadius:10, marginBottom:3, border:'none',
                                            background: currentSessionId===s.id ? '#eff6ff' : 'transparent',
                                            borderLeft: currentSessionId===s.id ? '3px solid #2563eb' : '3px solid transparent',
                                            transition:'all .15s', textAlign:'left',
                                        }}>
                                            <MessageSquare size={13} color={currentSessionId===s.id ? '#2563eb' : '#93c5fd'} />
                                            <span style={{
                                                fontSize:13, fontWeight: currentSessionId===s.id ? 700 : 500,
                                                color: currentSessionId===s.id ? '#2563eb' : '#64748b',
                                                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1,
                                            }}>{s.title}</span>
                                        </button>
                                    ))}
                                 </div>
                             );
                        })}
                    </div>
                )}
            </aside>

            {/* ══════════ MAIN ══════════ */}
            <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0, position:'relative' }}>

                {/* Header */}
                <header style={{
                    height:64, flexShrink:0,
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'0 24px',
                    background:'rgba(255,255,255,0.88)', backdropFilter:'blur(20px)',
                    borderBottom:'1px solid #e0eaff',
                    boxShadow:'0 1px 12px rgba(37,99,235,0.06)',
                }}>
                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{
                            width:36, height:36, borderRadius:10, border:'1.5px solid #e0eaff', background:'#fff',
                            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .18s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background='#eff6ff'; e.currentTarget.style.borderColor='#93c5fd'; }}
                            onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor='#e0eaff'; }}
                        >
                            <Menu size={16} color="#64748b" />
                        </button>
                        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                            <span style={{ fontSize:15, fontWeight:800, color:'#0f1d3a', letterSpacing:'-0.015em', lineHeight:1 }}>
                                {activeTab === 'chat'
                                    ? mode === 'ppt' ? 'Generate PPT' : 'AI Training Assistant'
                                    : 'Media Library'}
                            </span>
                            <span style={{ fontSize:11, fontWeight:600, color:'#93c5fd', textTransform:'uppercase', letterSpacing:'0.1em' }}>
                                {activeTab === 'chat' ? (mode === 'ppt' ? 'PPT Generation Mode' : 'Chat Mode') : `${myMedia.length} Assets`}
                            </span>
                        </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:100, padding:'5px 12px' }}>
                            <span style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', display:'block', animation:'pulse 2s ease-in-out infinite', boxShadow:'0 0 0 3px rgba(34,197,94,0.2)' }} />
                            <span style={{ fontSize:11, fontWeight:700, color:'#16a34a', letterSpacing:'0.08em' }}>ONLINE</span>
                        </div>
                    </div>
                </header>

                {/* ── CHAT / PPT VIEW ── */}
                {activeTab === 'chat' && (
                    <>
                        <div style={{ flex:1, overflowY:'auto', padding:'32px 24px 160px' }}>
                            <div style={{ maxWidth:780, margin:'0 auto' }}>

                                {/* Empty State */}
                                {messages.length === 0 && !loading && (
                                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'55vh', gap:20, textAlign:'center', animation:'fadeIn .6s ease' }}>
                                        <div style={{
                                            width:88, height:88, borderRadius:28,
                                            background: mode === 'ppt' ? 'linear-gradient(135deg,#eef2ff,#e0e7ff)' : 'linear-gradient(135deg,#eff6ff,#dbeafe)',
                                            border: `2px solid ${mode === 'ppt' ? '#a5b4fc' : '#93c5fd'}`,
                                            display:'flex', alignItems:'center', justifyContent:'center',
                                            boxShadow: mode === 'ppt' ? '0 12px 32px rgba(99,102,241,0.18)' : '0 12px 32px rgba(37,99,235,0.18)',
                                            animation:'bobble 4s ease-in-out infinite',
                                        }}>
                                            {mode === 'ppt' ? <FileText size={40} color="#6366f1" /> : <Sparkles size={40} color="#2563eb" />}
                                        </div>
                                        <div>
                                            <h2 style={{ fontSize:26, fontWeight:800, color:'#0f1d3a', letterSpacing:'-0.025em', lineHeight:1.2, marginBottom:10 }}>
                                                {mode === 'ppt' ? 'Generate a Presentation' : 'What are we creating today?'}
                                            </h2>
                                            <p style={{ fontSize:15, color:'#64748b', maxWidth:320, lineHeight:1.7, margin:'0 auto' }}>
                                                {mode === 'ppt'
                                                    ? 'Describe your topic and I\'ll build a PowerPoint presentation for you.'
                                                    : 'Ask anything or switch to PPT mode to generate a presentation.'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Messages */}
                                {messages.map((msg, i) => {
                                    const isUser = msg.sender === 'user';
                                    return (
                                        <div key={i} className="msg-in" style={{ display:'flex', flexDirection: isUser ? 'row-reverse' : 'row', alignItems:'flex-start', gap:12, marginBottom:24 }}>
                                            <div style={{
                                                width:36, height:36, borderRadius:11, flexShrink:0,
                                                display:'flex', alignItems:'center', justifyContent:'center',
                                                background: isUser ? 'linear-gradient(135deg,#374151,#1f2937)' : 'linear-gradient(135deg,#2563eb,#1e40af)',
                                                boxShadow: isUser ? '0 4px 12px rgba(0,0,0,0.2)' : '0 4px 12px rgba(37,99,235,0.35)',
                                            }}>
                                                {isUser ? <User size={16} color="#fff" /> : <Sparkles size={16} color="#fff" />}
                                            </div>
                                            <div style={{ display:'flex', flexDirection:'column', alignItems: isUser ? 'flex-end' : 'flex-start', maxWidth:'72%', gap:6 }}>
                                                <div className={isUser ? 'md-user' : 'md-ai'} style={{
                                                    padding:'13px 17px',
                                                    borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                                                    background: isUser ? 'linear-gradient(135deg,#2563eb,#1d4ed8)'
                                                        : msg.type === 'ppt_success' ? '#eef2ff' : '#ffffff',
                                                    border: isUser ? 'none'
                                                        : msg.type === 'ppt_success' ? '1.5px solid #a5b4fc' : '1.5px solid #e0eaff',
                                                    boxShadow: isUser ? '0 4px 18px rgba(37,99,235,0.3)' : '0 2px 10px rgba(37,99,235,0.07)',
                                                }}>
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                                </div>
                                                <span style={{ fontSize:10.5, color:'#c7d9ff', fontWeight:600, padding:'0 2px' }}>
                                                    {new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Loading */}
                                {loading && (
                                    <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:24 }}>
                                        <div style={{ width:36, height:36, borderRadius:11, flexShrink:0, background:'linear-gradient(135deg,#2563eb,#1e40af)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(37,99,235,0.35)' }}>
                                            <Loader2 size={16} color="#fff" style={{ animation:'spin 1s linear infinite' }} />
                                        </div>
                                        <div style={{ background:'#fff', border:'1.5px solid #e0eaff', borderRadius:'4px 18px 18px 18px', padding:'13px 18px', display:'flex', alignItems:'center', gap:14, boxShadow:'0 2px 10px rgba(37,99,235,0.07)' }}>
                                            <span style={{ display:'flex', gap:5 }}>
                                                {[0,1,2].map(i => (
                                                    <span key={i} style={{ width:7, height:7, borderRadius:'50%', background: accent, display:'inline-block', animation:'dotup 1.1s ease-in-out infinite', animationDelay:`${i*0.18}s` }} />
                                                ))}
                                            </span>
                                            <span style={{ fontSize:13, color:'#64748b', fontStyle:'italic', fontWeight:500 }}>{loadingText}</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* ── INPUT BAR ── */}
                        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'0 24px 24px', background:'linear-gradient(to top,rgba(248,250,255,1) 70%,rgba(248,250,255,0))' }}>
                            <div style={{ maxWidth:780, margin:'0 auto' }}>
                                <div style={{ background:'#fff', borderRadius:20, border:`1.5px solid ${mode === 'ppt' ? '#a5b4fc' : '#e0eaff'}`, boxShadow:'0 8px 32px rgba(37,99,235,0.1)', overflow:'hidden' }}>
                                    <div style={{ display:'flex', alignItems:'center', padding:'12px 12px 12px 20px', gap:10 }}>
                                        <input
                                            ref={inputRef}
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyDown={e => e.key==='Enter' && !e.shiftKey && handleSend()}
                                            disabled={loading}
                                            placeholder={placeholder}
                                            style={{ flex:1, border:'none', background:'transparent', fontSize:15, color:'#0f1d3a', fontFamily:"'Outfit',sans-serif", lineHeight:1.5, fontWeight:400 }}
                                        />
                                        <button onClick={handleSend} disabled={loading || !input.trim()} style={{
                                            width:42, height:42, borderRadius:13, border:'none', flexShrink:0,
                                            display:'flex', alignItems:'center', justifyContent:'center',
                                            background: loading || !input.trim() ? '#f1f5f9' : `linear-gradient(135deg,${accent},${accent}dd)`,
                                            boxShadow: loading || !input.trim() ? 'none' : `0 4px 14px ${accent}50`,
                                            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                                            transition:'all .2s',
                                        }}
                                            onMouseEnter={e => { if (!loading && input.trim()) e.currentTarget.style.transform='scale(1.08)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.transform='none'; }}
                                        >
                                            {loading
                                                ? <Loader2 size={17} color="#94a3b8" style={{ animation:'spin 1s linear infinite' }} />
                                                : <Send size={16} color={!input.trim() ? '#94a3b8' : '#fff'} strokeWidth={2.2} />
                                            }
                                        </button>
                                    </div>
                                </div>
                                <p style={{ textAlign:'center', marginTop:10, fontSize:11, color:'#c7d9ff', fontWeight:600, letterSpacing:'0.06em' }}>
                                    LMS AI · Powered by Gemini · Enterprise Training Platform
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {/* ── MEDIA LIBRARY ── */}
                {activeTab === 'library' && (
                    <div style={{ flex:1, overflowY:'auto', padding:'32px 24px' }}>
                        <div style={{ maxWidth:1080, margin:'0 auto' }}>
                            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28, paddingBottom:20, borderBottom:'1px solid #e0eaff' }}>
                                <div>
                                    <h2 style={{ fontSize:26, fontWeight:800, color:'#0f1d3a', letterSpacing:'-0.025em', lineHeight:1.1, marginBottom:6 }}>My Training Assets</h2>
                                    <p style={{ fontSize:14, color:'#93c5fd', fontWeight:500 }}>{myMedia.length} generated {myMedia.length===1 ? 'file' : 'files'}</p>
                                </div>
                                <button onClick={fetchLibrary} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, border:'1.5px solid #e0eaff', background:'#fff', color:'#2563eb', fontSize:13, fontWeight:700, boxShadow:'0 2px 8px rgba(37,99,235,0.06)', transition:'all .2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background='#eff6ff'; e.currentTarget.style.borderColor='#93c5fd'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor='#e0eaff'; }}
                                >
                                    <Loader2 size={13} color="#2563eb" />Refresh
                                </button>
                            </div>
                            {myMedia.length === 0 ? (
                                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 0', gap:16, textAlign:'center' }}>
                                    <div style={{ width:72, height:72, borderRadius:22, background:'linear-gradient(135deg,#eff6ff,#dbeafe)', border:'1.5px solid #c7d9ff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        <Library size={32} color="#93c5fd" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize:17, fontWeight:700, color:'#1e3a5f', marginBottom:6 }}>No assets yet</p>
                                        <p style={{ fontSize:14, color:'#93c5fd', fontWeight:500 }}>Generate a PPT to see it here.</p>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:18 }}>
                                    {myMedia.map(item => <MediaCard key={item.id} item={item} />)}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
        </>
    );
};

export default AiAssistant;