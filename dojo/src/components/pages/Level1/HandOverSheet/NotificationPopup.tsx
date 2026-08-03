import React, { useEffect, useMemo, useState } from "react";
import { Bell, Eye, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hasAnyModuleAccess } from "../../../constants/permissions";
import type { RootState } from "../../../../store/store";

const NOTIFICATION_POLL_INTERVAL = 30000;

const NotificationPopup: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const storageKey = useMemo(() => {
    if (!user?.id) {
      return null;
    }

    return `notification-baseline:${user.id}`;
  }, [user?.id]);

  useEffect(() => {
    if (!accessToken || !storageKey) {
      setShowToast(false);
      setNotificationCount(0);
      return;
    }

    let isMounted = true;

    const syncUnreadCount = async (isInitialLoad = false) => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/lms/notifications/unread_count/",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!response.ok || !isMounted) {
          return;
        }

        const data = await response.json();
        const unreadCount = Number(data.unread_count || 0);
        const previousCount = Number(sessionStorage.getItem(storageKey) ?? -1);

        setNotificationCount(unreadCount);

        if (isInitialLoad || previousCount < 0) {
          sessionStorage.setItem(storageKey, String(unreadCount));
          return;
        }

        if (unreadCount > previousCount) {
          setIsClosing(false);
          setShowToast(true);
        } else if (unreadCount === 0) {
          setShowToast(false);
        }

        sessionStorage.setItem(storageKey, String(unreadCount));
      } catch (error) {
        if (error instanceof TypeError) {
          console.warn("Notification unread-count service unavailable");
          return;
        }
        console.error("Failed to fetch notifications", error);
      }
    };

    syncUnreadCount(true);
    const intervalId = window.setInterval(() => {
      syncUnreadCount(false);
    }, NOTIFICATION_POLL_INTERVAL);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [accessToken, storageKey]);

  const closeToast = () => {
    setIsClosing(true);

    window.setTimeout(() => {
      setShowToast(false);
      setIsClosing(false);
    }, 240);
  };

  const markNotificationsAsRead = async () => {
    if (!accessToken || !storageKey) {
      return;
    }

    try {
      await fetch("http://127.0.0.1:8000/lms/notifications/mark_all_read/", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      sessionStorage.setItem(storageKey, "0");
      setNotificationCount(0);
    } catch (error) {
      if (error instanceof TypeError) {
        console.warn("Notification mark-all-read service unavailable");
        return;
      }
      console.error("Error clearing notifications", error);
    }
  };

  const handleDismiss = async () => {
    await markNotificationsAsRead();
    closeToast();
  };

  const handleView = async () => {
    await markNotificationsAsRead();
    closeToast();

    const notificationRoute = hasAnyModuleAccess(user, ["notifications_page", "notifications"])
      ? "/lms/notifications"
      : "/notification";

    window.setTimeout(() => {
      navigate(notificationRoute);
    }, 240);
  };

  if (!showToast || notificationCount <= 0) {
    return null;
  }

  return (
    <>
      <style>
        {`
          @keyframes notification-slide-in {
            from {
              opacity: 0;
              transform: translate3d(24px, 0, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }

          @keyframes notification-slide-out {
            from {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
            to {
              opacity: 0;
              transform: translate3d(24px, 0, 0);
            }
          }
        `}
      </style>

      <div
        style={{
          position: "fixed",
          top: "96px",
          right: "24px",
          zIndex: 9999,
          width: "360px",
          maxWidth: "calc(100vw - 32px)",
          animation: `${isClosing ? "notification-slide-out" : "notification-slide-in"} 0.24s ease forwards`,
        }}
      >
        <div
          style={{
            overflow: "hidden",
            borderRadius: "20px",
            border: "1px solid rgba(45, 212, 191, 0.22)",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              padding: "18px 18px 14px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                flexShrink: 0,
                borderRadius: "14px",
                background: "linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bell size={22} />
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  New Notification
                </h3>
                <button
                  type="button"
                  onClick={closeToast}
                  style={{
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    color: "#64748b",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "14px",
                  lineHeight: 1.5,
                  color: "#475569",
                }}
              >
                You have <strong>{notificationCount}</strong> unread assignment
                {notificationCount > 1 ? "s" : ""}.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              padding: "0 18px 18px",
            }}
          >
            <button
              type="button"
              onClick={handleView}
              style={{
                flex: 1,
                border: "none",
                borderRadius: "12px",
                padding: "11px 14px",
                background: "linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)",
                color: "#ffffff",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Eye size={16} />
              View
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              style={{
                border: "1px solid #cbd5e1",
                borderRadius: "12px",
                padding: "11px 14px",
                background: "#ffffff",
                color: "#334155",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPopup;
