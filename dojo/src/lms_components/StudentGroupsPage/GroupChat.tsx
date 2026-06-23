


// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Send, Paperclip, Search, Hash, ChevronDown, Users, X, 
//   User, MessageCircle, GraduationCap, MoreHorizontal,
//   Smile, Image, Check, CheckCheck, ArrowDown, Pin,
//   AtSign, BookOpen, FileText, Link2, Calendar
// } from 'lucide-react';

// // --- CONFIGURATION ---
// const BACKEND_HOST = '127.0.0.1:8000'; 
// const HTTP_BASE = `http://${BACKEND_HOST}/lms`; 

// // --- TYPES ---
// export interface ChatMember {
//   id: number | string;
//   name: string;
//   role: string;
//   avatar?: string | null;
//   email?: string;
//   isOnline?: boolean;
// }

// interface ChatProps {
//   groupId: string;
//   groupName: string;
//   members?: ChatMember[];
//   token: string | null;
//   currentUser: {
//     id: number | string;
//     name: string;
//     role?: string;
//   };
//   onClose?: () => void;
// }

// interface Message {
//   id: number;
//   sender: number | string;
//   sender_name: string;
//   sender_avatar: string | null;
//   sender_role: string;
//   content: string;
//   timestamp: string;
// }

// const GroupChat: React.FC<ChatProps> = ({ 
//   groupId, 
//   groupName, 
//   members = [], 
//   token, 
//   currentUser, 
//   onClose 
// }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
//   const [showMembers, setShowMembers] = useState(false);
//   const [showScrollBottom, setShowScrollBottom] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showSearch, setShowSearch] = useState(false);

//   const socketRef = useRef<WebSocket | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const scrollViewportRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLTextAreaElement>(null);

//   // Fetch History
//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const response = await fetch(`${HTTP_BASE}/group-chat-history/?group_id=${groupId}`, {
//           headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setMessages(data);
//           setTimeout(scrollToBottom, 100);
//         }
//       } catch (error) { 
//         console.error("History Error", error); 
//       }
//     };
//     if (groupId && token) fetchHistory();
//   }, [groupId, token]);

//   // WebSocket Connection
//   useEffect(() => {
//     if (!groupId || !currentUser.id) return;
//     const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
//     const wsUrl = `${wsProtocol}//${BACKEND_HOST}/ws/groups/${groupId}/chat/`;

//     const socket = new WebSocket(wsUrl);
//     socket.onopen = () => setStatus('connected');
    
//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.message) {
//           const incomingMsg = data.message;
//           setMessages((prev) => [...prev, incomingMsg]);
          
//           const isMe = String(incomingMsg.sender) === String(currentUser.id);
//           if (isMe || !isUserScrolledUp) {
//             setTimeout(scrollToBottom, 50);
//           } else {
//             setUnreadCount(prev => prev + 1);
//             setShowScrollBottom(true);
//           }
//         }
//       } catch (e) { 
//         console.error(e); 
//       }
//     };
    
//     socket.onclose = () => setStatus('disconnected');
//     socketRef.current = socket;
//     return () => { socket.close(); };
//   }, [groupId, currentUser.id, isUserScrolledUp]);

//   // Helpers
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     setUnreadCount(0);
//     setShowScrollBottom(false);
//   };

//   const handleScroll = () => {
//     if (!scrollViewportRef.current) return;
//     const { scrollTop, scrollHeight, clientHeight } = scrollViewportRef.current;
//     const isUp = scrollHeight - scrollTop - clientHeight > 150;
//     setIsUserScrolledUp(isUp);
//     if (!isUp) { 
//       setUnreadCount(0); 
//       setShowScrollBottom(false); 
//     }
//   };

//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !socketRef.current || !currentUser.id) return;
//     socketRef.current.send(JSON.stringify({ message: newMessage, user_id: currentUser.id }));
//     setNewMessage('');
//     setTimeout(scrollToBottom, 50);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage(e);
//     }
//   };

//   const formatTime = (iso: string) => {
//     return new Date(iso).toLocaleTimeString([], { 
//       hour: '2-digit', 
//       minute: '2-digit', 
//       hour12: true 
//     });
//   };

//   const formatDate = (iso: string) => {
//     const date = new Date(iso);
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     if (date.toDateString() === today.toDateString()) return 'Today';
//     if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
//     return date.toLocaleDateString('en-US', { 
//       weekday: 'long', 
//       month: 'short', 
//       day: 'numeric' 
//     });
//   };

//   const getAvatarUrl = (path?: string | null) => {
//     if (!path) return null;
//     if (path.startsWith('http')) return path;
//     return `http://${BACKEND_HOST}${path}`;
//   };

//   const getInitials = (name: string) => {
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
//   };

