import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bell, 
  Check, 
  Inbox, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  Clock
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: any[];
  refreshNotifications: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  refreshNotifications,
}) => {
  const API_BASE_URL = 'http://127.0.0.1:8000/lms';
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const getAuthHeaders = () => {
    const authData = localStorage.getItem("auth");
    const token = authData ? JSON.parse(authData).accessToken : "";
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // ACTION: Mark Single as Read
  const handleMarkAsRead = async (id: number) => {
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/mark_read/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      refreshNotifications(); // Updates the Navbar badge automatically
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  // ACTION: Mark All as Read
  const handleMarkAllAsRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/notifications/mark_all_read/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      refreshNotifications();
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };

  const unreadCount = safeNotifications.filter(n => !n.is_read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* GLASS OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[60] transition-all"
          />

          {/* SIDE DRAWER */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-[70] border-l border-slate-200 flex flex-col"
          >
            {/* HEADER */}
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

            {/* NOTIFICATION LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {safeNotifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <Inbox size={32} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-bold text-slate-900">No notifications yet</p>
                  <p className="text-xs text-slate-400 mt-1">We'll let you know when something important happens.</p>
                </div>
              ) : (
                safeNotifications.map((n) => (
                  <NotificationItem 
                    key={n.id} 
                    notification={n} 
                    onRead={() => handleMarkAsRead(n.id)} 
                  />
                ))
              )}
            </div>

            {/* FOOTER ACTION */}
            {unreadCount > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={handleMarkAllAsRead}
                  className="w-full py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Check size={16} />
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* --- SUB-COMPONENT FOR CLEANER CODE --- */

const NotificationItem = ({ notification, onRead }: { notification: any; onRead: () => void }) => {
  const isUnread = !notification.is_read;

  // Visual helper for type-based icons
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'success': return { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' };
      case 'warning': return { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' };
      case 'error': return { icon: X, color: 'text-rose-600', bg: 'bg-rose-50' };
      default: return { icon: Info, color: 'text-indigo-600', bg: 'bg-indigo-50' };
    }
  };

  const { icon: Icon, color, bg } = getTypeConfig(notification.notification_type);

  return (
    <div 
      onClick={onRead}
      className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer
        ${isUnread 
          ? 'bg-white border-slate-200 shadow-sm hover:border-indigo-200' 
          : 'bg-slate-50/50 border-transparent opacity-60 hover:opacity-100'
        }
      `}
    >
      <div className="flex gap-4">
        {/* ICON BOX */}
        <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p className={`text-sm font-bold tracking-tight truncate ${isUnread ? 'text-slate-900' : 'text-slate-600'}`}>
              {notification.title}
            </p>
            {isUnread && (
              <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Clock size={12} />
              {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <ArrowRight size={14} className="text-indigo-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
};
