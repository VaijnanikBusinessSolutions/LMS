// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { ArrowLeft, MessageSquare, Maximize2, BookOpen, Users } from 'lucide-react';
// import type { RootState } from '../../store/store'; 
// import type { ChatMember } from './GroupChat';
// import GroupChat from './GroupChat';


// const API_BASE = 'http://127.0.0.1:8000/lms';

// interface UserUI { id: number; email: string; firstName?: string; lastName?: string; profileImage?: string; role?: string; }
// interface GroupDetail { id: number; name: string; description: string; course_title: string; course: number; team_leaders: UserUI[]; employees: UserUI[]; created_at: string; }

// const EmployeeGroupView: React.FC = () => {
//   const { groupId } = useParams<{ groupId: string }>();
//   const navigate = useNavigate();
//   const { accessToken: token, user } = useSelector((state: RootState) => state.auth);
  
//   const [group, setGroup] = useState<GroupDetail | null>(null);
//   const [membersList, setMembersList] = useState<ChatMember[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // Default: Closed on Mobile, Open on Desktop
//   const [isChatOpen, setIsChatOpen] = useState(window.innerWidth > 1024); 

//   useEffect(() => {
//     if (!groupId) return;
//     const fetchGroupData = async () => {
//       try {
//         const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
//         const groupResp = await fetch(`${API_BASE}/groups/${groupId}/`, { headers });
//         if(groupResp.ok) {
//             const data = await groupResp.json();
//             setGroup(data);

//             const leaders = (data.team_leaders || []).map((u: UserUI) => ({
//                 id: u.id, name: `${u.firstName} ${u.lastName}`, role: 'team-leader', avatar: u.profileImage, email: u.email
//             }));
//             const students = (data.employees || []).map((u: UserUI) => ({
//                 id: u.id, name: `${u.firstName} ${u.lastName}`, role: 'employee', avatar: u.profileImage, email: u.email
//             }));
//             setMembersList([...leaders, ...students]);
//         }
//       } catch (error) { console.error(error); } finally { setLoading(false); }
//     };
//     fetchGroupData();
//   }, [groupId, token]);

//   if (loading) return <div className="p-8 text-center">Loading...</div>;
//   if (!group) return <div className="p-8 text-center">Group not found</div>;

//   return (
//     <div className="bg-[#dcdcdc] min-h-screen flex flex-col h-screen overflow-hidden">
      
//       {/* --- HEADER --- */}
//       <div className="bg-[#008069] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0 z-20">
//         <div className="flex items-center gap-4">
//             <button onClick={() => navigate('/lms/groups')} className="hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={20} /></button>
//             <div className="overflow-hidden">
//                 <h1 className="text-lg font-semibold leading-tight truncate">{group.name}</h1>
//                 <p className="text-xs text-green-100 opacity-90 truncate">{group.course_title}</p>
//             </div>
//         </div>
//         <button onClick={() => setIsChatOpen(!isChatOpen)} className={`flex items-center gap-2 px-3 py-2 sm:px-4 rounded transition-colors ${isChatOpen ? 'bg-white text-[#008069] font-bold' : 'hover:bg-white/10 text-white'}`}>
//             <MessageSquare size={18} /><span className="text-sm hidden sm:inline">Class Chat</span>
//         </button>
//       </div>

//       {/* --- MAIN CONTENT --- */}
//       <div className="flex flex-1 overflow-hidden relative p-0 sm:p-4 gap-4">
        
//         {/* LEFT: Course Details */}
//         <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm flex flex-col">
//             <div className="bg-black aspect-video w-full flex items-center justify-center relative group">
//                 <div className="text-gray-400 flex flex-col items-center z-10">
//                     <Maximize2 size={48} className="mb-2 opacity-50"/>
//                     <p className="font-medium">Live Stream Area</p>
//                 </div>
//             </div>
//             <div className="p-4 sm:p-6">
//                 <h2 className="font-bold text-gray-800 text-xl mb-4">{group.course_title}</h2>
//                 <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">{group.description}</p>
//                 <div className="border-t pt-4">
//                     <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Users size={18}/> Class Members</h3>
//                     <div className="flex flex-wrap gap-2">
//                         {membersList.slice(0,6).map((e, i) => (
//                              <div key={i} title={e.name} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 border border-white shadow-sm overflow-hidden">
//                                 {e.avatar ? <img src={e.avatar.startsWith('http') ? e.avatar : `http://127.0.0.1:8000${e.avatar}`} className="w-full h-full object-cover"/> : e.name.charAt(0)}
//                              </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>

