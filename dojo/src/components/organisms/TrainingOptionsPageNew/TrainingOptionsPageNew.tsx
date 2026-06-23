// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//     CheckCircle,
//     GraduationCap,
//     Calendar,
//     Plus,
//     Upload,
//     File as FileIcon,
//     Video as VideoIcon,
//     Image as ImageIcon,
//     ExternalLink,
//     Trash2,
//     FolderOpen,
//     BookOpen,
//     Sparkles,
//     Target,
//     Users,
//     Clock,
//     AlertCircle,
//     ClipboardList
// } from 'lucide-react';

// interface TrainingTopic {
//     id: number;
//     topic_name: string;
//     level: number;
//     level_name?: string;
//     station: number;
//     station_name?: string;
// }

// interface TrainingContent {
//     id: number;
//     topic: number;
//     topic_name?: string;
//     level: number;
//     level_name?: string;
//     station: number;
//     station_name?: string;
//     content_name: string;
//     file: string | null;
//     url: string | null;
//     updated_at: string;
// }

// interface LocationState {
//     stationId: number;
//     stationName: string;
//     sublineId: number | null;
//     sublineName: string | null;
//     lineId: number | null;
//     lineName: string | null;
//     departmentId: number;
//     departmentName: string | null;
//     levelId: number;
//     levelName: string;
// }

// const iconMap = {
//     CheckCircle,
//     GraduationCap,
//     Calendar,
//     ClipboardList
// };

// const moduleColors = {
//     'Evaluation Test': {
//         bg: 'from-blue-500 via-blue-600 to-indigo-600',
//         light: 'from-blue-50 to-indigo-50',
//         border: 'border-blue-200',
//         text: 'text-blue-600',
//         shadow: 'shadow-blue-500/25',
//         glow: 'shadow-blue-500/50'
//     },
//     'On-Job Training': {
//         bg: 'from-green-500 via-emerald-600 to-teal-600',
//         light: 'from-green-50 to-emerald-50',
//         border: 'border-green-200',
//         text: 'text-green-600',
//         shadow: 'shadow-green-500/25',
//         glow: 'shadow-green-500/50'
//     },
//     'Ten Cycle': {
//         bg: 'from-purple-500 via-violet-600 to-indigo-600',
//         light: 'from-purple-50 to-violet-50',
//         border: 'border-purple-200',
//         text: 'text-purple-600',
//         shadow: 'shadow-purple-500/25',
//         glow: 'shadow-purple-500/50'
//     },
//      'Skill Evaluation': {
//         bg: 'from-amber-500 via-orange-600 to-red-600',
//         light: 'from-amber-50 to-orange-50',
//         border: 'border-amber-200',
//         text: 'text-amber-600',
//         shadow: 'shadow-amber-500/25',
//         glow: 'shadow-amber-500/50'
//     },
//     'Others': {
//         bg: 'from-orange-500 via-amber-600 to-yellow-600',
//         light: 'from-orange-50 to-amber-50',
//         border: 'border-orange-200',
//         text: 'text-orange-600',
//         shadow: 'shadow-orange-500/25',
//         glow: 'shadow-orange-500/50'
//     },
//     'Maru A': {
//     bg: 'from-red-500 via-rose-600 to-pink-600',
//     light: 'from-red-50 to-pink-50',
//     border: 'border-red-200',
//     text: 'text-red-600',
//     shadow: 'shadow-red-500/25',
//     glow: 'shadow-red-500/50'
// },

// };

// export const TrainingOptionsPageNew: React.FC = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const locationState = (location.state as LocationState) || undefined;
    
//     // State
//     const [topics, setTopics] = useState<TrainingTopic[]>([]);
//     const [contents, setContents] = useState<TrainingContent[]>([]);
//     const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
//     const [loading, setLoading] = useState(false);

//     // form
//     const [newTopicName, setNewTopicName] = useState('');
//     const [newContentName, setNewContentName] = useState('');
//     const [newContentFile, setNewContentFile] = useState<File | null>(null);
//     const [newContentUrl, setNewContentUrl] = useState('');

//     // composite config state
//     const [compositeConfigs, setCompositeConfigs] = useState<any | null>(null);
//     const [compositeLoading, setCompositeLoading] = useState(false);

//     const API_BASE_URL = 'http://localhost:8000';

//     const CONFIGS_BASE = `${API_BASE_URL}/station-sheet-configs`;
//     const CONFIGS_BY_COMPOSITE = `${CONFIGS_BASE}/by-composite/`;

//     async function fetchByComposite(
//         level_id: number,
//         department_id: number,
//         line_id: number | null,
//         subline_id: number | null,
//         station_id: number
//     ) {
//         const params = new URLSearchParams();
//         params.set('level_id', String(level_id));
//         params.set('department_id', String(department_id));
//         if (line_id !== null && line_id !== undefined) params.set('line_id', String(line_id));
//         if (subline_id !== null && subline_id !== undefined) params.set('subline_id', String(subline_id));
//         params.set('station_id', String(station_id));

//         const url = `${CONFIGS_BY_COMPOSITE}?${params.toString()}`;
//         const resp = await fetch(url, { method: 'GET' });
//         if (resp.status === 404) return null;
//         if (!resp.ok) {
//             const text = await resp.text();
//             throw new Error(`fetchByComposite error: ${resp.status} ${text}`);
//         }
//         return resp.json();
//     }

//     useEffect(() => {
//         // require the necessary parts of locationState
//         if (!locationState || !locationState.levelId || !locationState.departmentId || !locationState.stationId) {
//             setCompositeConfigs(null);
//             return;
//         }

//         let mounted = true;
//         setCompositeLoading(true);

//         (async () => {
//             try {
//                 const resp = await fetchByComposite(
//                     locationState.levelId,
//                     locationState.departmentId,
//                     locationState.lineId ?? null,
//                     locationState.sublineId ?? null,
//                     locationState.stationId
//                 );

//                 if (!mounted) return;
//                 if (resp === null) {
//                     setCompositeConfigs(null);
//                 } else {
//                     setCompositeConfigs(resp);
//                 }
//             } catch (err: any) {
//                 if (!mounted) return;
//                 console.error('fetchByComposite failed:', err);
//                 setCompositeConfigs(null);
//             } finally {
//                 if (mounted) setCompositeLoading(false);
//             }
//         })();

//         return () => { mounted = false; };
//     }, [
//         locationState?.levelId,
//         locationState?.departmentId,
//         locationState?.lineId,
//         locationState?.sublineId,
//         locationState?.stationId
//     ]);

//     // fetch topics - now filters by level and station
//     const fetchTopics = async () => {
//         if (!locationState?.stationId || !locationState?.levelId) return;

//         try {
//             const params = new URLSearchParams({
//                 level_id: locationState.levelId.toString(),
//                 station_id: locationState.stationId.toString()
//             });

//             const res = await fetch(`${API_BASE_URL}/training_topics/?${params}`);
//             if (res.ok) {
//                 const data: TrainingTopic[] = await res.json();
//                 setTopics(data);
//                 if (data.length > 0 && !selectedTopic) setSelectedTopic(data[0].id);
//             } else {
//                 console.error('fetchTopics failed:', res.statusText);
//             }
//         } catch (err) {
//             console.error('fetchTopics error:', err);
//         }
//     };