//   const getAvatarColor = (name: string) => {
//     const colors = [
//       'bg-gradient-to-br from-violet-500 to-purple-600',
//       'bg-gradient-to-br from-blue-500 to-cyan-600',
//       'bg-gradient-to-br from-emerald-500 to-teal-600',
//       'bg-gradient-to-br from-orange-500 to-amber-600',
//       'bg-gradient-to-br from-pink-500 to-rose-600',
//       'bg-gradient-to-br from-indigo-500 to-blue-600',
//       'bg-gradient-to-br from-teal-500 to-green-600',
//       'bg-gradient-to-br from-red-500 to-orange-600',
//     ];
//     let hash = 0;
//     for (let i = 0; i < name.length; i++) {
//       hash = name.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     return colors[Math.abs(hash) % colors.length];
//   };

//   // Group messages by date
//   const groupMessagesByDate = (msgs: Message[]) => {
//     const groups: { [key: string]: Message[] } = {};
//     msgs.forEach(msg => {
//       const date = new Date(msg.timestamp).toDateString();
//       if (!groups[date]) groups[date] = [];
//       groups[date].push(msg);
//     });
//     return groups;
//   };

//   const messageGroups = groupMessagesByDate(messages);
//   const onlineMembers = members.filter(m => m.isOnline !== false);

//   return (
//     <div className="flex h-full bg-white w-full overflow-hidden font-sans">
      
//       {/* =====================
//           MAIN CHAT AREA
//       ===================== */}
//       <div className="flex flex-col flex-1 h-full relative">
        
//         {/* --- SUB HEADER --- */}
//         <header className="flex items-center justify-between px-4 md:px-6 h-14 bg-slate-50 border-b border-slate-200 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2">
//               <span className={`w-2.5 h-2.5 rounded-full ${status === 'connected' ? 'bg-emerald-500' : status === 'connecting' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`} />
//               <span className="text-sm text-slate-600">
//                 {status === 'connected' ? 'Connected' : status === 'connecting' ? 'Connecting...' : 'Disconnected'}
//               </span>
//             </div>
//             <span className="text-slate-300">•</span>
//             <span className="text-sm text-slate-500">
//               {members.length} members • {onlineMembers.length} online
//             </span>
//           </div>
          
//           {/* Header Actions */}
//           <div className="flex items-center gap-1">
//             <button 
//               onClick={() => setShowSearch(!showSearch)}
//               className={`p-2 rounded-lg transition-colors ${showSearch ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
//             >
//               <Search size={18} />
//             </button>
//             <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700">
//               <Pin size={18} />
//             </button>
//             <button 
//               onClick={() => setShowMembers(!showMembers)}
//               className={`p-2 rounded-lg transition-colors ${showMembers ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
//             >
//               <Users size={18} />
//             </button>
//           </div>
//         </header>

//         {/* Search Bar (Conditional) */}
//         {showSearch && (
//           <div className="px-4 py-3 bg-white border-b border-slate-100">
//             <div className="relative max-w-lg">
//               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//               <input
//                 type="text"
//                 placeholder="Search in conversation..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
//               />
//             </div>
//           </div>
//         )}

//         {/* --- MESSAGES AREA --- */}
//         <div 
//           ref={scrollViewportRef}
//           onScroll={handleScroll}
//           className="flex-1 overflow-y-auto px-4 md:px-6 py-6 bg-gradient-to-b from-slate-50/80 to-white"
//         >
//           {/* Welcome Message */}
//           {messages.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-16 px-4">
//               <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-6 shadow-2xl shadow-indigo-500/30">
//                 <MessageCircle size={44} strokeWidth={1.5} />
//               </div>
//               <h3 className="text-2xl font-bold text-slate-900 mb-3">
//                 Welcome to {groupName}
//               </h3>
//               <p className="text-slate-500 text-center max-w-md mb-8 leading-relaxed">
//                 This is the beginning of your class discussion. Share ideas, ask questions, and collaborate with your peers!
//               </p>
              
//               {/* Quick Actions */}
//               <div className="flex flex-wrap justify-center gap-3">
//                 <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-colors">
//                   <BookOpen size={16} />
//                   Course Materials
//                 </button>
//                 <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-colors">
//                   <Calendar size={16} />
//                   Upcoming Classes
//                 </button>
//                 <button 
//                   onClick={() => setShowMembers(true)}
//                   className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-colors"
//                 >
//                   <Users size={16} />
//                   View Members
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Message Groups by Date */}
//           {Object.entries(messageGroups).map(([date, msgs]) => (
//             <div key={date} className="mb-6">
//               {/* Date Divider */}
//               <div className="flex items-center gap-4 py-4">
//                 <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
//                 <span className="text-xs font-semibold text-slate-500 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
//                   {formatDate(msgs[0].timestamp)}
//                 </span>
//                 <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
//               </div>

//               {/* Messages */}
//               <div className="space-y-1">
//                 {msgs.map((msg, idx) => {
//                   const isMe = String(msg.sender) === String(currentUser.id);
//                   const showAvatar = idx === 0 || msgs[idx - 1].sender !== msg.sender;
//                   const showName = showAvatar && !isMe;
//                   const isInstructor = msg.sender_role === 'team-leader' || msg.sender_role === 'admin' || msg.sender_role === 'instructor';
//                   const timeDiff = idx > 0 ? new Date(msg.timestamp).getTime() - new Date(msgs[idx-1].timestamp).getTime() : 0;
//                   const showTimeGap = timeDiff > 300000; // 5 minutes

