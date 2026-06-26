// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { Bell, Check, CheckCheck, AlertCircle, Info, Clock, User, BookOpen, Calendar, RefreshCw, Trash2, Zap } from 'lucide-react';

// // --- TYPE DEFINITIONS ---
// interface Notification {
//   id: number;
//   title: string;
//   message: string;
//   notification_type: string;
//   recipient_name?: string;
//   employee_name?: string;
//   level_name?: string;
//   is_read: boolean;
//   priority: 'low' | 'medium' | 'high' | 'urgent';
//   created_at: string;
//   time_ago: string;
//   is_recent: boolean;
//   metadata?: Record<string, any>;
// }

// interface NotificationStats {
//   total_count: number;
//   unread_count: number;
//   read_count: number;
//   recent_count: number;
//   by_type: Record<string, number>;
//   by_priority: Record<string, number>;
// }

// interface ModuleTab {
//   key: string;
//   label: string;
//   types: string[];
//   count: number;
// }

// // --- CONSTANTS ---
// const API_BASE_URL = 'http://127.0.0.1:8000';

// const NOTIFICATION_TYPES = {
//   // EMPLOYEE_REGISTRATION: "employee_registration",
//   USER_REGISTRATION: "user_registration",
//   MASTER_EMPLOYEE_CREATED: "mastertable_employee_created",
//   MASTER_EMPLOYEE_REMOVED: "mastertable_employee_removed",
//   LEVEL_EXAM_COMPLETED: "level_exam_completed",
//   TRAINING_RESCHEDULE: "training_reschedule",
//   REFRESHER_TRAINING_SCHEDULED: "refresher_training_scheduled",
//   REFRESHER_TRAINING_COMPLETED: "refresher_training_completed",
//   BENDING_TRAINING_ADDED: "bending_training_added",
//   SYSTEM_ALERT: "system_alert",
//   TRAINING_SCHEDULED: "training_scheduled",
//   TRAINING_COMPLETED: "training_completed",
//   HANCHOU_EXAM_COMPLETED: "hanchou_exam_completed",
//   SHOKUCHOU_EXAM_COMPLETED: "shokuchou_exam_completed",
//   TEN_CYCLE_EVALUATION_COMPLETED: "ten_cycle_evaluation_completed",
//   OJT_COMPLETED: "ojt_completed",
//   OJT_QUANTITY_COMPLETED: "ojt_quantity_completed",
//   SKILL_MATRIX_UPDATED: "skill_matrix_updated",
//   MULTISKILLING_SCHEDULED: "multiskilling_scheduled",
//   MULTISKILLING_COMPLETED: "multiskilling_completed",
//   MACHINE_ALLOCATED: "machine_allocated",
//   TEST_ASSIGNED: "test_assigned",
//   EVALUATION_COMPLETED: "evaluation_completed",
//   RETRAINING_SCHEDULED: "retraining_scheduled",
//   RETRAINING_COMPLETED: "retraining_completed",
//   HUMAN_BODY_CHECK_COMPLETED: "human_body_check_completed",
//   MILESTONE_REACHED: "milestone_reached"
// } as const;

// // --- COMPONENT ---
// const AppNotification: React.FC = () => {
//   const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
//   const [stats, setStats] = useState<NotificationStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filter, setFilter] = useState<'all' | 'unread' | 'recent'>('all');
//   const [isConnected, setIsConnected] = useState(false);
//   const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

//   const [moduleTabs, setModuleTabs] = useState<ModuleTab[]>([]);
//   const [activeModuleKey, setActiveModuleKey] = useState<string | null>(null);

//     const getActiveModuleTypes = () => {
//     const activeTab = moduleTabs.find(t => t.key === activeModuleKey);
//     return activeTab?.types ?? [];
//   };


//   const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   // --- HELPER FUNCTIONS ---
//   const isRecentNotification = (dateString: string): boolean => {
//     const now = new Date();
//     const date = new Date(dateString);
//     const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
//     return diffInHours <= 24;
//   };

//   const formatTimeAgo = (dateString: string): string => {
//     const now = new Date();
//     const date = new Date(dateString);
//     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
//     if (diffInSeconds < 60) return 'Just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
//     return `${Math.floor(diffInSeconds / 86400)} days ago`;
//   };

//   // --- DATA FETCHING & PROCESSING ---
//   const fetchNotifications = useCallback(
//     async (moduleTypes?: string[]) => {
//       if (!pollIntervalRef.current) {
//         setLoading(true);
//       }

//       try {
//         const readNotifications: number[] = JSON.parse(localStorage.getItem('readNotifications') || '[]');
//         const deletedNotifications: number[] = JSON.parse(localStorage.getItem('deletedNotifications') || '[]');

//         const params = new URLSearchParams();
//         const typesToUse = moduleTypes && moduleTypes.length > 0 ? moduleTypes : Object.values(NOTIFICATION_TYPES);
//         typesToUse.forEach(type => params.append('notification_type', type));

//         const response = await fetch(`${API_BASE_URL}/notifications/?${params.toString()}`);

//         if (!response.ok) {
//           throw new Error(`API request failed with status ${response.status}`);
//         }

//         const data = await response.json();
//         const rawNotifications = data.results || data || [];

//         const processedNotifications = rawNotifications
//           .filter((notif: any) => !deletedNotifications.includes(notif.id))
//           .map((notif: any): Notification => ({
//             ...notif,
//             is_read: readNotifications.includes(notif.id) || notif.is_read,
//             time_ago: formatTimeAgo(notif.created_at),
//             is_recent: isRecentNotification(notif.created_at),
//           }));

