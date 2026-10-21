import { Outlet, Link } from "react-router-dom";
import { HeartPulse, ShieldCheck, CheckCircle2, Award } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="split-layout">
      {/* Left Column: Form Content */}
      <div className="split-layout-form-side">
        <div className="split-layout-form-container">
          {/* Top Brand Link */}
          <div className="mb-6">
            <Link to="/" className="flex-start gap-2" style={{ textDecoration: "none" }}>
              <div
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  padding: "0.5rem",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                }}
              >
                <HeartPulse size={22} />
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
            </Link>
          </div>

          <Outlet />
        </div>
      </div>

      {/* Right Column: Healthcare Brand Hero Showcase */}
      <div className="split-layout-brand-side">
        <div className="flex-between">
          <span className="badge badge-primary" style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", color: "white" }}>
            <ShieldCheck size={14} /> Enterprise Medical Security
          </span>
          <span style={{ fontSize: "var(--font-size-xs)", opacity: 0.8 }}>
            v1.0.0 Portfolio Release
          </span>
        </div>

        <div style={{ maxWidth: "480px" }}>
          <h2 style={{ fontSize: "2.5rem", color: "white", fontWeight: "var(--font-weight-bold)", lineHeight: 1.2, marginBottom: "1.25rem" }}>
            Patient-Centered Clinical Operations.
          </h2>
          <p style={{ fontSize: "var(--font-size-base)", color: "rgba(255, 255, 255, 0.85)", lineHeight: 1.6, marginBottom: "2rem" }}>
            MediCore bridges patients, licensed physicians, and hospital administration through seamless real-time appointment scheduling, electronic medical records, and role-based permissions.
          </p>

          <div className="flex-col gap-3">
            <div className="flex-start gap-3" style={{ color: "white", fontSize: "var(--font-size-sm)" }}>
              <CheckCircle2 size={18} style={{ color: "var(--color-primary-300)" }} />
              <span>Real-time Doctor schedule conflict prevention</span>
            </div>
            <div className="flex-start gap-3" style={{ color: "white", fontSize: "var(--font-size-sm)" }}>
              <CheckCircle2 size={18} style={{ color: "var(--color-primary-300)" }} />
              <span>Secure custom JWT authentication with HttpOnly cookies</span>
            </div>
            <div className="flex-start gap-3" style={{ color: "white", fontSize: "var(--font-size-sm)" }}>
              <CheckCircle2 size={18} style={{ color: "var(--color-primary-300)" }} />
              <span>Dedicated dashboards for Patients, Doctors, and Administrators</span>
            </div>
          </div>
        </div>

        <div className="border-top" style={{ borderColor: "rgba(255, 255, 255, 0.2)", paddingTop: "1.5rem" }}>
          <div className="flex-between">
            <div className="flex-start gap-2">
              <Award size={18} style={{ color: "var(--color-primary-300)" }} />
              <span style={{ fontSize: "var(--font-size-xs)", color: "rgba(255, 255, 255, 0.9)" }}>
                Audited HIPAA Compliant Infrastructure Design
              </span>
            </div>
            <span style={{ fontSize: "var(--font-size-xs)", color: "rgba(255, 255, 255, 0.7)" }}>
              &copy; MediCore Platform
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