//                   return (
//                     <div key={msg.id || idx}>
//                       {showTimeGap && idx > 0 && (
//                         <div className="h-4" />
//                       )}
//                       <div 
//                         className={`group flex gap-3 py-0.5 px-2 -mx-2 rounded-lg hover:bg-slate-50/80 transition-colors ${showAvatar ? 'mt-4' : ''} ${isMe ? 'flex-row-reverse' : ''}`}
//                       >
//                         {/* Avatar */}
//                         <div className={`flex-shrink-0 w-10 ${!showAvatar ? 'invisible' : ''}`}>
//                           {msg.sender_avatar ? (
//                             <img 
//                               src={getAvatarUrl(msg.sender_avatar) || ''} 
//                               className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-md"
//                               alt={msg.sender_name}
//                             />
//                           ) : (
//                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md ${getAvatarColor(msg.sender_name)}`}>
//                               {getInitials(msg.sender_name)}
//                             </div>
//                           )}
//                         </div>

//                         {/* Message Content */}
//                         <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
//                           {showName && (
//                             <div className="flex items-center gap-2 mb-1.5 px-1">
//                               <span className="text-sm font-bold text-slate-800">
//                                 {msg.sender_name}
//                               </span>
//                               {isInstructor && (
//                                 <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold rounded-full shadow-sm">
//                                   <GraduationCap size={10} />
//                                   INSTRUCTOR
//                                 </span>
//                               )}
//                               <span className="text-[11px] text-slate-400 font-medium">
//                                 {formatTime(msg.timestamp)}
//                               </span>
//                             </div>
//                           )}

//                           <div 
//                             className={`relative px-4 py-3 text-[15px] leading-relaxed ${
//                               isMe 
//                                 ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl rounded-tr-md shadow-lg shadow-indigo-500/20' 
//                                 : 'bg-white text-slate-800 rounded-2xl rounded-tl-md shadow-md border border-slate-100'
//                             }`}
//                           >
//                             <p className="whitespace-pre-wrap break-words">
//                               {msg.content}
//                             </p>
                            
//                             {/* Timestamp for own messages */}
//                             {isMe && (
//                               <div className="flex items-center justify-end gap-1.5 mt-1.5 -mb-0.5">
//                                 <span className="text-[10px] text-indigo-200 font-medium">
//                                   {formatTime(msg.timestamp)}
//                                 </span>
//                                 <CheckCheck size={14} className="text-indigo-200" />
//                               </div>
//                             )}
//                           </div>

//                           {/* Quick Actions on Hover */}
//                           <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1 ${isMe ? 'pr-2' : 'pl-2'}`}>
//                             <button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600">
//                               <Smile size={14} />
//                             </button>
//                             <button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600">
//                               <MoreHorizontal size={14} />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
          
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Scroll to Bottom Button */}
//         {showScrollBottom && (
//           <button 
//             onClick={scrollToBottom}
//             className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 bg-white border border-slate-200 shadow-xl rounded-full px-5 py-2.5 flex items-center gap-2 hover:bg-slate-50 transition-all hover:shadow-2xl group"
//           >
//             <ChevronDown size={18} className="text-slate-600 group-hover:translate-y-0.5 transition-transform" />
//             <span className="text-sm font-semibold text-slate-700">
//               {unreadCount > 0 ? `${unreadCount} new message${unreadCount > 1 ? 's' : ''}` : 'Jump to recent'}
//             </span>
//           </button>
//         )}

//         {/* --- INPUT AREA --- */}
//         <div className="px-4 md:px-6 py-4 bg-white border-t border-slate-100">
//           <form onSubmit={handleSendMessage} className="relative">
//             <div className="flex items-end gap-3 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all p-2">
//               {/* Attachment Buttons */}
//               <div className="flex items-center gap-0.5 pb-0.5">
//                 <button 
//                   type="button"
//                   className="p-2.5 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-indigo-600 hover:shadow-sm"
//                   title="Attach file"
//                 >
//                   <Paperclip size={20} />
//                 </button>
//                 <button 
//                   type="button"
//                   className="p-2.5 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-indigo-600 hover:shadow-sm hidden sm:block"
//                   title="Add image"
//                 >
//                   <Image size={20} />
//                 </button>
//                 <button 
//                   type="button"
//                   className="p-2.5 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-indigo-600 hover:shadow-sm hidden md:block"
//                   title="Add link"
//                 >
//                   <Link2 size={20} />
//                 </button>
//               </div>