//     // fetch contents
//     const fetchContents = async () => {
//         if (!locationState?.stationId || !locationState?.levelId) return;

//         try {
//             const params = new URLSearchParams({
//                 level_id: locationState.levelId.toString(),
//                 station_id: locationState.stationId.toString(),
//                 ...(selectedTopic && { topic_id: selectedTopic.toString() })
//             });

//             const res = await fetch(`${API_BASE_URL}/levelwise-training-contents/by_level_station_topic/?${params}`);
//             if (res.ok) {
//                 const data: TrainingContent[] = await res.json();
//                 setContents(data);
//             } else {
//                 console.error('fetchContents failed:', res.statusText);
//             }
//         } catch (err) {
//             console.error('fetchContents error:', err);
//         }
//     };

//     // Updated useEffect to only fetch topics when we have required location state
//     useEffect(() => {
//         if (locationState?.stationId && locationState?.levelId && !compositeLoading) {
//             fetchTopics();
//         }
//     }, [locationState?.stationId, locationState?.levelId, compositeLoading]);

//     useEffect(() => {
//         if (!compositeLoading) {
//             fetchContents();
//         }
//     }, [selectedTopic, locationState, compositeLoading]);

//     // helper to decide if a module is enabled by composite config
//     const isModuleEnabled = (moduleId: string) => {
//         // If compositeConfigs is not loaded yet, keep previous behavior: show modules.
//         if (!compositeConfigs) return true;

//         const mapping: Record<string, boolean> = {
//             'evaluation': Boolean(compositeConfigs?.evaluation_enabled),
//             'ojt': Boolean(compositeConfigs?.ojt_enabled),
//             'ten-cycle': Boolean(compositeConfigs?.ten_cycle_enabled),
//             'skill-evaluation': Boolean(compositeConfigs?.skill_evaluation_enabled),
//             'maru-a': Boolean(compositeConfigs?.maru_a_enabled),
//             'others': Boolean(compositeConfigs?.others_enabled),
//         };
//         return mapping[moduleId] ?? true;
//     };

//     // Validation for required location state
//     if (!locationState?.stationId || !locationState?.levelId) {
//         return (
//             <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex min-h-screen items-center justify-center">
//                 <div className="text-center p-8">
//                     <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl flex items-center justify-center">
//                         <AlertCircle size={48} className="text-red-500" />
//                     </div>
//                     <h2 className="text-2xl font-bold text-gray-900 mb-4">Missing Required Information</h2>
//                     <p className="text-gray-600 mb-6">Station ID and Level ID are required to manage training topics.</p>
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
//                     >
//                         Go Back
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     // Show loading state while fetching composite configs
//     if (compositeLoading) {
//         return (
//             <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex min-h-screen items-center justify-center">
//                 <div className="text-center p-8">
//                     <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center animate-pulse">
//                         <Sparkles size={48} className="text-indigo-500 animate-spin" />
//                     </div>
//                     <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Configuration</h2>
//                     <p className="text-gray-600">Please wait while we fetch your training settings...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Navigation handlers
//     const handleEvaluationTestClick = () => {
//         navigate("/ExamModeSelector", {
//             state: {
//                 stationId: locationState?.stationId,
//                 stationName: locationState?.stationName,
//                 departmentName: locationState?.departmentName,
//                 levelId: locationState?.levelId,
//                 levelName: locationState?.levelName
//             }
//         });
//     };

//     const handleTenCycleClick = () => navigate("/OjtSearch", { state: { ...location.state, nextpage: "tencycle" } });

//     const handleOJTClick = () => {
//         navigate("/OjtSearch", { state: { ...location.state, } });
//     };

//     const handleSkillMatrixClick = () => {
//         // Navigate to the desired page, passing state if needed
//         navigate("/OjtSearch", { state: { ...location.state, nextpage: "skillevaluation" } });
//     };
//     const handleMaruAClick = () => {
//     navigate("/OjtSearch", { 
//         state: { 
//             ...location.state, 
//             nextpage: "marua" 
//         } 
//     });
// };
// const handleOthersClick = () => {
//     navigate("/OjtSearch", { 
//         state: { 
//             ...location.state, 
//             nextpage: "others" 
//         } 
//     });
// };

//     // addTopic - now includes level and station
//     const addTopic = async () => {
//         if (!newTopicName.trim() || !locationState?.stationId || !locationState?.levelId) {
//             console.error('Missing required data: topic name, station ID, or level ID');
//             return;
//         }

//         setLoading(true);
//         try {
//             const res = await fetch(`${API_BASE_URL}/training_topics/`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     topic_name: newTopicName.trim(),
//                     level: locationState.levelId,
//                     station: locationState.stationId
//                 })
//             });

//             if (res.ok) {
//                 const newTopic = await res.json();
//                 setTopics(prev => [...prev, newTopic]);
//                 setSelectedTopic(newTopic.id);
//                 setNewTopicName('');
//             } else {
//                 const errorData = await res.json().catch(() => ({}));
//                 console.error('addTopic failed:', res.statusText, errorData);
//             }
//         } catch (err) {
//             console.error('addTopic error:', err);
//         }
//         setLoading(false);
//     };

//     const addContent = async () => {
//         if (!newContentName.trim() || !selectedTopic || !locationState?.stationId || !locationState?.levelId) return;

//         setLoading(true);
//         try {
//             const form = new FormData();
//             form.append('topic', selectedTopic.toString());
//             form.append('level', locationState.levelId.toString());
//             form.append('station', locationState.stationId.toString());
//             form.append('content_name', newContentName.trim());

//             if (newContentFile) form.append('file', newContentFile);
//             if (newContentUrl.trim()) form.append('url', newContentUrl.trim());

//             const res = await fetch(`${API_BASE_URL}/levelwise-training-contents/`, {
//                 method: 'POST',
//                 body: form
//             });

//             if (res.ok) {
//                 setNewContentName('');
//                 setNewContentFile(null);
//                 setNewContentUrl('');
//                 fetchContents();
//             } else {
//                 console.error('addContent failed:', res.statusText);
//             }
//         } catch (err) {
//             console.error('addContent error:', err);
//         }
//         setLoading(false);
//     };

//     const deleteContent = async (id: number) => {
//         if (!confirm('Are you sure you want to delete this content?')) return;
//         try {
//             const res = await fetch(`${API_BASE_URL}/levelwise-training-contents/${id}/`, { method: 'DELETE' });
//             if (res.ok) fetchContents();
//             else console.error('deleteContent failed:', res.statusText);
//         } catch (err) {
//             console.error('deleteContent error:', err);
//         }
//     };

//     const deleteTopic = async (id: number) => {
//         if (!confirm('Delete this topic and all contents?')) return;

//         try {
//             const res = await fetch(`${API_BASE_URL}/training_topics/${id}/`, {
//                 method: 'DELETE'
//             });

