import SEO from "../../components/common/SEO";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, UserCheck, Stethoscope, ShieldCheck, AlertCircle } from "lucide-react";
import Button from "../../components/common/Button";
import InputField from "../../components/forms/InputField";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(err.message || "Failed to sign in. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex-col gap-6">
      <SEO
        title="Patient Portal Sign In | Encrypted Records"
        description="Patient access portal for viewing appointments, clinical notes, and electronic medical prescriptions."
        canonical="https://medicore.health/login"
      />
      {/* Title & Subtitle */}
      <div>
        <div className="flex-start gap-2 mb-2">
          <Badge variant="primary">
            <UserCheck size={14} /> Patient Portal
          </Badge>
          <Badge variant="success">
            <ShieldCheck size={14} /> 256-Bit Encrypted
          </Badge>
        </div>
        <h2 className="text-h2" style={{ margin: 0 }}>Patient Sign In</h2>
        <p className="text-muted text-sm mt-1">
          Access your clinical appointments, electronic prescriptions, and verified medical records.
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger" style={{ margin: 0 }}>
          <AlertCircle className="alert-icon" size={18} />
          <div className="alert-content text-xs">{errorMessage}</div>
        </div>
      )}

      {/* Patient Login Form */}
      <form onSubmit={handleLoginSubmit} className="flex-col gap-4">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          required
          iconLeft={<Mail size={16} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex-col gap-1">
          <InputField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your account password"
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
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Sign In to Patient Portal
        </Button>
      </form>

      {/* Registration link */}
      <div className="text-center text-sm text-muted">
        Don&apos;t have a patient account yet?{" "}
        <Link to="/register" className="text-primary font-semibold">
          Register Online &rarr;
        </Link>
      </div>

      {/* Professional Separate Portals Footer */}
      <div
        style={{
          borderTop: "1px solid var(--color-border)",
          paddingTop: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          fontSize: "var(--font-size-xs)",
          color: "var(--color-text-muted)",
        }}
      >
        <div className="flex-between">
          <span>Licensed Hospital Doctor?</span>
          <Link to="/doctor/login" className="text-primary font-medium flex-start gap-1">
            <Stethoscope size={13} /> Clinician Portal &rarr;
          </Link>
        </div>
        <div className="flex-between">
          <span>Hospital Operations Team?</span>
          <Link to="/admin/login" className="text-muted font-medium flex-start gap-1">
            <ShieldCheck size={13} /> Admin Console &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