//               {/* Text Input */}
//               <div className="flex-1 relative">
//                 <textarea
//                   ref={inputRef}
//                   value={newMessage}
//                   onChange={(e) => {
//                     setNewMessage(e.target.value);
//                     // Auto-resize
//                     e.target.style.height = 'auto';
//                     e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
//                   }}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Type your message..."
//                   rows={1}
//                   className="w-full bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-[15px] text-slate-900 placeholder-slate-400 py-2.5 leading-relaxed"
//                   style={{ minHeight: '24px', maxHeight: '120px' }}
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div className="flex items-center gap-0.5 pb-0.5">
//                 <button 
//                   type="button"
//                   className="p-2.5 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-indigo-600 hover:shadow-sm"
//                   title="Add emoji"
//                 >
//                   <Smile size={20} />
//                 </button>
                
//                 <button 
//                   type="submit"
//                   disabled={!newMessage.trim()}
//                   className={`p-3 rounded-xl transition-all ml-1 ${
//                     newMessage.trim() 
//                       ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-95' 
//                       : 'bg-slate-200 text-slate-400 cursor-not-allowed'
//                   }`}
//                 >
//                   <Send size={18} />
//                 </button>
//               </div>
//             </div>
            
//             {/* Keyboard Hints */}
//             <div className="flex items-center justify-between mt-2 px-2">
//               <p className="text-[11px] text-slate-400">
//                 <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono text-[10px] border border-slate-200">Enter</kbd>
//                 <span className="mx-1">to send</span>
//                 <span className="text-slate-300 mx-1">•</span>
//                 <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono text-[10px] border border-slate-200">Shift + Enter</kbd>
//                 <span className="mx-1">for new line</span>
//               </p>
//               <span className="text-[11px] text-slate-400">
//                 {newMessage.length > 0 && `${newMessage.length} characters`}
//               </span>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* =====================
//           MEMBERS SIDEBAR
//       ===================== */}
//       <aside 
//         className={`fixed lg:relative inset-y-0 right-0 w-full sm:w-80 bg-white border-l border-slate-200 flex flex-col transition-all duration-300 ease-out z-50 lg:z-auto ${
//           showMembers ? 'translate-x-0 shadow-2xl lg:shadow-none' : 'translate-x-full lg:w-0 lg:border-0 lg:overflow-hidden'
//         }`}
//       >
//         {/* Sidebar Header */}
//         <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200 flex-shrink-0 bg-slate-50">
//           <h2 className="font-bold text-slate-900">Participants</h2>
//           <button 
//             onClick={() => setShowMembers(false)}
//             className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Search Members */}
//         <div className="p-4 border-b border-slate-100">
//           <div className="relative">
//             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Find a member..."
//               className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
//             />
//           </div>
//         </div>

//         {/* Members List */}
//         <div className="flex-1 overflow-y-auto">
//           {/* Instructors Section */}
//           {members.filter(m => ['team-leader', 'admin', 'instructor'].includes(m.role)).length > 0 && (
//             <div className="p-4">
//               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
//                 <GraduationCap size={14} />
//                 Instructors
//               </h3>
//               <div className="space-y-1">
//                 {members.filter(m => ['team-leader', 'admin', 'instructor'].includes(m.role)).map((member) => {
//                   const isMe = String(member.id) === String(currentUser.id);

//                   return (
//                     <div 
//                       key={member.id}
//                       className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
//                     >
//                       <div className="relative">
//                         {member.avatar ? (
//                           <img 
//                             src={getAvatarUrl(member.avatar) || ''} 
//                             className="w-11 h-11 rounded-xl object-cover shadow-sm"
//                             alt={member.name}
//                           />
//                         ) : (
//                           <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm ${getAvatarColor(member.name)}`}>
//                             {getInitials(member.name)}
//                           </div>
//                         )}
//                         <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${member.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
//                       </div>
                      
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2">
//                           <span className="text-sm font-semibold text-slate-900 truncate">
//                             {isMe ? `${member.name} (You)` : member.name}
//                           </span>
//                         </div>
//                         <p className="text-xs text-indigo-600 font-medium">
//                           Instructor
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Students Section */}
//           <div className="p-4 pt-0">
//             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
//               <Users size={14} />
//               Students — {members.filter(m => !['team-leader', 'admin', 'instructor'].includes(m.role)).length}
//             </h3>
//             <div className="space-y-1">
//               {members.filter(m => !['team-leader', 'admin', 'instructor'].includes(m.role)).map((member) => {
//                 const isMe = String(member.id) === String(currentUser.id);

//                 return (
//                   <div 
//                     key={member.id}
//                     className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
//                   >
//                     <div className="relative">
//                       {member.avatar ? (
//                         <img 
//                           src={getAvatarUrl(member.avatar) || ''} 
//                           className="w-10 h-10 rounded-xl object-cover"
//                           alt={member.name}
//                         />
//                       ) : (
//                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(member.name)}`}>
//                           {getInitials(member.name)}
//                         </div>
//                       )}
//                       <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${member.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
//                     </div>
                    