//             if (res.ok) {
//                 const updated = topics.filter(t => t.id !== id);
//                 setTopics(updated);

//                 if (selectedTopic === id) {
//                     setSelectedTopic(updated.length ? updated[0].id : null);
//                 }

//                 fetchContents();
//             } else {
//                 console.error('deleteTopic failed:', res.statusText);
//             }
//         } catch (err) {
//             console.error('deleteTopic error:', err);
//         }
//     };

//     const getFileIcon = (content: TrainingContent) => {
//         if (content.file) {
//             const ext = content.file.split('.').pop()?.toLowerCase();
//             if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) return VideoIcon;
//             if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return ImageIcon;
//             return FileIcon;
//         }
//         return FileIcon;
//     };

//     const currentTopic = topics.find(t => t.id === selectedTopic) || null;
//     const currentContents = selectedTopic ? contents.filter(c => c.topic === selectedTopic) : [];

//     return (
//         <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex min-h-screen">
//             {/* Enhanced Sidebar */}
//             <div className="w-96 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/20 flex flex-col relative overflow-hidden">
//                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-pink-600/5"></div>
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
//                 <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/10 to-cyan-400/10 rounded-full blur-2xl"></div>

//                 <div className="relative z-10 p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
//                     <div className="flex items-center gap-4 mb-3">
//                         <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
//                             <Sparkles size={28} className="text-white" />
//                         </div>
//                         <div>
//                             <h3 className="text-xl font-bold">Training Topics</h3>
//                             <p className="text-indigo-100 text-sm">Organize your content</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="relative z-10 p-6 bg-gradient-to-r from-gray-50/90 to-white/90 backdrop-blur-sm border-b border-gray-200/50">
//                     <div className="flex gap-3">
//                         <input
//                             type="text"
//                             value={newTopicName}
//                             onChange={(e) => setNewTopicName(e.target.value)}
//                             placeholder="Create new topic..."
//                             onKeyDown={(e) => e.key === 'Enter' && addTopic()}
//                             className="flex-1 px-4 py-3 text-sm bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent shadow-lg transition-all duration-300 placeholder-gray-400"
//                         />
//                         <button
//                             onClick={addTopic}
//                             disabled={loading}
//                             className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
//                         >
//                             <Plus size={18} />
//                         </button>
//                     </div>
//                 </div>

//                 <div className="relative z-10 flex-1 overflow-y-auto">
//                     {topics.length === 0 ? (
//                         <div className="p-8 text-center">
//                             <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center">
//                                 <BookOpen size={40} className="text-indigo-400" />
//                             </div>
//                             <p className="text-gray-600 font-semibold text-lg mb-2">No topics yet</p>
//                             <p className="text-gray-400 text-sm">Create your first training topic above</p>
//                         </div>
//                     ) : (
//                         <div className="p-4 space-y-3">
//                             {topics.map((topic, idx) => {
//                                 return (
//                                     <div
//                                         key={topic.id}
//                                         onClick={() => setSelectedTopic(topic.id)}
//                                         className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 group overflow-hidden ${selectedTopic === topic.id
//                                             ? 'bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 shadow-xl transform scale-[1.02]'
//                                             : 'bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-lg border border-gray-200/50'
//                                             }`}
//                                     >
//                                         {selectedTopic === topic.id && (
//                                             <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl"></div>
//                                         )}

//                                         <div className="relative z-10 flex items-center justify-between">
//                                             <div className="flex items-center gap-4 flex-1">
//                                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${selectedTopic === topic.id
//                                                     ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
//                                                     : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 group-hover:from-indigo-100 group-hover:to-purple-100'
//                                                     }`}>
//                                                     {idx + 1}
//                                                 </div>
//                                                 <div className="flex-1">
//                                                     <h4 className="font-bold text-gray-900 text-lg mb-1">{topic.topic_name}</h4>
//                                                     <p className="text-sm text-gray-500">{topic.level_name} - {topic.station_name}</p>
//                                                 </div>
//                                             </div>
//                                             <button
//                                                 onClick={(e) => { e.stopPropagation(); deleteTopic(topic.id); }}
//                                                 className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
//                                             >
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Enhanced Main Content */}
//             <div className="flex-1 flex flex-col relative overflow-hidden">
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>
//                 <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
//                 <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-indigo-400/5 to-pink-400/5 rounded-full blur-3xl"></div>

//                 {/* Enhanced Station Header */}
//                 <div className="relative z-10 bg-white/80 backdrop-blur-xl shadow-xl border-b border-white/20 p-8">
//                     <div className="max-w-7xl mx-auto flex items-center justify-between">
//                         <div className="flex items-center gap-6">
//                             <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl">
//                                 <Target size={32} className="text-white" />
//                             </div>
//                             <div>
//                                 <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-2">{locationState?.stationName || 'Training Station'}</h1>
//                                 <p className="text-gray-600 text-lg">{locationState?.levelName} - {locationState?.departmentName}</p>
//                             </div>
//                         </div>

//                         <div className="text-right">
//                             <div className="flex items-center gap-4 mb-2">
//                                 <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl">
//                                     <Users size={24} className="text-indigo-600" />
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-500 font-medium">Training Topics</p>
//                                     <p className="text-3xl font-bold text-indigo-600">{topics.length}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="relative z-10 flex-1 p-8 overflow-y-auto">
//                     <div className="max-w-7xl mx-auto">
//                         {/* Training Modules */}
//                         <div className="mb-10">
//                             {!currentTopic ? (
//                                 <>
//                                     <div className="text-center mb-12">
//                                         <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4">
//                                             Training Pathways
//                                         </h2>
//                                         <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//                                             Choose your learning journey and unlock your potential with our comprehensive training modules
//                                         </p>
//                                     </div>

//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
//                                         {[
//                                             {
//                                                 id: 'evaluation',
//                                                 name: 'Evaluation Test',
//                                                 description: 'Comprehensive assessment and evaluation system',
//                                                 icon: 'CheckCircle'
//                                             },
//                                             {
//                                                 id: 'ojt',
//                                                 name: 'On-Job Training',
//                                                 description: 'Hands-on practical training experience',
//                                                 icon: 'GraduationCap'
//                                             },
//                                             {
//                                                 id: 'ten-cycle',
//                                                 name: 'Ten Cycle',
//                                                 description: 'Systematic ten-step training methodology',
//                                                 icon: 'Calendar'
//                                             },
//                                               {
//                                                 id: 'skill-evaluation',
//                                                 name: 'Skill Evaluation',
//                                                 description: 'Track and manage employee skills and progress',
//                                                 icon: 'ClipboardList'
//                                             },
//                                             {
//                                                 id: 'others',
//                                                 name: 'Others',
//                                                 description: 'Miscellaneous training materials and documents',
//                                                 icon: 'ClipboardList'
//                                             },
//                                             {
//                                                 id: 'maru-a',                              // ← NEW: Maru A
//                                                 name: 'Maru A',
//                                                 description: 'Final approval & independent operation certification',
//                                                 icon: 'CheckCircle'
//                                             },
//                                                                                 ]
//                                         .filter(m => isModuleEnabled(m.id))
//                                         .map((module) => {
//                                             const IconComponent = iconMap[module.icon as keyof typeof iconMap];
//                                             const colors = moduleColors[module.name as keyof typeof moduleColors] || moduleColors['Evaluation Test'];

