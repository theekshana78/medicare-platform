import SEO from "../../components/common/SEO";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldAlert, ShieldCheck, AlertOctagon } from "lucide-react";
import Button from "../../components/common/Button";
import InputField from "../../components/forms/InputField";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const user = await login(email.trim(), password);

      // Strict Role Gate: Only ADMIN role permitted
      if (user.role !== "admin") {
        await logout();
        setErrorMessage(
          "Security Warning: Access Denied. Administrative privileges required. Unauthorized login attempts are recorded to immutable audit trails."
        );
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(err.message || "Administrative authentication failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex-col gap-6">
      <SEO
        title="Administrative Security Console"
        description="Restricted hospital management and executive telemetry analytics portal."
        canonical="https://medicore.health/admin/login"
      />
      {/* Admin Portal Header */}
      <div>
        <div className="flex-start gap-2 mb-2">
          <Badge variant="danger">
            <ShieldAlert size={14} /> Restricted Console
          </Badge>
          <Badge variant="neutral">
            <ShieldCheck size={14} /> Audit Logging Active
          </Badge>
        </div>
        <h2 className="text-h2" style={{ margin: 0 }}>Administrator Console</h2>
        <p className="text-muted text-sm mt-1">
          Executive hospital management, clinical telemetry analytics, physician credential verification, and system security controls.
        </p>
      </div>

      {/* Security Warning Notice */}
      <div className="alert alert-warning" style={{ margin: 0, padding: "0.75rem 1rem" }}>
        <AlertOctagon className="alert-icon text-warning" size={18} />
        <div className="alert-content text-xs">
          <strong>Restricted Operational Area:</strong> This interface is monitored 24/7. Access is strictly granted to verified hospital system administrators.
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger" style={{ margin: 0 }}>
          <ShieldAlert className="alert-icon" size={18} />
          <div className="alert-content text-xs">{errorMessage}</div>
        </div>
      )}

      {/* Admin Login Form */}
      <form onSubmit={handleAdminLogin} className="flex-col gap-4">
        <InputField
          label="Administrative Email"
          name="email"
          type="email"
          placeholder="admin@medicore.health"
          required
          iconLeft={<Mail size={16} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          label="Executive Master Password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter administrative credentials"
          required
          iconLeft={<Lock size={16} />}
          iconRight={
            <button
              type="button"
              className="btn-icon"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="danger"
          size="lg"
          fullWidth
          loading={loading}
          disabled={loading}
          icon={<ShieldCheck size={18} />}
        >
          Verify & Access Security Console
        </Button>
      </form>

      {/* Cross Portal Links */}
      <div className="border-top flex-col gap-2 pt-4 text-center text-xs text-muted">
        <div>
          Return to public site:{" "}
          <Link to="/" className="text-primary font-semibold">
            MediCore Public Hospital Home &rarr;
          </Link>
        </div>
        <div>
          Doctor & Specialist Consultation:{" "}
          <Link to="/doctor/login" className="text-muted font-medium">
            Physician Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