//                     <div className="flex-1 min-w-0">
//                       <span className="text-sm font-medium text-slate-800 truncate block">
//                         {isMe ? `${member.name} (You)` : member.name}
//                       </span>
//                       <p className="text-xs text-slate-500 truncate">
//                         {member.email}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Overlay for mobile sidebar */}
//       {showMembers && (
//         <div 
//           className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
//           onClick={() => setShowMembers(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default GroupChat;




import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Send, Paperclip, Search, ChevronDown, Users, X, 
  MessageCircle, GraduationCap, MoreHorizontal,
  Smile, Image as ImageIcon, CheckCheck, File, Download,
  XCircle, Loader2, AlertCircle
} from 'lucide-react';

// --- CONFIGURATION ---
const BACKEND_HOST = '127.0.0.1:8000'; 
const HTTP_BASE = `http://${BACKEND_HOST}/lms`; 

// --- TYPES ---
export interface ChatMember {
  id: number | string;
  name: string;
  role: string;
  avatar?: string | null;
  email?: string;
  isOnline?: boolean;
}

interface ChatProps {
  groupId: string;
  groupName: string;
  members?: ChatMember[];
  token: string | null;
  currentUser: {
    id: number | string;
    name: string;
    role?: string;
  };
  onClose?: () => void;
}

interface Attachment {
  type: 'image' | 'file';
  url: string;
  name: string;
  size?: number;
}

interface Message {
  id: number;
  sender: number | string;
  sender_name: string;
  sender_avatar: string | null;
  sender_role: string;
  content: string;
  timestamp: string;
  attachment?: Attachment;
}

interface PendingFile {
  file: File;
  preview?: string;
  type: 'image' | 'file';
}

// --- EMOJI DATA ---
const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '😜', '🤪', '😎', '🤩', '🥳', '😏', '😒', '🙄', '😬', '😮', '🤐', '😯', '😲', '😳', '🥺', '😢', '😭', '😤', '😠', '🤯', '😱', '🥵', '🥶', '😴', '🤮', '🤧', '😷', '🤒'],
  'Gestures': ['👍', '👎', '👌', '🤌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  'Objects': ['📚', '📖', '📝', '✏️', '📌', '📎', '🔗', '💻', '🖥️', '📱', '⌨️', '🖱️', '💡', '🔔', '📢', '🎓', '🏆', '🎯', '✅', '❌', '⭐', '🔥', '💯', '🚀', '⏰', '📅', '📊', '📈'],
};

// --- URL DETECTION REGEX ---
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

