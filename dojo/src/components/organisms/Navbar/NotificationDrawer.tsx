import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Bell,
  Check,
  Inbox,
  Info,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  BookOpen,
  Award,
  Wrench,
  Users,
} from 'lucide-react';

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
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  refreshNotifications: () => void;
}

const API_BASE_URL = 'http://127.0.0.1:8000/lms';

const getNotificationAppearance = (notification: NotificationItem) => {
  const type = notification.notification_type;
  const priority = notification.priority;

  if (priority === 'urgent' || type === 'system_alert') {
    return { icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', chip: 'text-rose-700 bg-rose-100' };
  }
  if (type.includes('completed') || type === 'milestone_reached') {
    return { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', chip: 'text-emerald-700 bg-emerald-100' };
  }
  if (type.includes('training') || type.includes('test')) {
    return { icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', chip: 'text-blue-700 bg-blue-100' };
  }
  if (type.includes('evaluation') || type.includes('exam')) {
    return { icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', chip: 'text-amber-700 bg-amber-100' };
  }
  if (type.includes('machine')) {
    return { icon: Wrench, color: 'text-cyan-600', bg: 'bg-cyan-50', chip: 'text-cyan-700 bg-cyan-100' };
  }
  if (type.includes('employee') || type.includes('user')) {
    return { icon: Users, color: 'text-violet-600', bg: 'bg-violet-50', chip: 'text-violet-700 bg-violet-100' };
  }

  return { icon: Info, color: 'text-indigo-600', bg: 'bg-indigo-50', chip: 'text-indigo-700 bg-indigo-100' };
};

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  refreshNotifications,
}) => {
  const navigate = useNavigate();
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const getAuthHeaders = () => {
    const authData = localStorage.getItem('auth');
    const token = authData ? JSON.parse(authData).accessToken : '';
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/mark_read/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      refreshNotifications();
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const handleOpenNotification = async (notification: NotificationItem) => {
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }

    onClose();
    navigate('/lms/notifications', {
      state: {
        notificationId: notification.id,
      },
    });
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/notifications/mark_all_read/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      refreshNotifications();
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const unreadCount = safeNotifications.filter((n) => !n.is_read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[60] transition-all"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-[70] border-l border-slate-200 flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Activity Feed</h2>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  {unreadCount > 0 ? `You have ${unreadCount} unread updates` : 'Everything is up to date'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {safeNotifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <Inbox size={32} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-bold text-slate-900">No notifications yet</p>
                  <p className="text-xs text-slate-400 mt-1">We&apos;ll let you know when something important happens.</p>
                </div>
              ) : (
                safeNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onOpen={() => handleOpenNotification(notification)}
                  />
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="w-full py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Check size={16} />
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => {
                  onClose();
                  navigate('/lms/notifications');
                }}
                className="w-full py-3 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Bell size={16} />
                Open notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const NotificationCard = ({
  notification,
  onOpen,
}: {
  notification: NotificationItem;
  onOpen: () => void;
}) => {
  const isUnread = !notification.is_read;
  const { icon: Icon, color, bg, chip } = getNotificationAppearance(notification);

  return (
    <button
      onClick={onOpen}
      className={`group relative w-full text-left p-4 rounded-2xl border transition-all duration-300
        ${isUnread
          ? 'bg-white border-slate-200 shadow-sm hover:border-indigo-200'
          : 'bg-slate-50/50 border-transparent opacity-80 hover:opacity-100'
        }`}
    >
      <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <p className={`text-sm font-bold tracking-tight truncate ${isUnread ? 'text-slate-900' : 'text-slate-600'}`}>
              {notification.title}
            </p>
            {isUnread && (
              <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)] shrink-0 mt-1" />
            )}
          </div>

          <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between mt-3 gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Clock size={12} />
              {notification.time_ago || new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${chip}`}>
              {notification.notification_type_display || notification.notification_type.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <span>Open message</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </button>
  );
};