//         setAllNotifications(processedNotifications);
//         setIsConnected(true);
//         setError(null);
//       } catch (err) {
//         console.error('❌ Fetch error:', err);
//         setError('Failed to connect to the notification service.');
//         setIsConnected(false);
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   // --- LIFECYCLE HOOKS ---
//   // useEffect(() => {
//   //   const init = async () => {
//   //     try {
//   //       const res = await fetch(`${API_BASE_URL}/notifications/module_stats/`);
//   //       let defaultTypes: string[] | undefined = undefined;

//   //       if (res.ok) {
//   //         const data = await res.json();
//   //         const tabs: ModuleTab[] = data.tabs || [];
//   //         setModuleTabs(tabs);

//   //         if (tabs.length > 0) {
//   //           setActiveModuleKey(tabs[0].key);
//   //           defaultTypes = tabs[0].types;
//   //         }
//   //       } else {
//   //         console.error('Failed to load module stats:', res.status);
//   //       }

//   //       await fetchNotifications(defaultTypes);
//   //     } catch (e) {
//   //       console.error('Error initializing notifications:', e);
//   //       await fetchNotifications();
//   //     }
//   //   };

//   //   init();

//   //   if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

//   //   const intervalId = setInterval(() => {
//   //     const activeTab = moduleTabs.find(t => t.key === activeModuleKey);
//   //     const types = activeTab?.types;
//   //     fetchNotifications(types);
//   //   }, 30000);

//   //   pollIntervalRef.current = intervalId;

//   //   return () => {
//   //     if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
//   //   };
//   // }, [fetchNotifications]);

//   // Load module tabs once
//   useEffect(() => {
//     const loadModules = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/notifications/module_stats/`);
//         if (res.ok) {
//           const data = await res.json();
//           const tabs: ModuleTab[] = data.tabs || [];
//           setModuleTabs(tabs);

//           // Default active tab on first load
//           if (tabs.length > 0) {
//             setActiveModuleKey(prev => prev ?? tabs[0].key);
//           }
//         } else {
//           console.error('Failed to load module stats:', res.status);
//         }
//       } catch (e) {
//         console.error('Error initializing notifications:', e);
//       }
//     };

//     loadModules();
//   }, []);


//     useEffect(() => {
//     const types = getActiveModuleTypes();

//     // Initial fetch for this module
//     fetchNotifications(types);

//     // Poll every 30s for this module
//     if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

//     const intervalId = setInterval(() => {
//       fetchNotifications(types);
//     }, 30000);

//     pollIntervalRef.current = intervalId;

//     return () => {
//       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
//     };
//   }, [fetchNotifications, activeModuleKey, moduleTabs]);




//   // useEffect(() => {
//   //   const total_count = allNotifications.length;
//   //   const unread_count = allNotifications.filter(n => !n.is_read).length;
//   //   const recent_count = allNotifications.filter(n => n.is_recent).length;

//   //   const by_type = allNotifications.reduce((acc, n) => {
//   //     acc[n.notification_type] = (acc[n.notification_type] || 0) + 1;
//   //     return acc;
//   //   }, {} as Record<string, number>);

//   //   const by_priority = allNotifications.reduce((acc, n) => {
//   //     acc[n.priority] = (acc[n.priority] || 0) + 1;
//   //     return acc;
//   //   }, {} as Record<string, number>);

//   //   setStats({
//   //     total_count,
//   //     unread_count,
//   //     read_count: total_count - unread_count,
//   //     recent_count,
//   //     by_type,
//   //     by_priority,
//   //   });
//   // }, [allNotifications]);


//     useEffect(() => {
//     const activeTypes = getActiveModuleTypes();

//     // Only notifications of the active module
//     const moduleFiltered = allNotifications.filter(n =>
//       activeTypes.length ? activeTypes.includes(n.notification_type) : true
//     );

//     const total_count = moduleFiltered.length;
//     const unread_count = moduleFiltered.filter(n => !n.is_read).length;
//     const recent_count = moduleFiltered.filter(n => n.is_recent).length;

//     const by_type = moduleFiltered.reduce((acc, n) => {
//       acc[n.notification_type] = (acc[n.notification_type] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     const by_priority = moduleFiltered.reduce((acc, n) => {
//       acc[n.priority] = (acc[n.priority] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     setStats({
//       total_count,
//       unread_count,
//       read_count: total_count - unread_count,
//       recent_count,
//       by_type,
//       by_priority,
//     });
//   }, [allNotifications, activeModuleKey, moduleTabs]);


//   // --- USER ACTIONS ---
//   const toggleReadStatus = async (notificationId: number) => {
//     const notification = allNotifications.find(n => n.id === notificationId);
//     if (!notification) return;

//     const newReadState = !notification.is_read;

//     setAllNotifications(prev =>
//       prev.map(n => (n.id === notificationId ? { ...n, is_read: newReadState } : n))
//     );

//     const readIds: number[] = JSON.parse(localStorage.getItem('readNotifications') || '[]');
//     if (newReadState) {
//       if (!readIds.includes(notificationId)) {
//         localStorage.setItem('readNotifications', JSON.stringify([...readIds, notificationId]));
//       }
//     } else {
//       localStorage.setItem('readNotifications', JSON.stringify(readIds.filter(id => id !== notificationId)));
//     }

//     if (isConnected) {
//       try {
//         await fetch(`${API_BASE_URL}/notifications/${notificationId}/`, {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ is_read: newReadState }),
//         });
//       } catch (err) {
//         console.error('Server sync error for read status:', err);
//       }
//     }
//   };

//   const markAllAsRead = async () => {
//     setAllNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
//     const allIds = allNotifications.map(n => n.id);
//     localStorage.setItem('readNotifications', JSON.stringify(allIds));

//     if (isConnected) {
//       try {
//         await fetch(`${API_BASE_URL}/notifications/mark_all_read/`, { method: 'POST' });
//       } catch (err) {
//         console.error('Server mark all read error:', err);
//       }
//     }
//   };

//   const deleteNotification = async (notificationId: number) => {
//     if (!window.confirm('Are you sure you want to delete this notification?')) return;