const GroupChat: React.FC<ChatProps> = ({ 
  groupId, 
  groupName, 
  members = [], 
  token, 
  currentUser, 
  onClose 
}) => {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [showMembers, setShowMembers] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Refs
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch History
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${HTTP_BASE}/group-chat-history/?group_id=${groupId}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
          setTimeout(scrollToBottom, 100);
        }
      } catch (error) { 
        console.error("History Error", error); 
      }
    };
    if (groupId && token) fetchHistory();
  }, [groupId, token]);

  // WebSocket Connection
  useEffect(() => {
    if (!groupId || !currentUser.id) return;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${BACKEND_HOST}/ws/groups/${groupId}/chat/`;

    const socket = new WebSocket(wsUrl);
    socket.onopen = () => setStatus('connected');
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message) {
          const incomingMsg = data.message;
          setMessages((prev) => [...prev, incomingMsg]);
          
          const isMe = String(incomingMsg.sender) === String(currentUser.id);
          if (isMe || !isUserScrolledUp) {
            setTimeout(scrollToBottom, 50);
          } else {
            setUnreadCount(prev => prev + 1);
            setShowScrollBottom(true);
          }
        }
      } catch (e) { 
        console.error(e); 
      }
    };
    
    socket.onclose = () => setStatus('disconnected');
    socket.onerror = () => setStatus('disconnected');
    socketRef.current = socket;
    return () => { socket.close(); };
  }, [groupId, currentUser.id, isUserScrolledUp]);

  // --- FILE UPLOAD ---
  const uploadFile = async (file: File): Promise<Attachment | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('group_id', groupId);

    try {
      const response = await fetch(`${HTTP_BASE}/upload-chat-file/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          type: file.type.startsWith('image/') ? 'image' : 'file',
          url: data.url,
          name: file.name,
          size: file.size,
        };
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    // Validate image types
    if (type === 'image' && !file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    setUploadError(null);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPendingFile({
          file,
          preview: e.target?.result as string,
          type: 'image'
        });
      };
      reader.readAsDataURL(file);
    } else {
      setPendingFile({
        file,
        type: 'file'
      });
    }

    // Reset input
    event.target.value = '';
  };

  const cancelPendingFile = () => {
    setPendingFile(null);
    setUploadError(null);
  };

  // --- HELPERS ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setUnreadCount(0);
    setShowScrollBottom(false);
  };

  const handleScroll = () => {
    if (!scrollViewportRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollViewportRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 150;
    setIsUserScrolledUp(isUp);
    if (!isUp) { 
      setUnreadCount(0); 
      setShowScrollBottom(false); 
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !pendingFile) || !socketRef.current || !currentUser.id) return;

    let attachment: Attachment | null = null;

    // Upload file if pending
    if (pendingFile) {
      setIsUploading(true);
      attachment = await uploadFile(pendingFile.file);
      setIsUploading(false);

      if (!attachment) {
        setUploadError('Failed to upload file. Please try again.');
        return;
      }
    }

    // Send message via WebSocket
    const messageData: any = {
      message: newMessage.trim() || (attachment ? `📎 ${attachment.name}` : ''),
      user_id: currentUser.id,
    };

    if (attachment) {
      messageData.attachment = attachment;
    }

    socketRef.current.send(JSON.stringify(messageData));
    
    setNewMessage('');
    setPendingFile(null);
    setUploadError(null);
    setTimeout(scrollToBottom, 50);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const insertEmoji = (emoji: string) => {
    const textarea = inputRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = newMessage;
      const before = text.substring(0, start);
      const after = text.substring(end);
      setNewMessage(before + emoji + after);
      
      // Focus and set cursor position after emoji
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      }, 0);
    } else {
      setNewMessage(prev => prev + emoji);
    }
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getAvatarUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://${BACKEND_HOST}${path}`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-violet-500 to-purple-600',
      'bg-gradient-to-br from-blue-500 to-cyan-600',
      'bg-gradient-to-br from-emerald-500 to-teal-600',
      'bg-gradient-to-br from-orange-500 to-amber-600',
      'bg-gradient-to-br from-pink-500 to-rose-600',
      'bg-gradient-to-br from-indigo-500 to-blue-600',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Render message content with clickable links
  const renderMessageContent = (content: string) => {
    const parts = content.split(URL_REGEX);
    
    return parts.map((part, index) => {
      if (part.match(URL_REGEX)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 dark:text-blue-300 hover:text-blue-300 dark:hover:text-blue-200 underline underline-offset-2 break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Group messages by date
  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    msgs.forEach(msg => {
      const date = new Date(msg.timestamp).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  // Filter messages by search
  const filteredMessages = searchQuery 
    ? messages.filter(m => 
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sender_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const messageGroups = groupMessagesByDate(filteredMessages);
  const onlineMembers = members.filter(m => m.isOnline !== false);

  return (
    // Main Container - Dark Mode: dark:bg-slate-900
    <div className="flex h-full bg-white dark:bg-slate-900 w-full overflow-hidden font-sans transition-colors duration-300">
      
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'file')}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
      />
      <input
        ref={imageInputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'image')}
        accept="image/*"
      />

      {/* =====================
          MAIN CHAT AREA
      ===================== */}
      <div className="flex flex-col flex-1 h-full relative">
        
        {/* --- SUB HEADER --- */}
        {/* Dark Mode: dark:bg-slate-900 dark:border-slate-800 */}
        <header className="flex items-center justify-between px-4 md:px-6 h-14 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                status === 'connected' ? 'bg-emerald-500' : 
                status === 'connecting' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
              }`} />
              {/* Text: dark:text-slate-400 */}
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {status === 'connected' ? 'Connected' : status === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {members.length} members
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-lg transition-colors ${
                showSearch 
                  // Active: dark:bg-indigo-900/30 dark:text-indigo-400
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
                  // Inactive: dark:hover:bg-slate-800 dark:text-slate-400
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Search size={18} />
            </button>
            <button 
              onClick={() => setShowMembers(!showMembers)}
              className={`p-2 rounded-lg transition-colors ${
                showMembers 
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Users size={18} />
            </button>
          </div>
        </header>

        {/* Search Bar - Dark Mode: dark:bg-slate-900 dark:border-slate-800 */}
        {showSearch && (
          <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <div className="relative max-w-lg">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // Input: dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:focus:border-indigo-500
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-slate-100 dark:placeholder-slate-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Found {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {/* --- MESSAGES AREA --- */}
        {/* Background: dark:from-slate-900 dark:to-slate-950 */}
        <div 
          ref={scrollViewportRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 md:px-6 py-6 bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-900 dark:to-slate-950 transition-colors"
        >
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-6 shadow-2xl shadow-indigo-500/30">
                <MessageCircle size={44} strokeWidth={1.5} />
              </div>
              {/* Text: dark:text-slate-100 */}
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Welcome to {groupName}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">
                Start the conversation by sending a message, sharing a file, or asking a question!
              </p>
            </div>
          )}

          {/* Messages */}
          {Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date} className="mb-6">
              {/* Date Divider */}
              <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                {/* Date Pill: dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 */}
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                  {formatDate(msgs[0].timestamp)}
                </span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              </div>

              {/* Message List */}
              <div className="space-y-1">
                {msgs.map((msg, idx) => {
                  const isMe = String(msg.sender) === String(currentUser.id);
                  const showAvatar = idx === 0 || msgs[idx - 1].sender !== msg.sender;
                  const isInstructor = ['team-leader', 'admin', 'instructor'].includes(msg.sender_role);

                  return (
                    <div 
                      key={msg.id || idx}
                      className={`group flex gap-3 py-1 px-2 -mx-2 rounded-lg hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${
                        showAvatar ? 'mt-4' : ''
                      } ${isMe ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-10 ${!showAvatar ? 'invisible' : ''}`}>
                        {msg.sender_avatar ? (
                          <img 
                            src={getAvatarUrl(msg.sender_avatar) || ''} 
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-white dark:ring-slate-700 shadow-md"
                            alt={msg.sender_name}
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md ${getAvatarColor(msg.sender_name)}`}>
                            {getInitials(msg.sender_name)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                        {showAvatar && !isMe && (
                          <div className="flex items-center gap-2 mb-1.5 px-1">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{msg.sender_name}</span>
                            {isInstructor && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold rounded-full">
                                <GraduationCap size={10} />
                                INSTRUCTOR
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400 dark:text-slate-500">{formatTime(msg.timestamp)}</span>
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div 
                          className={`relative px-4 py-3 text-[15px] leading-relaxed ${
                            isMe 
                              ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl rounded-tr-md shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/40' 
                              // Received Message: dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-md shadow-md border border-slate-100 dark:border-slate-700'
                          }`}
                        >
                          {/* Attachment */}
                          {msg.attachment && (
                            <div className="mb-2">
                              {msg.attachment.type === 'image' ? (
                                <img 
                                  src={getAvatarUrl(msg.attachment.url) || msg.attachment.url}
                                  alt={msg.attachment.name}
                                  className="max-w-full max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => setImagePreview(getAvatarUrl(msg.attachment!.url) || msg.attachment!.url)}
                                />
                              ) : (
                                <a 
                                  href={getAvatarUrl(msg.attachment.url) || msg.attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-3 p-3 rounded-lg ${
                                    // Attachment bg: dark:bg-slate-700
                                    isMe ? 'bg-indigo-400/30' : 'bg-slate-50 dark:bg-slate-700/50'
                                  } hover:opacity-80 transition-opacity`}
                                >
                                  <div className={`p-2 rounded-lg ${isMe ? 'bg-indigo-400/30' : 'bg-indigo-100 dark:bg-indigo-900/50'}`}>
                                    <File size={20} className={isMe ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${isMe ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                                      {msg.attachment.name}
                                    </p>
                                    {msg.attachment.size && (
                                      <p className={`text-xs ${isMe ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {formatFileSize(msg.attachment.size)}
                                      </p>
                                    )}
                                  </div>
                                  <Download size={18} className={isMe ? 'text-white' : 'text-slate-400 dark:text-slate-500'} />
                                </a>
                              )}
                            </div>
                          )}

                          {/* Text Content */}
                          {msg.content && !msg.content.startsWith('📎') && (
                            <p className="whitespace-pre-wrap break-words">
                              {renderMessageContent(msg.content)}
                            </p>
                          )}
                          
                          {/* Timestamp for own messages */}
                          {isMe && (
                            <div className="flex items-center justify-end gap-1.5 mt-1.5 -mb-0.5">
                              <span className="text-[10px] text-indigo-200">{formatTime(msg.timestamp)}</span>
                              <CheckCheck size={14} className="text-indigo-200" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to Bottom Button */}
        {showScrollBottom && (
          <button 
            onClick={scrollToBottom}
            // Button: dark:bg-slate-800 dark:border-slate-700
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-full px-5 py-2.5 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <ChevronDown size={18} className="text-slate-600 dark:text-slate-300" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {unreadCount > 0 ? `${unreadCount} new message${unreadCount > 1 ? 's' : ''}` : 'Jump to recent'}
            </span>
          </button>
        )}

        {/* --- INPUT AREA --- */}
        {/* Container: dark:bg-slate-900 dark:border-slate-800 */}
        <div className="px-4 md:px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
          
          {/* Pending File Preview - Dark Mode: dark:bg-slate-800 dark:border-slate-700 */}
          {pendingFile && (
            <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                {pendingFile.type === 'image' && pendingFile.preview ? (
                  <img src={pendingFile.preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                ) : (
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <File size={24} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{pendingFile.file.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatFileSize(pendingFile.file.size)}</p>
                </div>
                <button 
                  onClick={cancelPendingFile}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Upload Error */}
          {uploadError && (
            <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle size={18} />
              <span className="text-sm">{uploadError}</span>
              <button onClick={() => setUploadError(null)} className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded">
                <X size={16} />
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="relative">
            {/* Input Wrapper: dark:bg-slate-800 dark:border-slate-700 */}
            <div className="flex items-end gap-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:border-indigo-400 dark:focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all p-2">
              
              {/* Attachment Buttons (Commented out in original, kept commented) */}
              
              {/* Text Input - Dark Mode: dark:text-slate-100 dark:placeholder-slate-500 */}
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-[15px] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 py-2.5"
                style={{ minHeight: '24px', maxHeight: '120px' }}
                disabled={isUploading}
              />

              {/* Emoji & Send */}
              <div className="flex items-center gap-0.5 pb-0.5 relative">
                <div className="relative" ref={emojiPickerRef}>
                  <button 
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-2.5 rounded-xl transition-colors ${
                      showEmojiPicker 
                        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
                        : 'hover:bg-white dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                    title="Add emoji"
                  >
                    <Smile size={20} />
                  </button>

                  {/* Emoji Picker - Dark Mode: dark:bg-slate-800 dark:border-slate-700 */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 right-0 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 w-80 max-h-80 overflow-y-auto z-50">
                      {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                        <div key={category} className="mb-4">
                          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{category}</h4>
                          <div className="flex flex-wrap gap-1">
                            {emojis.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  insertEmoji(emoji);
                                  setShowEmojiPicker(false);
                                }}
                                className="w-8 h-8 flex items-center justify-center text-xl hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button 
                  type="submit"
                  disabled={(!newMessage.trim() && !pendingFile) || isUploading}
                  className={`p-3 rounded-xl transition-all ml-1 ${
                    (newMessage.trim() || pendingFile) && !isUploading
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl active:scale-95' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isUploading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </div>
            
            {/* Hints */}
            <div className="flex items-center justify-between mt-2 px-2">
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 dark:text-slate-400 font-mono text-[10px]">Enter</kbd>
                <span className="mx-1">to send</span>
                <span className="text-slate-300 dark:text-slate-700 mx-1">•</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 dark:text-slate-400 font-mono text-[10px]">Shift+Enter</kbd>
                <span className="mx-1">new line</span>
              </p>
              {newMessage.length > 0 && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500">{newMessage.length} chars</span>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* =====================
          MEMBERS SIDEBAR
      ===================== */}
      {/* Sidebar: dark:bg-slate-900 dark:border-slate-800 */}
      <aside 
        className={`fixed lg:relative inset-y-0 right-0 w-full sm:w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 z-50 lg:z-auto ${
          showMembers ? 'translate-x-0 shadow-2xl lg:shadow-none' : 'translate-x-full lg:w-0 lg:border-0 lg:overflow-hidden'
        }`}
      >
        {/* Header: dark:bg-slate-900 dark:border-slate-800 */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 flex-shrink-0 bg-slate-50 dark:bg-slate-900">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Participants ({members.length})</h2>
          <button onClick={() => setShowMembers(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Instructors */}
          {members.filter(m => ['team-leader', 'admin', 'instructor'].includes(m.role)).length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <GraduationCap size={14} />
                Instructors
              </h3>
              <div className="space-y-1">
                {members.filter(m => ['team-leader', 'admin', 'instructor'].includes(m.role)).map((member) => (
                  <MemberItem 
                    key={member.id} 
                    member={member} 
                    currentUser={currentUser} 
                    getAvatarUrl={getAvatarUrl}
                    getAvatarColor={getAvatarColor}
                    getInitials={getInitials}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Students */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Users size={14} />
              Students ({members.filter(m => !['team-leader', 'admin', 'instructor'].includes(m.role)).length})
            </h3>
            <div className="space-y-1">
              {members.filter(m => !['team-leader', 'admin', 'instructor'].includes(m.role)).map((member) => (
                <MemberItem 
                  key={member.id} 
                  member={member} 
                  currentUser={currentUser} 
                  getAvatarUrl={getAvatarUrl}
                  getAvatarColor={getAvatarColor}
                  getInitials={getInitials}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {showMembers && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setShowMembers(false)} />
      )}

      {/* Image Preview Modal */}
      {imagePreview && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setImagePreview(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
            onClick={() => setImagePreview(null)}
          >
            <X size={24} />
          </button>
          <img src={imagePreview} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
};

// Member Item Component - Updated for Dark Mode
const MemberItem: React.FC<{
  member: ChatMember;
  currentUser: { id: number | string };
  getAvatarUrl: (path?: string | null) => string | null;
  getAvatarColor: (name: string) => string;
  getInitials: (name: string) => string;
}> = ({ member, currentUser, getAvatarUrl, getAvatarColor, getInitials }) => {
  const isMe = String(member.id) === String(currentUser.id);
  
  return (
    // Hover: dark:hover:bg-slate-800
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
      <div className="relative">
        {member.avatar ? (
          <img 
            src={getAvatarUrl(member.avatar) || ''} 
            className="w-10 h-10 rounded-xl object-cover"
            alt={member.name}
          />
        ) : (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold ${getAvatarColor(member.name)}`}>
            {getInitials(member.name)}
          </div>
        )}
        {/* Status Dot: dark:border-slate-800 */}
        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${
          member.isOnline ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
        }`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate block">
          {isMe ? `${member.name} (You)` : member.name}
        </span>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{member.email}</p>
      </div>
    </div>
  );
};

export default GroupChat;