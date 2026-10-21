import { useState, useEffect, useRef } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  Menu,
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  AlertCircle,
  Check,
} from "lucide-react";
import Sidebar from "../components/navigation/Sidebar";
import { useAuth } from "../hooks/useAuth";
import {
  getNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
} from "../services/notifications/notificationService";

export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const notifRef = useRef(null);

  const { user } = useAuth();

  useEffect(() => {
    let ignore = false;
    getNotificationsApi()
      .then((data) => {
        if (!ignore && data) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      })
      .catch(() => {});

    const interval = setInterval(() => {
      getNotificationsApi()
        .then((data) => {
          if (!ignore && data) {
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
          }
        })
        .catch(() => {});
    }, 15000);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  // Click outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    };
    if (notifDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifDropdownOpen]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationReadApi(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const renderNotifIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle size={16} className="text-warning" style={{ flexShrink: 0 }} />;
      case "alert":
        return <AlertCircle size={16} className="text-danger" style={{ flexShrink: 0 }} />;
      case "success":
        return <CheckCircle2 size={16} className="text-success" style={{ flexShrink: 0 }} />;
      default:
        return <Info size={16} className="text-primary" style={{ flexShrink: 0 }} />;
    }
  };

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main App Container */}
      <div className="main-content">
        {/* Top Navbar */}
        <header className="top-navbar" style={{ position: "relative" }}>
          <div className="flex-start gap-3">
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-icon-only lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open Navigation Sidebar"
              style={{ display: "none" }}
              id="mobile-nav-toggle"
            >
              <Menu size={20} />
            </button>

            <div className="flex-start gap-2">
              <span className="badge badge-primary">
                <ShieldCheck size={12} /> MediCore Portal
              </span>
              <span className="text-xs text-muted font-medium hidden sm:inline-block">
                Session Active &bull; {user?.role ? user.role.toUpperCase() : "PATIENT"}
              </span>
            </div>
          </div>

          <div className="flex-end gap-3" style={{ alignItems: "center" }}>
            {/* Quick Public View Link */}
            <Link to="/" className="btn btn-ghost btn-sm hidden md:inline-flex">
              Public Site
            </Link>

            {/* Notification Bell Dropdown Container */}
            <div style={{ position: "relative" }} ref={notifRef}>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-icon-only"
                style={{ position: "relative" }}
                aria-label="View notifications"
                onClick={() => setNotifDropdownOpen((prev) => !prev)}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      minWidth: "16px",
                      height: "16px",
                      padding: "0 4px",
                      borderRadius: "8px",
                      backgroundColor: "var(--color-danger)",
                      color: "white",
                      fontSize: "10px",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Floating Popover */}
              {notifDropdownOpen && (
                <div
                  className="animate-fade-in"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: "360px",
                    maxWidth: "90vw",
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-card)",
                    boxShadow: "var(--shadow-dropdown)",
                    zIndex: "var(--z-dropdown)",
                    overflow: "hidden",
                  }}
                >
                  {/* Popover Header */}
                  <div
                    className="flex-between p-3"
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      backgroundColor: "var(--color-surface-subtle)",
                    }}
                  >
                    <div className="flex-start gap-2">
                      <span className="font-semibold text-sm text-main">Clinical Notices</span>
                      {unreadCount > 0 && (
                        <span className="badge badge-primary text-xs">{unreadCount} New</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs text-primary"
                        onClick={handleMarkAllRead}
                        style={{ fontSize: "11px", padding: "2px 6px" }}
                      >
                        <Check size={12} className="mr-1" /> Mark all read
                      </button>
                    )}
                  </div>

                  {/* Popover List */}
                  <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => !n.isRead && handleMarkRead(n.id)}
                          className="p-3 border-bottom flex-start gap-3 cursor-pointer"
                          style={{
                            borderBottom: "1px solid var(--color-border)",
                            backgroundColor: n.isRead ? "transparent" : "var(--color-primary-50)",
                            transition: "background-color var(--transition-fast)",
                          }}
                        >
                          {renderNotifIcon(n.type)}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="flex-between">
                              <span className="font-semibold text-xs text-main truncate">
                                {n.title}
                              </span>
                              {!n.isRead && (
                                <span
                                  style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "var(--color-primary)",
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                            </div>
                            <p
                              className="text-xs text-body mt-1"
                              style={{
                                margin: "4px 0 0 0",
                                lineHeight: 1.4,
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {n.message}
                            </p>
                            <span
                              className="text-muted block mt-1"
                              style={{ fontSize: "10px" }}
                            >
                              {n.createdAt ? new Date(n.createdAt).toLocaleDateString() + " " + new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recently"} &bull; {n.createdBy}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-8 text-muted text-xs">
                        <CheckCircle2 size={28} className="text-success mb-2" style={{ margin: "0 auto" }} />
                        <p>No announcements right now.</p>
                        <span>You are completely up to date.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill linking to /profile */}
            <Link
              to="/profile"
              className="flex-start gap-2 border-left pl-3"
              style={{
                borderLeft: "1px solid var(--color-border)",
                textDecoration: "none",
                cursor: "pointer",
              }}
              title="Click to view & update your profile"
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "var(--font-size-xs)",
                  transition: "transform var(--transition-fast)",
                }}
              >
                {user?.avatar || (user?.name ? user.name.slice(0, 2).toUpperCase() : "MC")}
              </div>
              <div className="hidden sm:block text-left">
                <div
                  style={{
                    fontSize: "var(--font-size-xs)",
                    fontWeight: "var(--font-weight-bold)",
                    color: "var(--color-text-main)",
                    lineHeight: 1,
                  }}
                >
                  {user?.name || "Patient"}
                </div>
                <span className="text-xs text-muted" style={{ fontSize: "10px" }}>
                  {user?.email}
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="page-container" style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          #mobile-nav-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}