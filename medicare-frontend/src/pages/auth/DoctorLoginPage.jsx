import SEO from "../../components/common/SEO";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Stethoscope, ShieldCheck, AlertTriangle } from "lucide-react";
import Button from "../../components/common/Button";
import InputField from "../../components/forms/InputField";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../hooks/useAuth";

export default function DoctorLoginPage() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDoctorLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const user = await login(email.trim(), password);

      // Strict Role Gate: Only DOCTOR role permitted
      if (user.role !== "doctor") {
        await logout();
        setErrorMessage(
          "Access Denied: This portal is strictly reserved for verified medical doctors and clinicians. Patients please use the Patient Portal."
        );
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(err.message || "Failed to authenticate physician credentials. Please verify your login details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex-col gap-6">
      <SEO
        title="Doctor & Clinician Portal | OPD Queue"
        description="Authorized physician portal for consultation scheduling and patient treatment tracking."
        canonical="https://medicore.health/doctor/login"
      />
      {/* Clinician Portal Header */}
      <div>
        <div className="flex-start gap-2 mb-2">
          <Badge variant="success">
            <Stethoscope size={14} /> Medical Staff Only
          </Badge>
          <Badge variant="neutral">
            <ShieldCheck size={14} /> HIPAA Protected
          </Badge>
        </div>
        <h2 className="text-h2" style={{ margin: 0 }}>Doctor & Clinician Portal</h2>
        <p className="text-muted text-sm mt-1">
          Secure clinical authentication for board-certified physicians to manage OPD consultations, digital patient queues, and treatment records.
        </p>
      </div>

      {/* Security Warning Notice */}
      <div className="alert alert-info" style={{ margin: 0, padding: "0.75rem 1rem" }}>
        <ShieldCheck className="alert-icon text-primary" size={18} />
        <div className="alert-content text-xs">
          <strong>Authorized Clinical Access:</strong> By signing in, you confirm you are a licensed physician operating under MediCore medical bylaws.
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger" style={{ margin: 0 }}>
          <AlertTriangle className="alert-icon" size={18} />
          <div className="alert-content text-xs">{errorMessage}</div>
        </div>
      )}

      {/* Doctor Login Form */}
      <form onSubmit={handleDoctorLogin} className="flex-col gap-4">
        <InputField
          label="Hospital Email Address"
          name="email"
          type="email"
          placeholder="dr.name@medicore.health"
          required
          iconLeft={<Mail size={16} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          label="Physician Security Password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your physician account password"
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
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={loading}
          icon={<Stethoscope size={18} />}
        >
          Authenticate & Access Clinic Queue
        </Button>
      </form>

      {/* Separation & Cross Portal Links */}
      <div className="border-top flex-col gap-2 pt-4 text-center text-xs text-muted">
        <div>
          Are you a patient seeking consultation?{" "}
          <Link to="/login" className="text-primary font-semibold">
            Go to Patient Sign In &rarr;
          </Link>
        </div>
        <div>
          Hospital Operations & Administration:{" "}
          <Link to="/admin/login" className="text-muted font-medium">
            Administrative Console
          </Link>
        </div>
      </div>
    </div>
  );
}
