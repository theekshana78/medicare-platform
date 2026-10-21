import { Link } from "react-router-dom";
import { HeartPulse, PhoneCall, Mail, MapPin, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        marginTop: "auto",
        padding: "3.5rem 0 2rem",
      }}
    >
      <div className="layout-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand Info */}
          <div className="flex-col gap-3">
            <div className="flex-start gap-2">
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
                  fontSize: "var(--font-size-xl)",
                  fontWeight: "var(--font-weight-bold)",
                  color: "var(--color-text-main)",
                }}
              >
                Medi<span style={{ color: "var(--color-primary)" }}>Core</span>
              </span>
            </div>
            <p className="text-sm text-muted" style={{ lineHeight: "1.6" }}>
              Next-generation healthcare management platform designed for hospitals, doctors, and patients. Streamlined clinical scheduling and records.
            </p>
            <div className="flex-start gap-2">
              <span className="badge badge-success">
                <ShieldCheck size={12} /> Encrypted Health Records
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex-col gap-2">
            <h4 style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-main)" }}>
              Platform
            </h4>
            <Link to="/about" className="link text-sm">About MediCore</Link>
            <Link to="/services" className="link text-sm">Clinical Services</Link>
            <Link to="/doctors" className="link text-sm">Doctor Directory</Link>
            <Link to="/contact" className="link text-sm">Help & Support</Link>
          </div>

          {/* Access Portals */}
          <div className="flex-col gap-2">
            <h4 style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-main)" }}>
              Access Portals
            </h4>
            <Link to="/login" className="link text-sm">Patient Sign In</Link>
            <Link to="/doctor/login" className="link text-sm font-medium text-primary">Doctor Consultation Portal</Link>
            <Link to="/admin/login" className="link text-sm font-medium text-warning">Administrator Console</Link>
            <Link to="/register" className="link text-sm">Create Patient Account</Link>
          </div>

          {/* Emergency & Contact */}
          <div className="flex-col gap-3">
            <h4 style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-bold)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-main)" }}>
              24/7 Clinical Contact
            </h4>
            <div className="flex-start gap-2 text-sm text-muted">
              <PhoneCall size={16} className="text-primary" />
              <span>Emergency: +94 (11) 234-5678</span>
            </div>
            <div className="flex-start gap-2 text-sm text-muted">
              <Mail size={16} className="text-primary" />
              <span>care@medicore.health</span>
            </div>
            <div className="flex-start gap-2 text-sm text-muted">
              <MapPin size={16} className="text-primary" />
              <span>Colombo Healthcare District, Sri Lanka</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-top flex-between"
          style={{
            paddingTop: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "var(--font-size-xs)",
            color: "var(--color-text-muted)",
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} MediCore Healthcare System. Developed for Professional Portfolio.
          </div>
          <div className="flex-start gap-4">
            <span className="link">Privacy Policy</span>
            <span className="link">Terms of Service</span>
            <span className="link">HIPAA Security Overview</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
