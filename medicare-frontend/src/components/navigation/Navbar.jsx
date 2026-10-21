import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HeartPulse, Menu, X, Calendar, UserCheck } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Find Doctors", path: "/doctors" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="top-navbar">
      <div className="layout-container flex-between w-full" style={{ padding: 0 }}>
        {/* Brand Logo */}
        <Link to="/" className="flex-start gap-2" style={{ textDecoration: "none" }}>
          <div
            style={{
              backgroundColor: "var(--color-primary)",
              color: "white",
              padding: "0.5rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HeartPulse size={22} />
          </div>
          <div>
            <span
              style={{
                fontSize: "var(--font-size-xl)",
                fontWeight: "var(--font-weight-bold)",
                color: "var(--color-text-main)",
                letterSpacing: "-0.02em",
              }}
            >
              Medi<span style={{ color: "var(--color-primary)" }}>Core</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: "none",
            alignItems: "center",
            gap: "1.75rem",
          }}
          className="desktop-nav-links"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                fontSize: "var(--font-size-sm)",
                fontWeight: isActive ? "var(--font-weight-semibold)" : "var(--font-weight-medium)",
                color: isActive ? "var(--color-primary)" : "var(--color-text-body)",
                textDecoration: "none",
                transition: "color var(--transition-fast)",
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Auth & Booking Action Buttons */}
        <div style={{ display: "none", alignItems: "center", gap: "0.75rem" }} className="desktop-nav-actions">
          <Link to="/login" className="btn btn-ghost btn-sm">
            <UserCheck size={16} /> Sign In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            <Calendar size={16} /> Book Appointment
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-icon-only mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
            padding: "1.25rem var(--space-6)",
            boxShadow: "var(--shadow-dropdown)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            zIndex: "var(--z-dropdown)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: "var(--font-size-base)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--color-text-main)",
                padding: "0.5rem 0",
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link
              to="/login"
              className="btn btn-outline btn-block"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn btn-primary btn-block"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Appointment
            </Link>
          </div>
        </div>
      )}

      {/* Responsive Inline CSS for Desktop Display */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav-links { display: flex !important; }
          .desktop-nav-actions { display: flex !important; }
          .mobile-toggle-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}
