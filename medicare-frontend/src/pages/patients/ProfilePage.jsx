import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Calendar,
  Heart,
  MapPin,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Card, CardHeader, CardTitle, CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { getMeApi } from "../../services/auth/authService";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    dob: user?.dob || "",
    gender: user?.gender || "unspecified",
    bloodGroup: user?.bloodGroup || "O+",
    address: user?.address || "",
    emergencyContact: user?.emergencyContact || "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch freshest profile from server on mount
  useEffect(() => {
    getMeApi()
      .then((data) => {
        if (data?.user) {
          setFormData((prev) => ({
            ...prev,
            name: data.user.name || "",
            phone: data.user.phone || "",
            dob: data.user.dob || "",
            gender: data.user.gender || "unspecified",
            bloodGroup: data.user.bloodGroup || "O+",
            address: data.user.address || "",
            emergencyContact: data.user.emergencyContact || "",
          }));
        }
      })
      .catch((err) => {
        console.error("Profile sync error:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await updateProfile(formData);
      setSuccessMsg("Your clinical profile details have been saved successfully.");
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col gap-6 animate-fade-in" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Page Header */}
      <div>
        <div className="flex-start gap-2 mb-1">
          <Badge variant="primary">Patient Health Record</Badge>
          <span className="badge badge-success text-xs">HIPAA Compliant</span>
        </div>
        <h1 className="text-h2" style={{ margin: 0 }}>
          Personal Health Profile & Settings
        </h1>
        <p className="text-sm text-muted mt-1">
          Keep your medical demographics and emergency contacts up to date for consultations.
        </p>
      </div>

      {successMsg && (
        <div
          className="p-4 rounded flex-start gap-3 animate-fade-in"
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            border: "1px solid var(--color-success)",
            color: "var(--color-success-dark, #065f46)",
          }}
        >
          <CheckCircle2 size={20} className="text-success" style={{ flexShrink: 0 }} />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div
          className="p-4 rounded flex-start gap-3 animate-fade-in"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid var(--color-danger)",
            color: "var(--color-danger)",
          }}
        >
          <AlertCircle size={20} className="text-danger" style={{ flexShrink: 0 }} />
          <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}

      <div className="dashboard-grid-equal" style={{ alignItems: "flex-start" }}>
        {/* Left Column: Account Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Identity & Credentials</CardTitle>
          </CardHeader>
          <CardBody className="flex-col items-center text-center p-6 gap-4">
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "var(--color-primary-100)",
                color: "var(--color-primary-800)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: "bold",
                margin: "0 auto",
                boxShadow: "var(--shadow-md)",
              }}
            >
              {user?.avatar || (user?.name ? user.name.slice(0, 2).toUpperCase() : "MC")}
            </div>

            <div>
              <h3 className="text-lg font-bold text-main" style={{ margin: 0 }}>
                {user?.name || "Patient"}
              </h3>
              <span className="text-xs text-muted block mt-1">{user?.email}</span>
              <div className="flex-center gap-2 mt-2">
                <Badge
                  variant={user?.role === "admin" ? "danger" : user?.role === "doctor" ? "info" : "success"}
                >
                  {user?.role ? user.role.toUpperCase() : "PATIENT"}
                </Badge>
                <span className="badge badge-neutral text-xs font-mono">
                  ID: {user?.id ? user.id.slice(0, 10) : "pat-verified"}
                </span>
              </div>
            </div>

            <div
              className="w-full text-left p-4 mt-2 rounded border"
              style={{
                backgroundColor: "var(--color-surface-subtle)",
                borderColor: "var(--color-border)",
                fontSize: "var(--font-size-xs)",
              }}
            >
              <div className="flex-between py-1 border-bottom">
                <span className="text-muted">Account Status:</span>
                <span className="font-semibold text-success flex-start gap-1">
                  <Shield size={12} /> Active & Verified
                </span>
              </div>
              <div className="flex-between py-1 border-bottom">
                <span className="text-muted">Auth Provider:</span>
                <span className="font-medium text-main">Google Cloud Firestore</span>
              </div>
              <div className="flex-between py-1">
                <span className="text-muted">Registered Role:</span>
                <span className="font-medium text-main">{user?.role || "patient"}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Right Column: Edit Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Clinical Demographics</CardTitle>
            <span className="text-xs text-muted">Tamper-proof backend sync</span>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="flex-col gap-4">
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  <User size={14} className="inline mr-1" /> Full Legal Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Kasun Jayawardena"
                />
              </div>

              {/* Email (Read Only) */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Registered Email Address (Read-Only)
                </label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={user?.email || ""}
                  disabled
                  style={{ backgroundColor: "var(--color-surface-subtle)", cursor: "not-allowed" }}
                />
                <span className="text-xs text-muted mt-1">
                  Email changes require medical administrator authorization.
                </span>
              </div>

              {/* Phone & Emergency Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    <Phone size={14} className="inline mr-1" /> Mobile Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    className="input"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94 77 123 4567"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="emergencyContact">
                    Emergency Contact
                  </label>
                  <input
                    id="emergencyContact"
                    type="tel"
                    name="emergencyContact"
                    className="input"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="+94 71 888 9999"
                  />
                </div>
              </div>

              {/* DOB, Gender & Blood Group Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="dob">
                    <Calendar size={14} className="inline mr-1" /> Date of Birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    name="dob"
                    className="input"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="unspecified">Prefer not to say</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="bloodGroup">
                    <Heart size={14} className="inline mr-1 text-danger" /> Blood Group
                  </label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    className="select"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="address">
                  <MapPin size={14} className="inline mr-1" /> Residential Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  className="input"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, City, Postal Code"
                />
              </div>

              <div className="flex-end mt-4">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Saving to Firestore...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Profile Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}