//                                             return (
//                                                 <div
//                                                     key={module.id}
//                                                     className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-8 text-center overflow-hidden transform hover:-translate-y-3 border border-white/20"
//                                                 >
//                                                     <div className={`absolute inset-0 bg-gradient-to-br ${colors.light} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
//                                                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"></div>

//                                                     <div className="relative z-10">
//                                                         <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500 ${colors.shadow} shadow-2xl`}>
//                                                             {IconComponent && (
//                                                                 <IconComponent
//                                                                     size={56}
//                                                                     className="text-white group-hover:scale-110 transition-transform duration-500"
//                                                                 />
//                                                             )}
//                                                         </div>

//                                                         <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-700 transition-colors duration-300">
//                                                             {module.name}
//                                                         </h3>
//                                                         <p className="text-gray-600 mb-6 leading-relaxed text-lg">{module.description}</p>

//                                                         <div className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${colors.light} ${colors.border} border rounded-2xl text-sm font-semibold ${colors.text} shadow-lg`}>
//                                                             <BookOpen size={18} />
//                                                             {topics.filter(t => t.topic_name.toLowerCase().includes(module.name.toLowerCase())).length || 0} topics available
//                                                         </div>

//                                                         <button
//                                                             onClick={() => {
//                                                                 if (module.id === 'evaluation') handleEvaluationTestClick();
//                                                                 else if (module.id === 'ten-cycle') handleTenCycleClick();
//                                                                 else if (module.id === 'ojt') handleOJTClick();
//                                                                 else if (module.id === 'skill-evaluation') handleSkillMatrixClick();
//                                                                 else if (module.id === 'others') handleOthersClick();
//                                                                 else if (module.id === 'maru-a') handleMaruAClick();
//                                                             }}
//                                                             className={`mt-6 w-full py-4 bg-gradient-to-r ${colors.bg} text-white rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
//                                                         >
//                                                             Start Learning
//                                                         </button>
//                                                     </div>

//                                                     <div className={`absolute inset-0 bg-gradient-to-t ${colors.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>

//                                     {topics.length > 0 && (
//                                         <div className="text-center">
//                                             <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/80 backdrop-blur-xl border border-indigo-200/50 rounded-2xl text-indigo-700 shadow-xl">
//                                                 <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
//                                                     <FolderOpen size={24} className="text-indigo-600" />
//                                                 </div>
//                                                 <div className="text-left">
//                                                     <p className="font-bold text-lg">
//                                                         {topics.length} Training Topic{topics.length !== 1 ? 's' : ''}
//                                                     </p>
//                                                     <p className="text-sm text-indigo-600">Available in sidebar for detailed study</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </>
//                             ) : (
//                                 <div className="mb-8">
//                                     <div className="flex items-center justify-between mb-6">
//                                         <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
//                                             Training Modules
//                                         </h2>
//                                         <p className="text-gray-600">Quick access to all training options</p>
//                                     </div>

//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                         {[
//                                             {
//                                                 id: 'evaluation',
//                                                 name: 'Evaluation Test',
//                                                 description: 'Assessment and evaluation',
//                                                 icon: 'CheckCircle'
//                                             },
//                                             {
//                                                 id: 'ojt',
//                                                 name: 'On-Job Training',
//                                                 description: 'Practical training experience',
//                                                 icon: 'GraduationCap'
//                                             },
//                                             {
//                                                 id: 'ten-cycle',
//                                                 name: 'Ten Cycle',
//                                                 description: 'Systematic training methodology',
//                                                 icon: 'Calendar'
//                                             },
//                                               {
//                                                 id: 'skill-evaluation',
//                                                 name: 'Skill Evaluation',
//                                                 description: 'Track and manage employee skills and progress',
//                                                 icon: 'ClipboardList'
//                                             },
//                                             {
//                                                 id: 'others',
//                                                 name: 'Others',
//                                                 description: 'Miscellaneous training materials and documents',
//                                                 icon: 'ClipboardList'
//                                             },
//                                             {
//                                                 id: 'maru-a',                              // ← NEW: Maru A
//                                                 name: 'Maru A',
//                                                 description: 'Final approval & independent operation certification',
//                                                 icon: 'CheckCircle'
//                                             },

//                                         ]
//                                         .filter(m => isModuleEnabled(m.id))
//                                         .map((module) => {
//                                             const IconComponent = iconMap[module.icon as keyof typeof iconMap];
//                                             const colors = moduleColors[module.name as keyof typeof moduleColors] || moduleColors['Evaluation Test'];

//                                             return (
//                                                 <button
//                                                     key={module.id}
//                                                     type="button"
//                                                     onClick={() => {
//                                                         if (module.id === 'evaluation') handleEvaluationTestClick();
//                                                         else if (module.id === 'ten-cycle') handleTenCycleClick();
//                                                         else if (module.id === 'maru-a') handleMaruAClick();
//                                                         else if (module.id === 'others') handleOthersClick();
//                                                         else if (module.id === 'skill-evaluation') handleSkillMatrixClick();
//                                                         else handleOJTClick();
//                                                     }}
//                                                     className="group relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 text-left overflow-hidden transform hover:-translate-y-1 border border-white/20"
//                                                 >
//                                                     <div className={`absolute inset-0 bg-gradient-to-br ${colors.light} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

//                                                     <div className="relative z-10 flex items-center gap-4">
//                                                         <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg`}>
//                                                             {IconComponent && (
//                                                                 <IconComponent size={24} className="text-white" />
//                                                             )}
//                                                         </div>
//                                                         <div className="flex-1">
//                                                             <h3 className="font-bold text-gray-900 mb-1">{module.name}</h3>
//                                                             <p className="text-sm text-gray-600">{module.description}</p>
//                                                         </div>
//                                                         <div className={`px-3 py-1 bg-gradient-to-r ${colors.light} ${colors.text} rounded-lg text-xs font-bold`}>
//                                                             Access
//                                                         </div>
//                                                     </div>
//                                                 </button>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Topic Content Management */}
//                         {currentTopic ? (
//                             <div>
//                                 <div className="mb-10">
//                                     <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-3">{currentTopic.topic_name}</h2>
//                                     <p className="text-gray-600 text-lg">Manage training content and resources for this topic</p>
//                                 </div>

//                                 {/* Add Training Content */}
//                                 <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-10 border border-white/20 relative overflow-hidden">
//                                     <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>

//                                     <div className="relative z-10">
//                                         <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-4">
//                                             <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
//                                                 <Upload className="text-white" size={28} />
//                                             </div>
//                                             Add Learning Material
//                                         </h3>

//                                         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                                             <input
//                                                 type="text"
//                                                 value={newContentName}
//                                                 onChange={(e) => setNewContentName(e.target.value)}
//                                                 placeholder="Material name"
//                                                 className="px-5 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 shadow-lg text-lg"
//                                             />