//         {/* RIGHT: Chat Sidebar (Responsive) */}
//         {/* Mobile: Full Screen Fixed | Desktop: Static Side Panel */}
//         {isChatOpen && (
//             <div className="fixed inset-0 z-50 lg:static lg:inset-auto w-full lg:w-[400px] shrink-0 h-full flex flex-col shadow-lg lg:rounded-lg overflow-hidden border-gray-300">
//                 {user && (
//                     <GroupChat 
//                         groupId={groupId!}
//                         groupName={group.name}
//                         members={membersList}
//                         token={token}
//                         currentUser={{
//                             id: user.id || (user as any).user_id || 0,
//                             name: `${user.first_name || ''} ${user.last_name || ''}`,
//                             role: user.role
//                         }}
//                         onClose={() => setIsChatOpen(false)} // Pass Close handler for mobile
//                     />
//                 )}
//             </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeeGroupView;




import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Hash, Settings, Bell, MoreVertical } from 'lucide-react';
import type { RootState } from '../../store/store'; 
import type { ChatMember } from './GroupChat';
import GroupChat from './GroupChat';

const API_BASE = 'http://127.0.0.1:8000/lms';

interface UserUI { 
  id: number; 
  email: string; 
  firstName?: string; 
  lastName?: string; 
  profileImage?: string; 
  role?: string; 
}

interface GroupDetail { 
  id: number; 
  name: string; 
  description: string; 
  course_title: string; 
  course: number; 
  team_leaders: UserUI[]; 
  employees: UserUI[]; 
  created_at: string; 
}

const EmployeeGroupView: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { accessToken: token, user } = useSelector((state: RootState) => state.auth);
  
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [membersList, setMembersList] = useState<ChatMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;
    const fetchGroupData = async () => {
      try {
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
        const groupResp = await fetch(`${API_BASE}/groups/${groupId}/`, { headers });
        if(groupResp.ok) {
          const data = await groupResp.json();
          setGroup(data);

          const leaders = (data.team_leaders || []).map((u: UserUI) => ({
            id: u.id, 
            name: `${u.firstName} ${u.lastName}`, 
            role: 'team-leader', 
            avatar: u.profileImage, 
            email: u.email,
            isOnline: true
          }));
          const students = (data.employees || []).map((u: UserUI) => ({
            id: u.id, 
            name: `${u.firstName} ${u.lastName}`, 
            role: 'employee', 
            avatar: u.profileImage, 
            email: u.email,
            isOnline: Math.random() > 0.3 // Mock online status
          }));
          setMembersList([...leaders, ...students]);
        }
      } catch (error) { 
        console.error(error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchGroupData();
  }, [groupId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading discussion...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Hash size={40} className="text-slate-600" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Group Not Found</h2>
          <p className="text-slate-400 mb-6">The discussion group you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/lms/groups')}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen bg-slate-100 flex flex-col overflow-hidden">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="bg-white border-b border-slate-200 px-4 lg:px-6 h-16 flex items-center justify-between flex-shrink-0 z-30">
        
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/lms/groups')} 
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="hidden sm:block w-px h-8 bg-slate-200" />
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Hash size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-slate-900 text-base leading-tight">
                {group.name}
              </h1>
              <p className="text-xs text-slate-500">{group.course_title}</p>
            </div>
          </div>
        </div>
        
        {/* Right Side */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700">
            <Bell size={20} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700">
            <Settings size={20} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700">
            <MoreVertical size={20} />
          </button>
        </div>
      </nav>

      {/* --- FULL SCREEN CHAT --- */}
      <div className="flex-1 overflow-hidden">
        {user && (
          <GroupChat 
            groupId={groupId!}
            groupName={group.name}
            members={membersList}
            token={token}
            currentUser={{
              id: user.id || (user as any).user_id || 0,
              name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
              role: user.role
            }}
            onClose={() => navigate('/lms/groups')}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeGroupView;