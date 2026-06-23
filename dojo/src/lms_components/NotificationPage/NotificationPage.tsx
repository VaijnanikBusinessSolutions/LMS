


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Bell, User, BookOpen, Award, Trash2, 
  Check, Shield, AlertTriangle, CheckCircle, ArrowRight, Eye, ChevronDown, ChevronUp,
  Sparkles, Inbox, Filter, MoreHorizontal, Clock, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Interfaces ---

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  notification_type: NotificationType;
  created_at: string;
  is_read: boolean;
  sender_name?: string; 
  related_object_id?: number; 
}

interface NotificationPageProps {
  selectedRole?: string; 
}

const NotificationPage: React.FC<NotificationPageProps> = ({ selectedRole }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  // --- API Configuration ---
  const API_BASE_URL = 'http://127.0.0.1:8000/lms';
  
  const getAuthHeaders = () => {
    const authData = localStorage.getItem("auth");
    const token = authData ? JSON.parse(authData).accessToken : "";
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // --- Fetch Notifications ---
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/notifications/`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError('Could not load notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // --- Actions ---

  const markAsRead = async (id: number) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && notification.is_read) return;

    try {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );

      await fetch(`${API_BASE_URL}/notifications/${id}/mark_read/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
      markAsRead(id);
    }
    setExpandedIds(newExpanded);
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      
      await fetch(`${API_BASE_URL}/notifications/mark_all_read/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      setDeletingIds(prev => new Set(prev).add(id));
      
      // Animate out then remove
      setTimeout(async () => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        setDeletingIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        
        await fetch(`${API_BASE_URL}/notifications/${id}/`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
      }, 300);
    } catch (err) {
      console.error("Failed to delete", err);
      fetchNotifications();
    }
  };

  // --- Helpers ---

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (filter === 'unread') return !n.is_read;
      if (filter === 'read') return n.is_read;
      return true;
    });
  }, [notifications, filter]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.is_read).length;
  }, [notifications]);

  const getNotificationStyle = (type: NotificationType) => {
    switch (type) {
      case 'error':
        return {
          gradient: 'from-rose-500 to-pink-600',
          bg: 'bg-rose-50 dark:bg-rose-900/20',
          border: 'border-rose-200 dark:border-rose-800',
          icon: 'text-rose-500 dark:text-rose-400',
          badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
        };
      case 'warning':
        return {
          gradient: 'from-amber-500 to-orange-600',
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          icon: 'text-amber-500 dark:text-amber-400',
          badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
        };
      case 'success':
        return {
          gradient: 'from-emerald-500 to-teal-600',
          bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          border: 'border-emerald-200 dark:border-emerald-800',
          icon: 'text-emerald-500 dark:text-emerald-400',
          badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
        };
      default:
        return {
          gradient: 'from-violet-500 to-purple-600',
          bg: 'bg-violet-50 dark:bg-violet-900/20',
          border: 'border-violet-200 dark:border-violet-800',
          icon: 'text-violet-500 dark:text-violet-400',
          badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
        };
    }
  };

  const getNotificationIcon = (type: NotificationType, title: string) => {
    const style = getNotificationStyle(type);
    const className = `w-5 h-5 ${style.icon}`;
    
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("course")) return <BookOpen className={className} />;
    if (lowerTitle.includes("test") || lowerTitle.includes("result")) return <Award className={className} />;
    if (lowerTitle.includes("user") || lowerTitle.includes("welcome")) return <User className={className} />;
    if (lowerTitle.includes("request") || lowerTitle.includes("enrollment")) return <Shield className={className} />;
    
    if (type === 'warning') return <AlertTriangle className={className} />;
    if (type === 'success') return <CheckCircle className={className} />;
    return <Bell className={className} />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200 dark:bg-violet-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-pulse delay-1000" />
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Bell className="w-7 h-7 text-white" />
                </div>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Notifications</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {unreadCount > 0 ? `${unreadCount} unread messages` : 'All caught up!'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="group flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-400 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300"
              >
                <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="mt-6 flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              {[
                { key: 'all', label: 'All', icon: Inbox },
                { key: 'unread', label: 'Unread', icon: Sparkles },
                { key: 'read', label: 'Read', icon: Check },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as 'all' | 'unread' | 'read')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filter === key
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/30'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {key === 'unread' && unreadCount > 0 && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded-md text-xs ${
                      filter === key ? 'bg-white/20' : 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                    }`}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-violet-100 dark:border-violet-900/30" />
              <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
            </div>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-rose-200 dark:border-rose-900/30 p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-rose-500 dark:text-rose-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">{error}</h3>
            <button 
              onClick={fetchNotifications} 
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-xl">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Inbox className="w-10 h-10 text-violet-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {filter === 'unread' 
                ? "You're all caught up! Take a moment to celebrate 🎉" 
                : "When you receive notifications, they'll appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => {
              const isExpanded = expandedIds.has(notification.id);
              const isLongMessage = notification.message.length > 120;
              const style = getNotificationStyle(notification.notification_type);
              const isDeleting = deletingIds.has(notification.id);

              return (
                <div
                  key={notification.id}
                  onClick={() => !isExpanded && markAsRead(notification.id)}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    opacity: isDeleting ? 0 : 1,
                    transform: isDeleting ? 'translateX(100px) scale(0.95)' : 'translateX(0) scale(1)',
                  }}
                  className={`group relative bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-300 cursor-pointer animate-fadeIn overflow-hidden ${
                    !notification.is_read 
                      ? `${style.border} shadow-lg hover:shadow-xl` 
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Unread Indicator Bar */}
                  {!notification.is_read && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${style.gradient}`} />
                  )}

                  <div className="p-5 pl-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${style.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                        {getNotificationIcon(notification.notification_type, notification.title)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {/* Title Row */}
                            <div className="flex items-center flex-wrap gap-2 mb-1.5">
                              <h3 className={`font-semibold ${!notification.is_read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                {notification.title}
                              </h3>
                              {!notification.is_read && (
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.badge}`}>
                                  <Sparkles className="w-3 h-3" />
                                  New
                                </span>
                              )}
                            </div>

                            {/* Message */}
                            <p className={`text-sm leading-relaxed transition-all duration-300 ${
                              !notification.is_read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'
                            }`}>
                              {isExpanded 
                                ? notification.message 
                                : (isLongMessage ? `${notification.message.substring(0, 120)}...` : notification.message)
                              }
                            </p>

                            {/* Read More Toggle */}
                            {isLongMessage && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpand(notification.id);
                                }}
                                className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-3.5 h-3.5" />
                                    Show less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                    Read more
                                  </>
                                )}
                              </button>
                            )}

                            {/* Meta Info */}
                            <div className="flex items-center gap-3 mt-3">
                              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                                <Clock className="w-3.5 h-3.5" />
                                {formatDate(notification.created_at)}
                              </span>
                              {notification.sender_name && (
                                <>
                                  <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                                  <span className="text-xs text-slate-400 dark:text-slate-500">
                                    From {notification.sender_name}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Action Button */}
                            {notification.title.includes("Enrollment Request") && notification.related_object_id && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  markAsRead(notification.id);
                                  navigate(`/lms/admin/request-review/${notification.related_object_id}`, {
                                    state: { notification: notification }
                                  });
                                }} 
                                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-violet-500/30 hover:shadow-lg hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                              >
                                Review Request
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {!notification.is_read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="p-2 text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
                                title="Mark as read"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Spacer */}
        <div className="h-8" />
      </div>

      {/* Add custom animation styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default NotificationPage;