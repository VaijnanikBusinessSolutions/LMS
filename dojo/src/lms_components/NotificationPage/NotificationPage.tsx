import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Bell,
  Trash2,
  Check,
  AlertTriangle,
  CheckCircle,
  Inbox,
  Sparkles,
  Clock,
  X,
  BookOpen,
  Award,
  Wrench,
  Users,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { normalizeListResponse } from '../../utils/api';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  notification_type_display?: string;
  created_at: string;
  is_read: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  time_ago?: string;
  recipient_name?: string | null;
  employee_name?: string | null;
  level_name?: string | null;
  metadata?: Record<string, unknown>;
}

interface NotificationPageProps {
  selectedRole?: string;
}

const API_BASE_URL = 'http://127.0.0.1:8000/lms';

const getAuthHeaders = () => {
  const authData = localStorage.getItem('auth');
  const token = authData ? JSON.parse(authData).accessToken : '';
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const getNotificationAppearance = (notification: NotificationItem) => {
  const type = notification.notification_type;
  const priority = notification.priority;

  if (priority === 'urgent' || type === 'system_alert') {
    return {
      gradient: 'from-rose-500 to-pink-600',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      border: 'border-rose-200 dark:border-rose-800',
      iconClass: 'text-rose-500 dark:text-rose-400',
      badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
      icon: AlertTriangle,
    };
  }
  if (type.includes('completed') || type === 'milestone_reached') {
    return {
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      iconClass: 'text-emerald-500 dark:text-emerald-400',
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
      icon: CheckCircle,
    };
  }
  if (type.includes('training') || type.includes('test')) {
    return {
      gradient: 'from-blue-500 to-cyan-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      iconClass: 'text-blue-500 dark:text-blue-400',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      icon: BookOpen,
    };
  }
  if (type.includes('evaluation') || type.includes('exam')) {
    return {
      gradient: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      iconClass: 'text-amber-500 dark:text-amber-400',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      icon: Award,
    };
  }
  if (type.includes('machine')) {
    return {
      gradient: 'from-cyan-500 to-sky-600',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      border: 'border-cyan-200 dark:border-cyan-800',
      iconClass: 'text-cyan-500 dark:text-cyan-400',
      badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
      icon: Wrench,
    };
  }
  if (type.includes('employee') || type.includes('user')) {
    return {
      gradient: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      border: 'border-violet-200 dark:border-violet-800',
      iconClass: 'text-violet-500 dark:text-violet-400',
      badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
      icon: Users,
    };
  }

  return {
    gradient: 'from-slate-500 to-slate-700',
    bg: 'bg-slate-50 dark:bg-slate-800/50',
    border: 'border-slate-200 dark:border-slate-700',
    iconClass: 'text-slate-500 dark:text-slate-300',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    icon: Bell,
  };
};

const formatPriority = (priority?: string) => {
  if (!priority) return 'Normal';
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const NotificationPage: React.FC<NotificationPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/notifications/`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        navigate('/');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(normalizeListResponse<NotificationItem>(data));
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

  useEffect(() => {
    if (!notifications.length) return;

    const state = location.state as { notificationId?: number } | null;
    if (!state?.notificationId) return;

    const matchedNotification = notifications.find((item) => item.id === state.notificationId);
    if (matchedNotification) {
      setSelectedNotification(matchedNotification);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, notifications]);

  const markAsRead = useCallback(async (id: number) => {
    const notification = notifications.find((n) => n.id === id);
    if (!notification || notification.is_read) return;

    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    setSelectedNotification((prev) => (prev?.id === id ? { ...prev, is_read: true } : prev));

    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/mark_read/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  }, [notifications]);

  const markAsUnread = useCallback(async (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: false } : n)));
    setSelectedNotification((prev) => (prev?.id === id ? { ...prev, is_read: false } : prev));

    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/mark_unread/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error('Failed to mark unread', err);
    }
  }, []);

  const openNotification = useCallback((notification: NotificationItem) => {
    setSelectedNotification(notification);
    markAsRead(notification.id);
  }, [markAsRead]);

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setSelectedNotification((prev) => (prev ? { ...prev, is_read: true } : prev));

      await fetch(`${API_BASE_URL}/notifications/mark_all_read/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(id));

      setTimeout(async () => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setSelectedNotification((prev) => (prev?.id === id ? null : prev));
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });

        await fetch(`${API_BASE_URL}/notifications/${id}/`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
      }, 250);
    } catch (err) {
      console.error('Failed to delete notification', err);
      fetchNotifications();
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (filter === 'unread') return !notification.is_read;
      if (filter === 'read') return notification.is_read;
      return true;
    });
  }, [notifications, filter]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.is_read).length, [notifications]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200 dark:bg-violet-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-pulse delay-1000" />
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
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
                ? "You're all caught up."
                : "When you receive notifications, they'll appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => {
              const style = getNotificationAppearance(notification);
              const Icon = style.icon;
              const isDeleting = deletingIds.has(notification.id);

              return (
                <div
                  key={notification.id}
                  onClick={() => openNotification(notification)}
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
                  {!notification.is_read && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${style.gradient}`} />
                  )}

                  <div className="p-5 pl-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${style.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className={`w-5 h-5 ${style.iconClass}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
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

                            <p className={`text-sm leading-relaxed ${!notification.is_read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                              {notification.message}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 mt-3">
                              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                                <Clock className="w-3.5 h-3.5" />
                                {notification.time_ago || formatDate(notification.created_at)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${style.badge}`}>
                                {notification.notification_type_display || notification.notification_type.replace(/_/g, ' ')}
                              </span>
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                {formatPriority(notification.priority)} priority
                              </span>
                            </div>
                          </div>

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
                                <Check className="w-4 h-4" />
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

        <div className="h-8" />
      </div>

      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onMarkAsUnread={() => markAsUnread(selectedNotification.id)}
        />
      )}

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

const NotificationDetailModal = ({
  notification,
  onClose,
  onMarkAsUnread,
}: {
  notification: NotificationItem;
  onClose: () => void;
  onMarkAsUnread: () => void;
}) => {
  const style = getNotificationAppearance(notification);
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
        <div className={`h-1 w-full bg-gradient-to-r ${style.gradient}`} />
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-7 h-7 ${style.iconClass}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{notification.title}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${style.badge}`}>
                    {notification.notification_type_display || notification.notification_type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatPriority(notification.priority)} priority
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-5">
            <p className="text-sm leading-7 text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
              {notification.message}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {notification.employee_name && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Employee</p>
                <p className="mt-1 font-medium text-slate-800 dark:text-slate-100">{notification.employee_name}</p>
              </div>
            )}
            {notification.level_name && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Level</p>
                <p className="mt-1 font-medium text-slate-800 dark:text-slate-100">{notification.level_name}</p>
              </div>
            )}
            {notification.recipient_name && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Recipient</p>
                <p className="mt-1 font-medium text-slate-800 dark:text-slate-100">{notification.recipient_name}</p>
              </div>
            )}
            {notification.metadata && Object.keys(notification.metadata).length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Additional details</p>
                <pre className="mt-2 text-xs whitespace-pre-wrap break-words text-slate-600 dark:text-slate-300">
                  {JSON.stringify(notification.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            {notification.is_read && (
              <button
                onClick={onMarkAsUnread}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-violet-300 hover:text-violet-600 transition-colors"
              >
                Mark as unread
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