//     setAllNotifications(prev => prev.filter(notif => notif.id !== notificationId));

//     const deletedIds: number[] = JSON.parse(localStorage.getItem('deletedNotifications') || '[]');
//     if (!deletedIds.includes(notificationId)) {
//       localStorage.setItem('deletedNotifications', JSON.stringify([...deletedIds, notificationId]));
//     }

//     const readIds: number[] = JSON.parse(localStorage.getItem('readNotifications') || '[]');
//     if (readIds.includes(notificationId)) {
//       localStorage.setItem('readNotifications', JSON.stringify(readIds.filter(id => id !== notificationId)));
//     }

//     if (isConnected) {
//       try {
//         await fetch(`${API_BASE_URL}/notifications/${notificationId}/`, { method: 'DELETE' });
//       } catch (err) {
//         console.error('Server delete error:', err);
//       }
//     }
//   };

//   const deleteAllNotifications = async () => {
//     if (!window.confirm('Are you sure you want to delete ALL notifications? This cannot be undone.')) return;

//     const allIds = allNotifications.map(n => n.id);
//     localStorage.setItem('deletedNotifications', JSON.stringify(allIds));
//     localStorage.removeItem('readNotifications');
//     setAllNotifications([]);

//     if (isConnected) {
//       try {
//         await fetch(`${API_BASE_URL}/notifications/delete_all/`, { method: 'POST' });
//       } catch (err) {
//         console.error('Server delete all error:', err);
//       }
//     }
//   };

//   const handleModuleChange = (key: string) => {
//     setActiveModuleKey(key);
//     setFilter('all');
//     setDateFilter('all');

//     const tab = moduleTabs.find(t => t.key === key);
//     const types = tab?.types;

//     fetchNotifications(types);
//   };

//   const resetLocalState = () => {
//     if (window.confirm('This will clear all locally stored "read" and "deleted" history for notifications. This is useful for debugging if notifications seem to be missing. Continue?')) {
//       localStorage.removeItem('readNotifications');
//       localStorage.removeItem('deletedNotifications');

//       const activeTab = moduleTabs.find(t => t.key === activeModuleKey);
//       const types = activeTab?.types;
//       fetchNotifications(types);
//     }
//   };

//   // --- DERIVED STATE & DISPLAY HELPERS ---
//   // const filteredNotifications = allNotifications.filter(notif => {
//   //   if (filter === 'unread' && notif.is_read) return false;
//   //   if (filter === 'recent' && !notif.is_recent) return false;

//   //   if (dateFilter !== 'all') {
//   //     const notifDate = new Date(notif.created_at);
//   //     const now = new Date();

//   //     if (dateFilter === 'today') {
//   //       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//   //       if (notifDate < today) return false;
//   //     } else if (dateFilter === 'week') {
//   //       const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//   //       if (notifDate < weekAgo) return false;
//   //     } else if (dateFilter === 'month') {
//   //       const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//   //       if (notifDate < monthAgo) return false;
//   //     }
//   //   }

//   //   return true;
//   // });


//     const filteredNotifications = allNotifications.filter(notif => {
//     const activeTypes = getActiveModuleTypes();

//     // Filter by active module
//     if (activeTypes.length && !activeTypes.includes(notif.notification_type)) {
//       return false;
//     }

//     // Filter by All / Unread / Recent
//     if (filter === 'unread' && notif.is_read) return false;
//     if (filter === 'recent' && !notif.is_recent) return false;

//     // Filter by date range
//     if (dateFilter !== 'all') {
//       const notifDate = new Date(notif.created_at);
//       const now = new Date();

//       if (dateFilter === 'today') {
//         const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//         if (notifDate < today) return false;
//       } else if (dateFilter === 'week') {
//         const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//         if (notifDate < weekAgo) return false;
//       } else if (dateFilter === 'month') {
//         const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//         if (notifDate < monthAgo) return false;
//       }
//     }

//     return true;
//   });


//   const getNotificationIcon = (type: string) => {
//     switch (type) {
//       case 'employee_registration': return <User className="w-5 h-5" />;
//       case 'training_scheduled':
//       case 'training_completed':
//       case 'refresher_training_scheduled':
//       case 'refresher_training_completed': return <BookOpen className="w-5 h-5" />;
//       case 'system_alert': return <AlertCircle className="w-5 h-5" />;
//       default: return <Bell className="w-5 h-5" />;
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'urgent': return 'bg-red-100 text-red-600 border-red-300';
//       case 'high': return 'bg-orange-100 text-orange-600 border-orange-300';
//       case 'medium': return 'bg-blue-100 text-blue-600 border-blue-300';
//       case 'low': return 'bg-gray-100 text-gray-600 border-gray-300';
//       default: return 'bg-gray-100 text-gray-600 border-gray-300';
//     }
//   };

//   const getNotificationTypeDisplay = (type: string) => {
//     return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//   };

//   // --- RENDER ---
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex justify-center items-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         {/* Header */}
//         <div className="p-6 bg-blue-900">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-3">
//               <Bell className="w-8 h-8 text-white" />
//               <h2 className="text-2xl font-bold text-white">Notifications</h2>
//               <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} title={isConnected ? 'Connected' : 'Disconnected'} />
//             </div>

//             <div className="flex items-center space-x-3">
//               <button onClick={resetLocalState} className="flex items-center space-x-2 px-3 py-2 text-sm text-yellow-100 bg-yellow-600 bg-opacity-75 rounded-lg hover:bg-opacity-100 transition" title="Clear local read/deleted state and refetch">
//                 <Zap className="w-4 h-4" />
//                 <span>Reset State</span>
//               </button>
//               {stats && stats.unread_count > 0 && (
//                 <button onClick={markAllAsRead} className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-100 bg-blue-700 bg-opacity-50 rounded-lg hover:bg-opacity-75 transition">
//                   <CheckCheck className="w-4 h-4" />
//                   <span>Mark all as read</span>
//                 </button>
//               )}
//               {stats && stats.total_count > 0 && (
//                 <button onClick={deleteAllNotifications} className="flex items-center space-x-2 px-3 py-2 text-sm text-red-100 bg-red-700 bg-opacity-50 rounded-lg hover:bg-opacity-75 transition">
//                   <Trash2 className="w-4 h-4" />
//                   <span>Delete all</span>
//                 </button>
//               )}
//             </div>
//           </div>
//           {stats && (
//             <div className="flex items-center space-x-6 mt-4 text-sm text-blue-100">
//               <span className="flex items-center space-x-1"><span className="w-2 h-2 bg-blue-300 rounded-full"></span><span>{stats.total_count} Total</span></span>
//               <span className="flex items-center space-x-1"><span className="w-2 h-2 bg-red-400 rounded-full"></span><span>{stats.unread_count} Unread</span></span>
//               <span className="flex items-center space-x-1"><span className="w-2 h-2 bg-green-400 rounded-full"></span><span>{stats.recent_count} Recent</span></span>
//             </div>
//           )}
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="p-4 bg-red-100 text-red-700 border-l-4 border-red-400">
//             <div className="flex items-center space-x-2">
//               <AlertCircle className="w-5 h-5" />
//               <span>{error}</span>
//             </div>
//           </div>
//         )}

//         {/* Module Tabs */}
//         {moduleTabs.length > 0 && (
//           <div className="border-b border-gray-200 bg-white">
//             <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Module Tabs">
//               {moduleTabs.map((tab) => {
//                 const isActive = tab.key === activeModuleKey;
//                 return (
//                   <button
//                     key={tab.key}
//                     onClick={() => handleModuleChange(tab.key)}
//                     className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
//                       isActive
//                         ? 'border-indigo-500 text-indigo-600'
//                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                     }`}
//                   >
//                     {tab.label}
//                     {typeof tab.count === 'number' && tab.count > 0 && (
//                       <span
//                         className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
//                           isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
//                         }`}
//                       >
//                         {tab.count}
//                       </span>
//                     )}
//                   </button>
//                 );
//               })}
//             </nav>
//           </div>
//         )}

//         {/* Filter Tabs */}
//         <div className="border-b border-gray-200">
//           <div className="flex items-center justify-between px-6">
//             <nav className="flex space-x-8" aria-label="Tabs">
//               {(['all', 'unread', 'recent'] as const).map((filterType) => (
//                 <button
//                   key={filterType}
//                   onClick={() => setFilter(filterType)}
//                   className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
//                     filter === filterType
//                       ? 'border-blue-500 text-blue-600'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//                 >
//                   {filterType}
//                   {filterType === 'unread' && stats && stats.unread_count > 0 && (
//                     <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
//                       {stats.unread_count}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </nav>

//             {/* Date Filter Dropdown */}
//             <div className="flex items-center space-x-2">
//               <span className="text-sm text-gray-500">Date:</span>
//               <select
//                 value={dateFilter}
//                 onChange={(e) => setDateFilter(e.target.value as any)}
//                 className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="all">All Time</option>
//                 <option value="today">Today</option>
//                 <option value="week">Last 7 Days</option>
//                 <option value="month">Last 30 Days</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Notification List */}
//         <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
//           {filteredNotifications.length > 0 ? (
//             filteredNotifications.map((notification) => (
//               <div
//                 key={notification.id}
//                 className={`p-6 transition-all duration-200 relative group ${
//                   notification.is_read ? 'bg-white' : 'bg-blue-50'
//                 } hover:bg-blue-100`}
//               >
//                 <div className="flex items-start space-x-4">
//                   <div className={`flex-shrink-0 p-2 rounded-full border ${getPriorityColor(notification.priority)}`}>
//                     {getNotificationIcon(notification.notification_type)}
//                   </div>
//                   <div className="flex-1 min-w-0 cursor-pointer" onClick={() => !notification.is_read && toggleReadStatus(notification.id)}>
//                     <div className="flex items-center justify-between">
//                       <h3 className={`text-lg font-semibold ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
//                         {notification.title}
//                       </h3>
//                       {!notification.is_read && <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" />}
//                     </div>
//                     <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
//                     <div className="flex items-center justify-between mt-3">
//                       <div className="flex items-center space-x-4 text-xs text-gray-500">
//                         <span className="flex items-center space-x-1">
//                           <Clock className="w-3 h-3" />
//                           <span>{notification.time_ago}</span>
//                         </span>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
//                           {notification.priority.toUpperCase()}
//                         </span>
//                         <span className="text-gray-400">{getNotificationTypeDisplay(notification.notification_type)}</span>
//                       </div>
//                       {notification.employee_name && (
//                         <span className="text-xs text-gray-500 flex items-center space-x-1">
//                           <User className="w-3 h-3" />
//                           <span>{notification.employee_name}</span>
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         toggleReadStatus(notification.id);
//                       }}
//                       className={`p-2 rounded-full transition-colors ${
//                         notification.is_read
//                           ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
//                           : 'text-blue-500 hover:text-blue-700 hover:bg-blue-100'
//                       }`}
//                       title={notification.is_read ? 'Mark as unread' : 'Mark as read'}
//                     >
//                       {notification.is_read ? <Check className="w-4 h-4" /> : <CheckCheck className="w-4 h-4" />}
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         deleteNotification(notification.id);
//                       }}
//                       className="p-2 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors"
//                       title="Delete"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="p-12 text-center text-gray-500">
//               <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
//               <p className="text-sm">
//                 {filter === 'unread'
//                   ? "You're all caught up!"
//                   : filter === 'recent'
//                   ? 'No notifications in the last 24 hours.'
//                   : 'There are no notifications to display.'}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="p-4 bg-gray-50 border-t border-gray-200">
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-gray-500">
//               {isConnected ? (
//                 <span className="flex items-center space-x-1 text-green-600">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span>Live updates enabled</span>
//                 </span>
//               ) : (
//                 <span className="flex items-center space-x-1 text-red-600">
//                   <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                   <span>Offline - showing cached data</span>
//                 </span>
//               )}
//             </div>
//             <button
//               onClick={() => {
//                 const activeTab = moduleTabs.find(t => t.key === activeModuleKey);
//                 const types = activeTab?.types;
//                 fetchNotifications(types);
//               }}
//               className="inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//               disabled={loading}
//             >
//               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//               <span>Refresh</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AppNotification;





