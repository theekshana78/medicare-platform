import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Calendar, Eye, EyeOff, UserPlus, CheckCircle2 } from "lucide-react";
import Button from "../../components/common/Button";
import InputField from "../../components/forms/InputField";
import SelectField from "../../components/forms/SelectField";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "female",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long for healthcare data security.");
      return;
    }

    if (!/[0-9]/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      setErrorMessage("Password must contain at least one letter and one number.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        role: "patient",
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || "Registration failed. Please check form inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex-col gap-5">
      <div>
        <Badge variant="primary" className="mb-2">New Patient Portal</Badge>
        <h2 className="text-h2" style={{ margin: 0 }}>Register With MediCore</h2>
        <p className="text-muted text-sm mt-1">
          Create an account to book specialist appointments and access medical records.
        </p>
      </div>

      {success && (
        <div className="alert alert-success">
          <CheckCircle2 className="alert-icon" />
          <div className="alert-content">
            <div className="alert-title">Account Created Successfully!</div>
            <div>Your clinical profile is verified. Redirecting to your dashboard...</div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger">
          <div className="alert-content">{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleRegisterSubmit} className="flex-col gap-3">
        <InputField
          label="Full Legal Name"
          name="fullName"
          required
          iconLeft={<User size={16} />}
          placeholder="e.g. Nimali Silva"
          value={formData.fullName}
          onChange={handleChange}
        />

        <div className="dashboard-grid-equal" style={{ gap: "0.75rem" }}>
          <InputField
            label="Email Address"
            name="email"
            type="email"
            required
            iconLeft={<Mail size={16} />}
            placeholder="nimali@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="Mobile Phone"
            name="phone"
            type="tel"
            required
            iconLeft={<Phone size={16} />}
            placeholder="+94 77 123 4567"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="dashboard-grid-equal" style={{ gap: "0.75rem" }}>
          <InputField
            label="Date of Birth"
            name="dob"
            type="date"
            required
            iconLeft={<Calendar size={16} />}
            value={formData.dob}
            onChange={handleChange}
          />
          <SelectField
            label="Gender"
            name="gender"
            required
            placeholder=""
            options={[
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
              { value: "other", label: "Other" },
            ]}
            value={formData.gender}
            onChange={handleChange}
          />
        </div>

        <div className="dashboard-grid-equal" style={{ gap: "0.75rem" }}>
          <InputField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            iconLeft={<Lock size={16} />}
            iconRight={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label="Toggle password visibility"
                style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", color: "var(--color-text-muted)" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            placeholder="Min. 6 characters"
            value={formData.password}
            onChange={handleChange}
          />
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            required
            iconLeft={<Lock size={16} />}
            placeholder="Repeat password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="mt-1">
          <label className="form-check text-xs">
            <input
              type="checkbox"
              name="agreeTerms"
              className="form-checkbox"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required
            />
            <span>
              I agree to the <span className="link">Terms of Clinical Service</span> and <span className="link">Patient Privacy Policy</span>.
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          icon={<UserPlus size={18} />}
          className="mt-2"
        >
          Complete Patient Registration
        </Button>
      </form>

      <div className="text-center text-sm text-muted">
        Already have a registered account?{" "}
        <Link to="/login" className="link font-semibold">
          Sign In here
        </Link>
      </div>
    </div>
  );
}