//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-2">Upload File (optional)</label>
//                                                 <input
//                                                     type="file"
//                                                     onChange={(e) => setNewContentFile(e.target.files?.[0] || null)}
//                                                     className="w-full px-5 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 shadow-lg text-lg file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
//                                                 />
//                                             </div>

//                                             <input
//                                                 type="text"
//                                                 value={newContentUrl}
//                                                 onChange={(e) => setNewContentUrl(e.target.value)}
//                                                 placeholder="Resource URL (optional)"
//                                                 className="px-5 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 shadow-lg text-lg"
//                                             />

//                                             <div className="flex items-end">
//                                                 <button
//                                                     onClick={addContent}
//                                                     disabled={loading}
//                                                     className="w-full px-8 py-4 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white rounded-2xl hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-3 font-bold text-lg shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 disabled:opacity-50"
//                                                 >
//                                                     <Upload size={20} />
//                                                     Add Material
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Content Grid */}
//                                 <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
//                                     <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>

//                                     <div className="relative z-10 p-8 bg-gradient-to-r from-gray-50/90 to-white/90 backdrop-blur-sm border-b border-gray-200/50">
//                                         <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-4">
//                                             <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
//                                                 <FileIcon className="text-white" size={28} />
//                                             </div>
//                                             Training Content ({currentContents.length})
//                                         </h3>
//                                     </div>

//                                     {currentContents.length === 0 ? (
//                                         <div className="relative z-10 p-16 text-center">
//                                             <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
//                                                 <Upload size={48} className="text-gray-400" />
//                                             </div>
//                                             <p className="text-2xl font-bold text-gray-500 mb-3">No content yet</p>
//                                             <p className="text-gray-400 text-lg">Add your first training content using the form above</p>
//                                         </div>
//                                     ) : (
//                                         <div className="relative z-10 p-8">
//                                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                                                 {currentContents.map((content) => {
//                                                     const IconComponent = getFileIcon(content);

//                                                     return (
//                                                         <div key={content.id} className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:shadow-2xl hover:border-indigo-200/50 transition-all duration-300 relative overflow-hidden transform hover:-translate-y-1">
//                                                             <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl"></div>

//                                                             <div className="relative z-10">
//                                                                 <div className="flex items-start justify-between mb-6">
//                                                                     <div className="flex items-center gap-4">
//                                                                         <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-lg">
//                                                                             <IconComponent size={28} className="text-indigo-600" />
//                                                                         </div>
//                                                                         <div className="flex-1">
//                                                                             <h4 className="font-bold text-gray-900 text-lg mb-2">{content.content_name}</h4>
//                                                                             <p className="text-sm text-gray-500 font-medium">{content.file ? 'File Upload' : 'URL Resource'}</p>
//                                                                         </div>
//                                                                     </div>
//                                                                     <button
//                                                                         onClick={() => deleteContent(content.id)}
//                                                                         className="opacity-0 group-hover:opacity-100 p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300"
//                                                                     >
//                                                                         <Trash2 size={18} />
//                                                                     </button>
//                                                                 </div>

//                                                                 <div className="space-y-3">
//                                                                     {content.file && (
//                                                                         <a href={content.file} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 w-full justify-center">
//                                                                             <ExternalLink size={16} />
//                                                                             Open File
//                                                                         </a>
//                                                                     )}

//                                                                     {content.url && (
//                                                                         <a href={content.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-semibold bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 w-full justify-center">
//                                                                             <ExternalLink size={16} />
//                                                                             Open Resource
//                                                                         </a>
//                                                                     )}
//                                                                 </div>

//                                                                 <div className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-200/50 flex items-center gap-2">
//                                                                     <Clock size={12} />
//                                                                     Updated: {new Date(content.updated_at).toLocaleDateString()}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     );
//                                                 })}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ) : null}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TrainingOptionsPageNew;




import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CheckCircle,
    GraduationCap,
    Calendar,
    Plus,
    Upload,
    File as FileIcon,
    Video as VideoIcon,
    Image as ImageIcon,
    ExternalLink,
    Trash2,
    FolderOpen,
    BookOpen,
    Sparkles,
    Target,
    Users,
    Clock,
    AlertCircle,
    ClipboardList
} from 'lucide-react';

interface TrainingTopic {
    id: number;
    topic_name: string;
    level: number;
    level_name?: string;
    station: number;
    station_name?: string;
}

interface TrainingContent {
    id: number;
    topic: number;
    topic_name?: string;
    level: number;
    level_name?: string;
    station: number;
    station_name?: string;
    content_name: string;
    file: string | null;
    url: string | null;
    updated_at: string;
}

interface LocationState {
    stationId: number;
    stationName: string;
    sublineId: number | null;
    sublineName: string | null;
    lineId: number | null;
    lineName: string | null;
    departmentId: number;
    departmentName: string | null;
    levelId: number;
    levelName: string;
}

const iconMap = {
    CheckCircle,
    GraduationCap,
    Calendar,
    ClipboardList
};

const moduleColors = {
    'Evaluation Test': {
        bg: 'from-blue-500 via-blue-600 to-indigo-600',
        light: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        text: 'text-blue-600',
        shadow: 'shadow-blue-500/25',
        glow: 'shadow-blue-500/50'
    },
    'On-Job Training': {
        bg: 'from-green-500 via-emerald-600 to-teal-600',
        light: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        text: 'text-green-600',
        shadow: 'shadow-green-500/25',
        glow: 'shadow-green-500/50'
    },
    'Ten Cycle': {
        bg: 'from-purple-500 via-violet-600 to-indigo-600',
        light: 'from-purple-50 to-violet-50',
        border: 'border-purple-200',
        text: 'text-purple-600',
        shadow: 'shadow-purple-500/25',
        glow: 'shadow-purple-500/50'
    },
     'Skill Evaluation': {
        bg: 'from-amber-500 via-orange-600 to-red-600',
        light: 'from-amber-50 to-orange-50',
        border: 'border-amber-200',
        text: 'text-amber-600',
        shadow: 'shadow-amber-500/25',
        glow: 'shadow-amber-500/50'
    },
    'Others': {
        bg: 'from-orange-500 via-amber-600 to-yellow-600',
        light: 'from-orange-50 to-amber-50',
        border: 'border-orange-200',
        text: 'text-orange-600',
        shadow: 'shadow-orange-500/25',
        glow: 'shadow-orange-500/50'
    },
    'Maru A': {
        bg: 'from-red-500 via-rose-600 to-pink-600',
        light: 'from-red-50 to-pink-50',
        border: 'border-red-200',
        text: 'text-red-600',
        shadow: 'shadow-red-500/25',
        glow: 'shadow-red-500/50'
    },
};