// // import React, { useEffect, useState, useRef, useCallback } from 'react';
// // import { Bell, Check, CheckCheck, AlertCircle, Info, Clock, User, BookOpen, Calendar, RefreshCw, Trash2, Zap } from 'lucide-react';

// // // --- TYPE DEFINITIONS ---
// // interface Notification {
// //   id: number;
// //   title: string;
// //   message: string;
// //   notification_type: string;
// //   recipient_name?: string;
// //   employee_name?: string;
// //   level_name?: string;
// //   is_read: boolean;
// //   priority: 'low' | 'medium' | 'high' | 'urgent';
// //   created_at: string;
// //   time_ago: string;
// //   is_recent: boolean;
// //   metadata?: Record<string, any>;
// // }

// // interface NotificationStats {
// //   total_count: number;
// //   unread_count: number;
// //   read_count: number;
// //   recent_count: number;
// //   by_type: Record<string, number>;
// //   by_priority: Record<string, number>;
// // }


// // interface ModuleTab {
// //   key: string;
// //   label: string;
// //   types: string[];
// //   count: number;
// // }

// // // --- CONSTANTS ---
// // const API_BASE_URL = 'http://127.0.0.1:8000'; // Standardized base URL

// // const NOTIFICATION_TYPES = {
// //   EMPLOYEE_REGISTRATION: "employee_registration",
// //   LEVEL_EXAM_COMPLETED: "level_exam_completed",
// //   TRAINING_RESCHEDULE: "training_reschedule",
// //   REFRESHER_TRAINING_SCHEDULED: "refresher_training_scheduled",
// //   REFRESHER_TRAINING_COMPLETED: "refresher_training_completed",
// //   BENDING_TRAINING_ADDED: "bending_training_added",
// //   SYSTEM_ALERT: "system_alert",
// //   TRAINING_SCHEDULED: "training_scheduled",
// //   TRAINING_COMPLETED: "training_completed",
// //   HANCHOU_EXAM_COMPLETED: "hanchou_exam_completed",
// //   SHOKUCHOU_EXAM_COMPLETED: "shokuchou_exam_completed",
// //   TEN_CYCLE_EVALUATION_COMPLETED: "ten_cycle_evaluation_completed",
// //   OJT_COMPLETED: "ojt_completed",
// //   OJT_QUANTITY_COMPLETED: "ojt_quantity_completed",
// //   SKILL_MATRIX_UPDATED: "skill_matrix_updated",
// //   MULTISKILLING_SCHEDULED: "multiskilling_scheduled",
// //   MULTISKILLING_COMPLETED: "multiskilling_completed",
// //   MACHINE_ALLOCATED: "machine_allocated",
// //   TEST_ASSIGNED: "test_assigned",
// //   EVALUATION_COMPLETED: "evaluation_completed",
// //   RETRAINING_SCHEDULED: "retraining_scheduled",
// //   RETRAINING_COMPLETED: "retraining_completed",
// //   HUMAN_BODY_CHECK_COMPLETED: "human_body_check_completed",
// //   MILESTONE_REACHED: "milestone_reached"
// // } as const;


// // // --- COMPONENT ---
// // const AppNotification: React.FC = () => {
// //   const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
// //   const [stats, setStats] = useState<NotificationStats | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [filter, setFilter] = useState<'all' | 'unread' | 'recent'>('all');
// //   const [isConnected, setIsConnected] = useState(false);

// //   const [moduleTabs, setModuleTabs] = useState<ModuleTab[]>([]);
// //   const [activeModuleKey, setActiveModuleKey] = useState<string | null>(null);


// //   const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

// //   // --- HELPER FUNCTIONS ---
// //   const isRecentNotification = (dateString: string): boolean => {
// //     const now = new Date();
// //     const date = new Date(dateString);
// //     const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
// //     return diffInHours <= 24;
// //   };

// //   const formatTimeAgo = (dateString: string): string => {
// //     const now = new Date();
// //     const date = new Date(dateString);
// //     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
// //     if (diffInSeconds < 60) return 'Just now';
// //     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
// //     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
// //     return `${Math.floor(diffInSeconds / 86400)} days ago`;
// //   };

// //   // --- DATA FETCHING & PROCESSING ---
// //   const fetchNotifications = useCallback(async () => {
// //     // Only show full loader on first load, not background polls
// //     if (!pollIntervalRef.current) {
// //       setLoading(true);
// //     }
    
// //     try {
// //       // 1. Get local state of read/deleted notifications
// //       const readNotifications: number[] = JSON.parse(localStorage.getItem('readNotifications') || '[]');
// //       const deletedNotifications: number[] = JSON.parse(localStorage.getItem('deletedNotifications') || '[]');
// //       console.log('🔍 LocalStorage state:', { read: readNotifications, deleted: deletedNotifications });

// //       // 2. Fetch all relevant notifications from the API
// //       const params = new URLSearchParams();
// //       Object.values(NOTIFICATION_TYPES).forEach(type => params.append('notification_type', type));
      
// //       const response = await fetch(`${API_BASE_URL}/notifications/?${params}`);

// //       if (!response.ok) {
// //         throw new Error(`API request failed with status ${response.status}`);
// //       }
      
// //       const data = await response.json();
// //       console.log('📡 Full API Response:', data);
// //       const rawNotifications = data.results || data || [];

// //       // 3. Process the raw data: filter out deleted, then map and apply local read status
// //       const processedNotifications = rawNotifications
// //         .filter((notif: any) => !deletedNotifications.includes(notif.id)) // CRITICAL: Filter based on local state
// //         .map((notif: any): Notification => ({
// //           ...notif,
// //           is_read: readNotifications.includes(notif.id) || notif.is_read,
// //           time_ago: formatTimeAgo(notif.created_at),
// //           is_recent: isRecentNotification(notif.created_at)
// //         }));

// //       console.log(`✅ Processed and loaded ${processedNotifications.length} notifications.`);
// //       setAllNotifications(processedNotifications);
// //       setIsConnected(true);
// //       setError(null);

// //     } catch (err) {
// //       console.error('❌ Fetch error:', err);
// //       setError('Failed to connect to the notification service.');
// //       setIsConnected(false);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);





// //   // // --- LIFECYCLE HOOKS ---
// //   useEffect(() => {
// //     fetchNotifications(); // Initial fetch
    
// //     if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
// //     const intervalId = setInterval(fetchNotifications, 30000); // Poll every 30s
// //     pollIntervalRef.current = intervalId;

// //     return () => {
// //       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// //     };
// //   }, [fetchNotifications]);

  


// //   useEffect(() => {
// //     // This effect calculates stats whenever the main notification list changes
// //     const total_count = allNotifications.length;
// //     const unread_count = allNotifications.filter(n => !n.is_read).length;
// //     const recent_count = allNotifications.filter(n => n.is_recent).length;

// //     const by_type = allNotifications.reduce((acc, n) => {
// //       acc[n.notification_type] = (acc[n.notification_type] || 0) + 1;
// //       return acc;
// //     }, {} as Record<string, number>);

// //     const by_priority = allNotifications.reduce((acc, n) => {
// //       acc[n.priority] = (acc[n.priority] || 0) + 1;
// //       return acc;
// //     }, {} as Record<string, number>);

// //     setStats({
// //       total_count,
// //       unread_count,
// //       read_count: total_count - unread_count,
// //       recent_count,
// //       by_type,
// //       by_priority,
// //     });
// //   }, [allNotifications]);


// //   // --- USER ACTIONS ---
// //   const toggleReadStatus = async (notificationId: number) => {
// //     const notification = allNotifications.find(n => n.id === notificationId);
// //     if (!notification) return;

// //     const newReadState = !notification.is_read;

// //     setAllNotifications(prev =>
// //       prev.map(n => (n.id === notificationId ? { ...n, is_read: newReadState } : n))
// //     );

// //     const readIds: number[] = JSON.parse(localStorage.getItem('readNotifications') || '[]');
// //     if (newReadState) {
// //       if (!readIds.includes(notificationId)) {
// //         localStorage.setItem('readNotifications', JSON.stringify([...readIds, notificationId]));
// //       }
// //     } else {
// //       localStorage.setItem('readNotifications', JSON.stringify(readIds.filter(id => id !== notificationId)));
// //     }

// //     if (isConnected) {
// //       try {
// //         await fetch(`${API_BASE_URL}/notifications/${notificationId}/`, {
// //           method: 'PATCH',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify({ is_read: newReadState }),
// //         });
// //       } catch (err) { console.error('Server sync error for read status:', err); }
// //     }
// //   };

// //   const markAllAsRead = async () => {
// //     setAllNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
// //     const allIds = allNotifications.map(n => n.id);
// //     localStorage.setItem('readNotifications', JSON.stringify(allIds));

// //     if (isConnected) {
// //       try {
// //         await fetch(`${API_BASE_URL}/notifications/mark_all_read/`, { method: 'POST' });
// //       } catch (err) { console.error('Server mark all read error:', err); }
// //     }
// //   };
  
// //   const deleteNotification = async (notificationId: number) => {
// //     if (!window.confirm('Are you sure you want to delete this notification?')) return;
    
// //     setAllNotifications(prev => prev.filter(notif => notif.id !== notificationId));

// //     const deletedIds: number[] = JSON.parse(localStorage.getItem('deletedNotifications') || '[]');
// //     if (!deletedIds.includes(notificationId)) {
// //       localStorage.setItem('deletedNotifications', JSON.stringify([...deletedIds, notificationId]));
// //     }
    
// //     const readIds: number[] = JSON.parse(localStorage.getItem('readNotifications') || '[]');
// //     if (readIds.includes(notificationId)) {
// //       localStorage.setItem('readNotifications', JSON.stringify(readIds.filter(id => id !== notificationId)));
// //     }

// //     if (isConnected) {
// //       try {
// //         await fetch(`${API_BASE_URL}/notifications/${notificationId}/`, { method: 'DELETE' });
// //       } catch (err) { console.error('Server delete error:', err); }
// //     }
// //   };

// //   const deleteAllNotifications = async () => {
// //     if (!window.confirm('Are you sure you want to delete ALL notifications? This cannot be undone.')) return;

// //     const allIds = allNotifications.map(n => n.id);
// //     localStorage.setItem('deletedNotifications', JSON.stringify(allIds));
// //     localStorage.removeItem('readNotifications');
// //     setAllNotifications([]);

// //     if (isConnected) {
// //       try {
// //         await fetch(`${API_BASE_URL}/notifications/delete_all/`, { method: 'POST' });
// //       } catch (err) { console.error('Server delete all error:', err); }
// //     }
// //   };




// //   const resetLocalState = () => {
// //     if (window.confirm('This will clear all locally stored "read" and "deleted" history for notifications. This is useful for debugging if notifications seem to be missing. Continue?')) {
// //         localStorage.removeItem('readNotifications');
// //         localStorage.removeItem('deletedNotifications');
// //         fetchNotifications();
// //     }
// //   };

// //   // --- DERIVED STATE & DISPLAY HELPERS ---
// //   const filteredNotifications = allNotifications.filter(notif => {
// //     if (filter === 'unread') return !notif.is_read;
// //     if (filter === 'recent') return notif.is_recent;
// //     return true; // 'all'
// //   });

// //   const getNotificationIcon = (type: string) => { /* ... Unchanged ... */ };
// //   const getPriorityColor = (priority: string) => { /* ... Unchanged ... */ };
// //   const getNotificationTypeDisplay = (type: string) => { /* ... Unchanged ... */ };

// //   // --- RENDER ---
// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex justify-center items-center">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-8 ">
// //       <div className=" bg-white rounded-xl shadow-md overflow-hidden">
// //         {/* Header */}
// //         <div className="p-6 bg-blue-900">
// //           <div className="flex justify-between items-center">
// //             <div className="flex items-center space-x-3">
// //               <Bell className="w-8 h-8 text-white" />
// //               <h2 className="text-2xl font-bold text-white">Notifications</h2>
// //               <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} title={isConnected ? 'Connected' : 'Disconnected'} />
// //             </div>

// //             <div className="flex items-center space-x-3">
// //               <button onClick={resetLocalState} className="flex items-center space-x-2 px-3 py-2 text-sm text-yellow-100 bg-yellow-600 bg-opacity-75 rounded-lg hover:bg-opacity-100 transition" title="Clear local read/deleted state and refetch">
// //                 <Zap className="w-4 h-4" />
// //                 <span>Reset State</span>
// //               </button>
// //               {stats && stats.unread_count > 0 && (
// //                 <button onClick={markAllAsRead} className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-100 bg-blue-700 bg-opacity-50 rounded-lg hover:bg-opacity-75 transition">
// //                   <CheckCheck className="w-4 h-4" />
// //                   <span>Mark all as read</span>
// //                 </button>
// //               )}
// //               {stats && stats.total_count > 0 && (
// //                 <button onClick={deleteAllNotifications} className="flex items-center space-x-2 px-3 py-2 text-sm text-red-100 bg-red-700 bg-opacity-50 rounded-lg hover:bg-opacity-75 transition">
// //                   <Trash2 className="w-4 h-4" />
// //                   <span>Delete all</span>
// //                 </button>
// //               )}
// //             </div>
// //           </div>
// //           {stats && (
// //             <div className="flex items-center space-x-6 mt-4 text-sm text-blue-100">
// //               <span className="flex items-center space-x-1"><span className="w-2 h-2 bg-blue-300 rounded-full"></span><span>{stats.total_count} Total</span></span>
// //               <span className="flex items-center space-x-1"><span className="w-2 h-2 bg-red-400 rounded-full"></span><span>{stats.unread_count} Unread</span></span>
// //               <span className="flex items-center space-x-1"><span className="w-2 h-2 bg-green-400 rounded-full"></span><span>{stats.recent_count} Recent</span></span>
// //             </div>
// //           )}
// //         </div>

// //         {/* Error Message */}
// //         {error && (
// //           <div className="p-4 bg-red-100 text-red-700 border-l-4 border-red-400"><div className="flex items-center space-x-2"><AlertCircle className="w-5 h-5" /><span>{error}</span></div></div>
// //         )}





// //         {/* Filter Tabs */}
// //         <div className="border-b border-gray-200">
// //           <nav className="flex space-x-8 px-6" aria-label="Tabs">
// //             {(['all', 'unread', 'recent'] as const).map((filterType) => (
// //               <button key={filterType} onClick={() => setFilter(filterType)} className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${filter === filterType ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
// //                 {filterType}
// //                 {filterType === 'unread' && stats && stats.unread_count > 0 && (<span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">{stats.unread_count}</span>)}
// //               </button>
// //             ))}
// //           </nav>
// //         </div>

// //         {/* Notification List */}
// //         <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
// //           {filteredNotifications.length > 0 ? (
// //             filteredNotifications.map((notification) => (
// //               <div key={notification.id} className={`p-6 transition-all duration-200 relative group ${notification.is_read ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`}>
// //                 <div className="flex items-start space-x-4">
// //                   <div className={`flex-shrink-0 p-2 rounded-full border ${getPriorityColor(notification.priority)}`}>{getNotificationIcon(notification.notification_type)}</div>
// //                   <div className="flex-1 min-w-0 cursor-pointer" onClick={() => !notification.is_read && toggleReadStatus(notification.id)}>
// //                     <div className="flex items-center justify-between">
// //                       <h3 className={`text-lg font-semibold ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>{notification.title}</h3>
// //                       {!notification.is_read && <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" />}
// //                     </div>
// //                     <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
// //                     <div className="flex items-center justify-between mt-3">
// //                       <div className="flex items-center space-x-4 text-xs text-gray-500">
// //                         <span className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{notification.time_ago}</span></span>
// //                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>{notification.priority.toUpperCase()}</span>
// //                         <span className="text-gray-400">{getNotificationTypeDisplay(notification.notification_type)}</span>
// //                       </div>
// //                       {notification.employee_name && (<span className="text-xs text-gray-500 flex items-center space-x-1"><User className="w-3 h-3" /><span>{notification.employee_name}</span></span>)}
// //                     </div>
// //                   </div>
// //                   <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
// //                     <button onClick={(e) => { e.stopPropagation(); toggleReadStatus(notification.id); }} className={`p-2 rounded-full transition-colors ${notification.is_read ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'text-blue-500 hover:text-blue-700 hover:bg-blue-100'}`} title={notification.is_read ? 'Mark as unread' : 'Mark as read'}>
// //                       {notification.is_read ? <Check className="w-4 h-4" /> : <CheckCheck className="w-4 h-4" />}
// //                     </button>
// //                     <button onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }} className="p-2 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors" title="Delete">
// //                       <Trash2 className="w-4 h-4" />
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))
// //           ) : (
// //             <div className="p-12 text-center text-gray-500">
// //               <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
// //               <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
// //               <p className="text-sm">
// //                 {filter === 'unread' ? "You're all caught up!" : filter === 'recent' ? "No notifications in the last 24 hours." : "There are no notifications to display."}
// //               </p>
// //             </div>
// //           )}
// //         </div>

// //         {/* Footer */}
// //         <div className="p-4 bg-gray-50 border-t border-gray-200">
// //           <div className="flex items-center justify-between">
// //             <div className="text-sm text-gray-500">
// //               {isConnected ? (<span className="flex items-center space-x-1 text-green-600"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span>Live updates enabled</span></span>) : (<span className="flex items-center space-x-1 text-red-600"><div className="w-2 h-2 bg-red-500 rounded-full"></div><span>Offline - showing cached data</span></span>)}
// //             </div>
// //             <button onClick={fetchNotifications} className="inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
// //               <RefreshCw className="w-4 h-4" />
// //               <span>Refresh</span>
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AppNotification;


import React, { useState, useEffect, useRef } from 'react';
import { X, Bell, CheckCircle, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- TYPES ---
interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  created_at: string;
}

const API_BASE_URL = 'http://127.0.0.1:8000';
const POLLING_INTERVAL = 30000; // Check every 30 seconds

const NotificationPopup: React.FC = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  
  // Track the ID of the last notification we showed to the user
  // Initialize from session storage so we don't spam on refresh
  const lastSeenIdRef = useRef<number>(
    parseInt(sessionStorage.getItem('lastSeenNotificationId') || '0')
  );

  // --- HELPER: GET TOKEN SAFELY ---
  const getToken = (): string | null => {
    try {
      // 1. Check Redux Persist object (Common in your setup)
      const authStr = localStorage.getItem("auth");
      if (authStr) {
        const auth = JSON.parse(authStr);
        if (auth.accessToken) return auth.accessToken;
      }
      
      // 2. Check standard keys
      return localStorage.getItem("access_token") || localStorage.getItem("token");
    } catch (e) {
      console.error("Error parsing token", e);
      return null;
    }
  };

  // --- 1. PLAY SOUND ---
  const playSound = () => {
    try {
      const audio = new Audio('/assets/notification.mp3'); // Ensure this file exists in public/assets
      audio.play().catch(e => console.log('Audio play failed (browser policy)', e));
    } catch (e) {
      // Ignore audio errors
    }
  };

  // --- 2. CHECK FOR NEW NOTIFICATIONS ---
  const checkNotifications = async () => {
    const token = getToken();

    // If no user is logged in, don't poll
    if (!token) return;

    try {
      // Fetch only unread notifications to save bandwidth
      const response = await fetch(`${API_BASE_URL}/notifications/?is_read=false&limit=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <--- FIXES 401 ERROR
        }
      });

      if (response.status === 401) {
        // Token expired, stop polling or redirect (optional)
        return;
      }

      if (!response.ok) return;

      const data = await response.json();
      
      // Handle pagination result (Djang REST Framework usually returns { results: [...] })
      const latestNotification = Array.isArray(data) ? data[0] : (data.results ? data.results[0] : null);

      if (latestNotification) {
        // Check if this is a NEW notification we haven't shown yet
        if (latestNotification.id > lastSeenIdRef.current) {
          
          // Update state
          setNotification(latestNotification);
          setVisible(true);
          playSound();

          // Update ref and storage
          lastSeenIdRef.current = latestNotification.id;
          sessionStorage.setItem('lastSeenNotificationId', latestNotification.id.toString());
        }
      }
    } catch (error) {
      console.error('Notification polling error:', error);
    }
  };

  // --- 3. POLLING EFFECT ---
  useEffect(() => {
    // Check immediately on mount
    checkNotifications();

    // Set interval
    const intervalId = setInterval(checkNotifications, POLLING_INTERVAL);

    // Cleanup
    return () => clearInterval(intervalId);
  }, []);

  // --- 4. AUTO HIDE EFFECT ---
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 6000); // Disappear after 6 seconds
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // --- HELPER: STYLES ---
  const getStyles = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-50 border-l-4 border-red-500 text-red-800';
      case 'high': return 'bg-orange-50 border-l-4 border-orange-500 text-orange-800';
      case 'medium': return 'bg-blue-50 border-l-4 border-blue-500 text-blue-800';
      default: return 'bg-white border-l-4 border-gray-300 text-gray-800 shadow-lg';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'system_alert': return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'task_complete': return <CheckCircle className="w-6 h-6 text-green-500" />;
      default: return <Bell className="w-6 h-6 text-indigo-500" />;
    }
  };

  const handleClick = () => {
    setVisible(false);
    // Redirect to the full notification page
    navigate('/notification'); 
  };

  if (!visible || !notification) return null;

  return (
    <div className={`fixed top-20 right-5 z-50 max-w-sm w-full shadow-2xl rounded-lg pointer-events-auto transform transition-all duration-500 ease-in-out ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className={`rounded-lg shadow-lg overflow-hidden border border-gray-100 ${getStyles(notification.priority)}`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon(notification.notification_type)}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-bold text-gray-900">{notification.title}</p>
              <p className="mt-1 text-sm text-gray-600 leading-snug">{notification.message}</p>
              
              <div className="mt-3 flex space-x-3">
                <button
                  onClick={handleClick}
                  className="bg-white text-indigo-600 hover:text-indigo-800 text-xs font-semibold uppercase tracking-wide flex items-center gap-1"
                >
                  View Details <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setVisible(false)}
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
