import { Link, NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  HeartPulse,
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  Stethoscope,
  Users,
  FileText,
  User,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Badge from "../common/Badge";

export default function Sidebar({ mobileOpen = false, onCloseMobile = () => {} }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNavLinks = () => {
    if (!user) return [];

    if (user.role === "patient") {
      return [
        { label: "My Health Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
        { label: "Book Appointment", path: "/appointments/book", icon: <CalendarPlus size={18} /> },
        { label: "My Appointments", path: "/appointments", icon: <Calendar size={18} /> },
        { label: "Find Specialists", path: "/doctors", icon: <Stethoscope size={18} /> },
        { label: "My Health Profile", path: "/profile", icon: <User size={18} /> },
      ];
    }

    if (user.role === "doctor") {
      return [
        { label: "Doctor Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
        { label: "Patient Appointments", path: "/appointments", icon: <Calendar size={18} /> },
        { label: "Doctor Directory", path: "/doctors", icon: <Stethoscope size={18} /> },
        { label: "Doctor Profile", path: "/profile", icon: <User size={18} /> },
      ];
    }

    if (user.role === "admin") {
      return [
        { label: "Executive Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
        { label: "All Appointments", path: "/appointments", icon: <Calendar size={18} /> },
        { label: "Doctor Verifications", path: "/doctors", icon: <Users size={18} /> },
        { label: "System Design Tokens", path: "/design-system", icon: <FileText size={18} /> },
        { label: "Administrator Profile", path: "/profile", icon: <User size={18} /> },
      ];
    }

    return [];
  };

  const links = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: "calc(var(--z-drawer) - 1)" }}
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}
        style={{
          transform: mobileOpen ? "translateX(0)" : undefined,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid var(--color-border)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        {/* Top Brand Header */}
        <div>
          <div
            style={{
              height: "var(--header-height)",
              borderBottom: "1px solid var(--color-border)",
              padding: "0 var(--space-6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link to="/dashboard" className="flex-start gap-2" style={{ textDecoration: "none" }}>
              <div
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  padding: "0.375rem",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                }}
              >
                <HeartPulse size={20} />
              </div>
              <span
                style={{
                  fontSize: "var(--font-size-lg)",
                  fontWeight: "var(--font-weight-bold)",
                  color: "var(--color-text-main)",
                }}
              >
                Medi<span style={{ color: "var(--color-primary)" }}>Core</span>
              </span>
            </Link>

            <button
              type="button"
              className="btn btn-ghost btn-sm btn-icon-only mobile-close-btn"
              onClick={onCloseMobile}
              style={{ display: "none" }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <div style={{ padding: "1.25rem var(--space-4)" }}>
            <span
              style={{
                fontSize: "var(--font-size-xs)",
                fontWeight: "var(--font-weight-bold)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--color-text-subtle)",
                padding: "0 var(--space-3)",
                display: "block",
                marginBottom: "0.75rem",
              }}
            >
              Clinical Navigation
            </span>

            <nav className="flex-col gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/dashboard"}
                  onClick={onCloseMobile}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.625rem 0.875rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--font-size-sm)",
                    fontWeight: isActive ? "var(--font-weight-semibold)" : "var(--font-weight-medium)",
                    color: isActive ? "var(--color-primary)" : "var(--color-text-body)",
                    backgroundColor: isActive ? "var(--color-primary-50)" : "transparent",
                    textDecoration: "none",
                    transition: "all var(--transition-fast)",
                  })}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Section: Authenticated User Profile */}
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            padding: "1rem var(--space-4)",
            backgroundColor: "var(--color-surface-subtle)",
          }}
        >
          {/* User Card linking to Profile */}
          <div className="flex-between">
            <Link
              to="/profile"
              className="flex-start gap-2"
              style={{ textDecoration: "none", minWidth: 0 }}
              title="Click to view & edit your profile"
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary-100)",
                  color: "var(--color-primary-800)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "var(--font-size-xs)",
                  flexShrink: 0,
                }}
              >
                {user?.avatar || (user?.name ? user.name.slice(0, 2).toUpperCase() : "MC")}
              </div>
              <div style={{ minWidth: 0, maxWidth: "130px" }}>
                <div
                  className="truncate"
                  style={{ fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-main)" }}
                >
                  {user?.name || "Patient"}
                </div>
                <Badge
                  variant={user?.role === "admin" ? "danger" : user?.role === "doctor" ? "info" : "success"}
                  style={{ fontSize: "9px", padding: "1px 5px" }}
                >
                  {user?.role ? user.role.toUpperCase() : "PATIENT"}
                </Badge>
              </div>
            </Link>

            <button
              type="button"
              className="btn btn-ghost btn-sm btn-icon-only text-danger"
              onClick={handleLogout}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 1023px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform var(--transition-normal);
            z-index: var(--z-drawer);
          }
          .sidebar.mobile-open {
            transform: translateX(0);
          }
          .mobile-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}

Sidebar.propTypes = {
  mobileOpen: PropTypes.bool,
  onCloseMobile: PropTypes.func,
};