export const TrainingOptionsPageNew: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const locationState = (location.state as LocationState) || undefined;
    
    // State
    const [topics, setTopics] = useState<TrainingTopic[]>([]);
    const [contents, setContents] = useState<TrainingContent[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // form
    const [newTopicName, setNewTopicName] = useState('');
    const [newContentName, setNewContentName] = useState('');
    const [newContentFile, setNewContentFile] = useState<File | null>(null);
    const [newContentUrl, setNewContentUrl] = useState('');

    // composite config state
    const [compositeConfigs, setCompositeConfigs] = useState<any | null>(null);
    const [compositeLoading, setCompositeLoading] = useState(false);

    const API_BASE_URL = 'http://localhost:8000';
    const CONFIGS_BASE = `${API_BASE_URL}/station-sheet-configs`;
    const CONFIGS_BY_COMPOSITE = `${CONFIGS_BASE}/by-composite/`;

    async function fetchByComposite(
        level_id: number,
        department_id: number,
        line_id: number | null,
        subline_id: number | null,
        station_id: number
    ) {
        const params = new URLSearchParams();
        params.set('level_id', String(level_id));
        params.set('department_id', String(department_id));
        if (line_id !== null && line_id !== undefined) params.set('line_id', String(line_id));
        if (subline_id !== null && subline_id !== undefined) params.set('subline_id', String(subline_id));
        params.set('station_id', String(station_id));

        const url = `${CONFIGS_BY_COMPOSITE}?${params.toString()}`;
        const resp = await fetch(url, { method: 'GET' });
        if (resp.status === 404) return null;
        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`fetchByComposite error: ${resp.status} ${text}`);
        }
        return resp.json();
    }

    useEffect(() => {
        // require the necessary parts of locationState
        if (!locationState || !locationState.levelId || !locationState.departmentId || !locationState.stationId) {
            setCompositeConfigs(null);
            return;
        }

        let mounted = true;
        setCompositeLoading(true);

        (async () => {
            try {
                const resp = await fetchByComposite(
                    locationState.levelId,
                    locationState.departmentId,
                    locationState.lineId ?? null,
                    locationState.sublineId ?? null,
                    locationState.stationId
                );

                if (!mounted) return;
                if (resp === null) {
                    setCompositeConfigs(null);
                } else {
                    setCompositeConfigs(resp);
                }
            } catch (err: any) {
                if (!mounted) return;
                console.error('fetchByComposite failed:', err);
                setCompositeConfigs(null);
            } finally {
                if (mounted) setCompositeLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [
        locationState?.levelId,
        locationState?.departmentId,
        locationState?.lineId,
        locationState?.sublineId,
        locationState?.stationId
    ]);

    // fetch topics
    const fetchTopics = async () => {
        if (!locationState?.stationId || !locationState?.levelId) return;

        try {
            const params = new URLSearchParams({
                level_id: locationState.levelId.toString(),
                station_id: locationState.stationId.toString()
            });

            const res = await fetch(`${API_BASE_URL}/training_topics/?${params}`);
            if (res.ok) {
                const data: TrainingTopic[] = await res.json();
                setTopics(data);
                if (data.length > 0 && !selectedTopic) setSelectedTopic(data[0].id);
            } else {
                console.error('fetchTopics failed:', res.statusText);
            }
        } catch (err) {
            console.error('fetchTopics error:', err);
        }
    };

    // fetch contents
    const fetchContents = async () => {
        if (!locationState?.stationId || !locationState?.levelId) return;

        try {
            const params = new URLSearchParams({
                level_id: locationState.levelId.toString(),
                station_id: locationState.stationId.toString(),
                ...(selectedTopic && { topic_id: selectedTopic.toString() })
            });

            const res = await fetch(`${API_BASE_URL}/levelwise-training-contents/by_level_station_topic/?${params}`);
            if (res.ok) {
                const data: TrainingContent[] = await res.json();
                setContents(data);
            } else {
                console.error('fetchContents failed:', res.statusText);
            }
        } catch (err) {
            console.error('fetchContents error:', err);
        }
    };

    useEffect(() => {
        if (locationState?.stationId && locationState?.levelId && !compositeLoading) {
            fetchTopics();
        }
    }, [locationState?.stationId, locationState?.levelId, compositeLoading]);

    useEffect(() => {
        if (!compositeLoading) {
            fetchContents();
        }
    }, [selectedTopic, locationState, compositeLoading]);

    // helper to decide if a module is enabled
    const isModuleEnabled = (moduleId: string) => {
        if (!compositeConfigs) return true;
        const mapping: Record<string, boolean> = {
            'evaluation': Boolean(compositeConfigs?.evaluation_enabled),
            'ojt': Boolean(compositeConfigs?.ojt_enabled),
            'ten-cycle': Boolean(compositeConfigs?.ten_cycle_enabled),
            'skill-evaluation': Boolean(compositeConfigs?.skill_evaluation_enabled),
            'maru-a': Boolean(compositeConfigs?.maru_a_enabled),
            'others': Boolean(compositeConfigs?.others_enabled),
        };
        return mapping[moduleId] ?? true;
    };

    // Validation for required location state
    if (!locationState?.stationId || !locationState?.levelId) {
        return (
            <div className="flex-1 bg-background flex min-h-screen items-center justify-center">
                <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-6 bg-red-50 rounded-3xl flex items-center justify-center border border-red-100">
                        <AlertCircle size={48} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-text mb-4">Missing Required Information</h2>
                    <p className="text-muted mb-6">Station ID and Level ID are required to manage training topics.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Show loading state while fetching composite configs
    if (compositeLoading) {
        return (
            <div className="flex-1 bg-background flex min-h-screen items-center justify-center">
                <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-6 bg-indigo-50 rounded-3xl flex items-center justify-center animate-pulse border border-indigo-100">
                        <Sparkles size={48} className="text-indigo-500 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold text-text mb-4">Loading Configuration</h2>
                    <p className="text-muted">Please wait while we fetch your training settings...</p>
                </div>
            </div>
        );
    }

    // Navigation handlers
    const handleEvaluationTestClick = () => {
        navigate("/ExamModeSelector", {
            state: {
                stationId: locationState?.stationId,
                stationName: locationState?.stationName,
                departmentName: locationState?.departmentName,
                levelId: locationState?.levelId,
                levelName: locationState?.levelName
            }
        });
    };

    const handleTenCycleClick = () => navigate("/OjtSearch", { state: { ...location.state, nextpage: "tencycle" } });
    const handleOJTClick = () => navigate("/OjtSearch", { state: { ...location.state, } });
    const handleSkillMatrixClick = () => navigate("/OjtSearch", { state: { ...location.state, nextpage: "skillevaluation" } });
    const handleMaruAClick = () => navigate("/OjtSearch", { state: { ...location.state, nextpage: "marua" } });
    const handleOthersClick = () => navigate("/OjtSearch", { state: { ...location.state, nextpage: "others" } });

    // addTopic
    const addTopic = async () => {
        if (!newTopicName.trim() || !locationState?.stationId || !locationState?.levelId) {
            console.error('Missing required data: topic name, station ID, or level ID');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/training_topics/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic_name: newTopicName.trim(),
                    level: locationState.levelId,
                    station: locationState.stationId
                })
            });

            if (res.ok) {
                const newTopic = await res.json();
                setTopics(prev => [...prev, newTopic]);
                setSelectedTopic(newTopic.id);
                setNewTopicName('');
            } else {
                console.error('addTopic failed:', res.statusText);
            }
        } catch (err) {
            console.error('addTopic error:', err);
        }
        setLoading(false);
    };

    const addContent = async () => {
        if (!newContentName.trim() || !selectedTopic || !locationState?.stationId || !locationState?.levelId) return;

        setLoading(true);
        try {
            const form = new FormData();
            form.append('topic', selectedTopic.toString());
            form.append('level', locationState.levelId.toString());
            form.append('station', locationState.stationId.toString());
            form.append('content_name', newContentName.trim());

            if (newContentFile) form.append('file', newContentFile);
            if (newContentUrl.trim()) form.append('url', newContentUrl.trim());

            const res = await fetch(`${API_BASE_URL}/levelwise-training-contents/`, {
                method: 'POST',
                body: form
            });

            if (res.ok) {
                setNewContentName('');
                setNewContentFile(null);
                setNewContentUrl('');
                fetchContents();
            } else {
                console.error('addContent failed:', res.statusText);
            }
        } catch (err) {
            console.error('addContent error:', err);
        }
        setLoading(false);
    };

    const deleteContent = async (id: number) => {
        if (!confirm('Are you sure you want to delete this content?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/levelwise-training-contents/${id}/`, { method: 'DELETE' });
            if (res.ok) fetchContents();
            else console.error('deleteContent failed:', res.statusText);
        } catch (err) {
            console.error('deleteContent error:', err);
        }
    };

    const deleteTopic = async (id: number) => {
        if (!confirm('Delete this topic and all contents?')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/training_topics/${id}/`, {
                method: 'DELETE'
            });

            if (res.ok) {
                const updated = topics.filter(t => t.id !== id);
                setTopics(updated);

                if (selectedTopic === id) {
                    setSelectedTopic(updated.length ? updated[0].id : null);
                }

                fetchContents();
            } else {
                console.error('deleteTopic failed:', res.statusText);
            }
        } catch (err) {
            console.error('deleteTopic error:', err);
        }
    };

    const getFileIcon = (content: TrainingContent) => {
        if (content.file) {
            const ext = content.file.split('.').pop()?.toLowerCase();
            if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) return VideoIcon;
            if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return ImageIcon;
            return FileIcon;
        }
        return FileIcon;
    };

    const currentTopic = topics.find(t => t.id === selectedTopic) || null;
    const currentContents = selectedTopic ? contents.filter(c => c.topic === selectedTopic) : [];

    return (
        <div className="flex-1 bg-background flex min-h-screen">
            {/* Sidebar (bg-surface) */}
            <div className="w-96 bg-surface border-r border-border flex flex-col relative overflow-hidden shadow-sm">
                
                {/* Header (Branded) */}
                <div className="relative z-10 p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                            <Sparkles size={28} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Training Topics</h3>
                            <p className="text-indigo-100 text-sm">Organize your content</p>
                        </div>
                    </div>
                </div>

                {/* Add Topic Area */}
                <div className="relative z-10 p-6 bg-surface border-b border-border">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newTopicName}
                            onChange={(e) => setNewTopicName(e.target.value)}
                            placeholder="Create new topic..."
                            onKeyDown={(e) => e.key === 'Enter' && addTopic()}
                            className="flex-1 px-4 py-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-text placeholder-muted"
                        />
                        <button
                            onClick={addTopic}
                            disabled={loading}
                            className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                {/* Topics List */}
                <div className="relative z-10 flex-1 overflow-y-auto bg-background">
                    {topics.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 bg-surface rounded-2xl flex items-center justify-center border border-border">
                                <BookOpen size={40} className="text-muted" />
                            </div>
                            <p className="text-text font-semibold text-lg mb-2">No topics yet</p>
                            <p className="text-muted text-sm">Create your first training topic above</p>
                        </div>
                    ) : (
                        <div className="p-4 space-y-3">
                            {topics.map((topic, idx) => {
                                return (
                                    <div
                                        key={topic.id}
                                        onClick={() => setSelectedTopic(topic.id)}
                                        className={`relative p-4 rounded-xl cursor-pointer transition-all duration-200 group overflow-hidden border ${selectedTopic === topic.id
                                            ? 'bg-surface border-indigo-500 ring-1 ring-indigo-500 shadow-sm'
                                            : 'bg-surface border-border hover:bg-background hover:border-indigo-300'
                                            }`}
                                    >
                                        <div className="relative z-10 flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${selectedTopic === topic.id
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-background border border-border text-muted group-hover:bg-indigo-50 group-hover:text-indigo-600'
                                                    }`}>
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-text text-base mb-0.5">{topic.topic_name}</h4>
                                                    <p className="text-xs text-muted truncate">{topic.level_name} - {topic.station_name}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteTopic(topic.id); }}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content (bg-background) */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-background">
                
                {/* Station Header */}
                <div className="relative z-10 bg-surface shadow-sm border-b border-border p-8">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                                <Target size={32} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-text mb-1">{locationState?.stationName || 'Training Station'}</h1>
                                <p className="text-muted text-lg">{locationState?.levelName} - {locationState?.departmentName}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <Users size={24} className="text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted font-medium">Training Topics</p>
                                    <p className="text-2xl font-bold text-indigo-600">{topics.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Training Modules Grid */}
                        <div className="mb-10">
                            {!currentTopic ? (
                                <>
                                    <div className="text-center mb-10">
                                        <h2 className="text-3xl font-bold text-text mb-2">
                                            Training Pathways
                                        </h2>
                                        <p className="text-muted text-lg max-w-2xl mx-auto">
                                            Choose your learning journey and unlock your potential
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                        {[
                                            { id: 'evaluation', name: 'Evaluation Test', description: 'Comprehensive assessment and evaluation system', icon: 'CheckCircle' },
                                            { id: 'ojt', name: 'On-Job Training', description: 'Hands-on practical training experience', icon: 'GraduationCap' },
                                            { id: 'ten-cycle', name: 'Ten Cycle', description: 'Systematic ten-step training methodology', icon: 'Calendar' },
                                            { id: 'skill-evaluation', name: 'Skill Evaluation', description: 'Track and manage employee skills and progress', icon: 'ClipboardList' },
                                            { id: 'others', name: 'Others', description: 'Miscellaneous training materials and documents', icon: 'ClipboardList' },
                                            { id: 'maru-a', name: 'Maru A', description: 'Final approval & independent operation certification', icon: 'CheckCircle' },
                                        ]
                                        .filter(m => isModuleEnabled(m.id))
                                        .map((module) => {
                                            const IconComponent = iconMap[module.icon as keyof typeof iconMap];
                                            const colors = moduleColors[module.name as keyof typeof moduleColors] || moduleColors['Evaluation Test'];

                                            return (
                                                <div
                                                    key={module.id}
                                                    className="group relative bg-surface rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 text-center overflow-hidden border border-border"
                                                >
                                                    {/* Color Bar at Top */}
                                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colors.bg}`}></div>
                                                    
                                                    <div className="relative z-10">
                                                        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center mx-auto mb-6 shadow-md`}>
                                                            {IconComponent && (
                                                                <IconComponent size={32} className="text-white" />
                                                            )}
                                                        </div>

                                                        <h3 className="text-xl font-bold text-text mb-2 group-hover:text-indigo-600 transition-colors">
                                                            {module.name}
                                                        </h3>
                                                        <p className="text-muted mb-6 text-sm h-10">{module.description}</p>

                                                        <div className={`inline-flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-xs font-semibold text-muted mb-6`}>
                                                            <BookOpen size={14} />
                                                            {topics.filter(t => t.topic_name.toLowerCase().includes(module.name.toLowerCase())).length || 0} topics
                                                        </div>

                                                        <button
                                                            onClick={() => {
                                                                if (module.id === 'evaluation') handleEvaluationTestClick();
                                                                else if (module.id === 'ten-cycle') handleTenCycleClick();
                                                                else if (module.id === 'ojt') handleOJTClick();
                                                                else if (module.id === 'skill-evaluation') handleSkillMatrixClick();
                                                                else if (module.id === 'others') handleOthersClick();
                                                                else if (module.id === 'maru-a') handleMaruAClick();
                                                            }}
                                                            className={`w-full py-3 bg-gradient-to-r ${colors.bg} text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm`}
                                                        >
                                                            Start Learning
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                // Simplified Module List (Small Cards)
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-text">
                                            Quick Access Modules
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { id: 'evaluation', name: 'Evaluation Test', description: 'Assessment system', icon: 'CheckCircle' },
                                            { id: 'ojt', name: 'On-Job Training', description: 'Practical training', icon: 'GraduationCap' },
                                            { id: 'ten-cycle', name: 'Ten Cycle', description: 'Systematic steps', icon: 'Calendar' },
                                            { id: 'skill-evaluation', name: 'Skill Evaluation', description: 'Skills tracking', icon: 'ClipboardList' },
                                            { id: 'others', name: 'Others', description: 'Misc materials', icon: 'ClipboardList' },
                                            { id: 'maru-a', name: 'Maru A', description: 'Certification', icon: 'CheckCircle' },
                                        ]
                                        .filter(m => isModuleEnabled(m.id))
                                        .map((module) => {
                                            const IconComponent = iconMap[module.icon as keyof typeof iconMap];
                                            const colors = moduleColors[module.name as keyof typeof moduleColors] || moduleColors['Evaluation Test'];

                                            return (
                                                <button
                                                    key={module.id}
                                                    type="button"
                                                    onClick={() => {
                                                        if (module.id === 'evaluation') handleEvaluationTestClick();
                                                        else if (module.id === 'ten-cycle') handleTenCycleClick();
                                                        else if (module.id === 'maru-a') handleMaruAClick();
                                                        else if (module.id === 'others') handleOthersClick();
                                                        else if (module.id === 'skill-evaluation') handleSkillMatrixClick();
                                                        else handleOJTClick();
                                                    }}
                                                    className="group bg-surface hover:bg-background border border-border hover:border-indigo-300 rounded-xl p-4 text-left transition-all duration-200 flex items-center gap-4 shadow-sm"
                                                >
                                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-md`}>
                                                        {IconComponent && (
                                                            <IconComponent size={20} className="text-white" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-text text-sm">{module.name}</h3>
                                                        <p className="text-xs text-muted truncate">{module.description}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Topic Content Management */}
                        {currentTopic ? (
                            <div>
                                <div className="mb-6 border-b border-border pb-4">
                                    <h2 className="text-2xl font-bold text-text mb-1">{currentTopic.topic_name}</h2>
                                    <p className="text-muted">Manage training content and resources</p>
                                </div>

                                {/* Add Content Form */}
                                <div className="bg-surface rounded-2xl shadow-sm p-6 mb-8 border border-border">
                                    <h3 className="text-lg font-bold text-text mb-6 flex items-center gap-3">
                                        <div className="p-2 bg-emerald-100 rounded-lg">
                                            <Upload className="text-emerald-600" size={20} />
                                        </div>
                                        Add Learning Material
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <input
                                            type="text"
                                            value={newContentName}
                                            onChange={(e) => setNewContentName(e.target.value)}
                                            placeholder="Material name"
                                            className="px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-text"
                                        />

                                        <div>
                                            {/* <label className="block text-xs font-medium text-muted mb-1">Upload File (optional)</label> */}
                                            <input
                                                type="file"
                                                onChange={(e) => setNewContentFile(e.target.files?.[0] || null)}
                                                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 text-text"
                                            />
                                        </div>

                                        <input
                                            type="text"
                                            value={newContentUrl}
                                            onChange={(e) => setNewContentUrl(e.target.value)}
                                            placeholder="Resource URL (optional)"
                                            className="px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-text"
                                        />

                                        <button
                                            onClick={addContent}
                                            disabled={loading}
                                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 font-semibold shadow-sm disabled:opacity-50"
                                        >
                                            <Upload size={18} />
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {/* Content List */}
                                <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                                    <div className="p-6 border-b border-border bg-background/50">
                                        <h3 className="text-lg font-bold text-text flex items-center gap-3">
                                            <FileIcon className="text-indigo-600" size={20} />
                                            Training Content ({currentContents.length})
                                        </h3>
                                    </div>

                                    {currentContents.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-background rounded-2xl flex items-center justify-center border border-border">
                                                <Upload size={32} className="text-muted" />
                                            </div>
                                            <p className="text-lg font-bold text-text mb-1">No content yet</p>
                                            <p className="text-muted">Add your first training content using the form above</p>
                                        </div>
                                    ) : (
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {currentContents.map((content) => {
                                                    const IconComponent = getFileIcon(content);

                                                    return (
                                                        <div key={content.id} className="group bg-background border border-border rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-200">
                                                            
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                                                        <IconComponent size={24} className="text-indigo-600" />
                                                                    </div>
                                                                    <div className="flex-1 overflow-hidden">
                                                                        <h4 className="font-bold text-text text-base truncate" title={content.content_name}>{content.content_name}</h4>
                                                                        <p className="text-xs text-muted">{content.file ? 'File Upload' : 'URL Resource'}</p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => deleteContent(content.id)}
                                                                    className="opacity-0 group-hover:opacity-100 p-2 text-muted hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>

                                                            <div className="space-y-2">
                                                                {content.file && (
                                                                    <a href={content.file} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm text-blue-700 font-medium bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors w-full border border-blue-100">
                                                                        <ExternalLink size={14} />
                                                                        Open File
                                                                    </a>
                                                                )}

                                                                {content.url && (
                                                                    <a href={content.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm text-indigo-700 font-medium bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors w-full border border-indigo-100">
                                                                        <ExternalLink size={14} />
                                                                        Open Resource
                                                                    </a>
                                                                )}
                                                            </div>

                                                            <div className="text-xs text-muted mt-3 pt-3 border-t border-border flex items-center gap-1.5">
                                                                <Clock size={12} />
                                                                {new Date(content.updated_at).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingOptionsPageNew;