import SEO from "../../components/common/SEO";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  ShieldCheck,
  Stethoscope,
  Heart,
  Baby,
  Brain,
  Activity,
  ArrowRight,
  Star,
  CheckCircle2,
  Users,
} from "lucide-react";
import Button from "../../components/common/Button";
import { Card, CardBody } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { getPublicPlatformSummaryApi } from "../../services/public/publicService";

export default function HomePage() {
  const navigate = useNavigate();
  const [platformData, setPlatformData] = useState(null);
  const [bookingDept, setBookingDept] = useState("all");
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  useEffect(() => {
    let ignore = false;
    getPublicPlatformSummaryApi()
      .then((data) => {
        if (!ignore) setPlatformData(data);
      })
      .catch((err) => console.error("Summary fetch error:", err));
    return () => {
      ignore = true;
    };
  }, []);

  const totalPatients = platformData?.totalPatients ?? 0;
  const activeDoctors = platformData?.activeDoctors ?? 0;
  const departments = platformData?.departments || [];

  const handleInstantBooking = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (bookingDept && bookingDept !== "all") query.set("specialty", bookingDept);
    if (bookingDate) query.set("date", bookingDate);
    navigate(`/appointments/book?${query.toString()}`);
  };

  const getDepartmentIcon = (title = "") => {
    const t = title.toLowerCase();
    if (t.includes("cardio")) return <Heart size={24} className="text-primary" />;
    if (t.includes("pediatric")) return <Baby size={24} className="text-primary" />;
    if (t.includes("neuro")) return <Brain size={24} className="text-primary" />;
    return <Activity size={24} className="text-primary" />;
  };

  return (
    <div>
      <SEO
        title="MediCore Healthcare | Modern Clinical Platform"
        description="Connect with certified medical specialists, schedule clinical appointments in real-time, and securely manage your electronic health records."
        canonical="https://medicore.health/"
      />
      {/* 1. Hero Section */}
      <section
        style={{
          background: "linear-gradient(180deg, var(--color-primary-50) 0%, var(--color-background) 100%)",
          padding: "5rem 0 4rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="layout-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "3.5rem",
              alignItems: "center",
            }}
          >
            {/* Left Hero Content */}
            <div className="flex-col gap-4 animate-fade-in">
              <div className="flex-start gap-2">
                <Badge variant="primary" icon={<ShieldCheck size={14} />}>
                  Live Firebase Healthcare Platform
                </Badge>
                <Badge variant="success" withDot>
                  24/7 Clinical Access
                </Badge>
              </div>

              <h1 style={{ fontSize: "3rem", lineHeight: 1.15, fontWeight: "var(--font-weight-bold)", color: "var(--color-text-main)" }}>
                Compassionate Healthcare, <br />
                <span style={{ color: "var(--color-primary)" }}>Streamlined for You.</span>
              </h1>

              <p className="text-lead">
                Connect with certified medical specialists, schedule clinical appointments in real-time, and securely manage your electronic health records through MediCore.
              </p>

              <div className="flex-start gap-3 mt-2" style={{ flexWrap: "wrap" }}>
                <Link to="/appointments/book">
                  <Button variant="primary" size="lg" icon={<Calendar size={18} />}>
                    Book An Appointment
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button variant="outline" size="lg" icon={<Stethoscope size={18} />}>
                    Explore Doctors
                  </Button>
                </Link>
              </div>

              {/* Dynamic Database Statistics */}
              <div className="flex-start gap-6 border-top mt-4" style={{ paddingTop: "1.5rem" }}>
                <div>
                  <div className="flex-start gap-1">
                    <Star size={16} fill="var(--color-warning)" color="var(--color-warning)" />
                    <span className="font-bold text-main">4.9 / 5.0</span>
                  </div>
                  <span className="text-xs text-muted">Patient Satisfaction</span>
                </div>
                <div>
                  <div className="font-bold text-main">{totalPatients} Patients</div>
                  <span className="text-xs text-muted">Registered in Firestore</span>
                </div>
                <div>
                  <div className="font-bold text-main">{activeDoctors} Specialists</div>
                  <span className="text-xs text-muted">Active Board Certified</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card - Dynamic Booking Widget */}
            <div className="animate-fade-in">
              <Card hover className="p-0" style={{ border: "1px solid var(--color-border-strong)", boxShadow: "var(--shadow-xl)" }}>
                <div style={{ backgroundColor: "var(--color-primary)", color: "white", padding: "1.75rem", borderRadius: "var(--radius-card) var(--radius-card) 0 0" }}>
                  <div className="flex-between mb-2">
                    <span className="badge" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)", color: "white" }}>
                      Instant Live Booking
                    </span>
                    <Clock size={18} />
                  </div>
                  <h3 style={{ color: "white", margin: 0, fontSize: "var(--font-size-xl)" }}>
                    Find Available Consultation
                  </h3>
                  <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "var(--font-size-sm)", marginTop: "0.25rem" }}>
                    Select department and query real-time physician availability.
                  </p>
                </div>

                <form onSubmit={handleInstantBooking}>
                  <CardBody className="flex-col gap-4">
                    <div className="form-group">
                      <label className="form-label">Medical Department</label>
                      <select
                        className="form-select"
                        value={bookingDept}
                        onChange={(e) => setBookingDept(e.target.value)}
                      >
                        <option value="all">All Departments & Specialties</option>
                        {departments.map((dept) => (
                          <option key={dept.title} value={dept.title.toLowerCase()}>
                            {dept.title} ({dept.doctorCount} Doctors)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Preferred Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <Button type="submit" variant="primary" fullWidth size="md">
                      Check Available Slots <ArrowRight size={16} />
                    </Button>

                    <div className="flex-start gap-2 text-xs text-muted justify-center">
                      <CheckCircle2 size={14} className="text-success" />
                      <span>Direct real-time query against hospital roster</span>
                    </div>
                  </CardBody>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Specialties Section - Loaded dynamically from Firestore */}
      <section style={{ padding: "5rem 0" }}>
        <div className="layout-container">
          <div className="flex-between mb-8" style={{ flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="badge badge-primary mb-2">Clinical Departments</span>
              <h2 className="text-h2" style={{ margin: 0 }}>Specialized Medical Care</h2>
              <p className="text-muted mt-1">Our hospital network houses leading consultants across active clinical fields.</p>
            </div>
            <Link to="/doctors">
              <Button variant="outline" size="sm">
                View Full Specialist Directory <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {departments.map((spec) => (
              <Card key={spec.title} hover>
                <CardBody className="flex-col gap-3">
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--color-primary-50)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {getDepartmentIcon(spec.title)}
                  </div>
                  <h4 className="card-title" style={{ fontSize: "var(--font-size-lg)" }}>{spec.title}</h4>
                  <p className="text-sm text-muted">Consult board-certified practitioners specialized in {spec.title}.</p>
                  <div className="flex-between border-top pt-3 mt-auto">
                    <span className="text-xs font-semibold text-primary">{spec.doctorCount} Active Doctors</span>
                    <Link to={`/doctors?specialty=${encodeURIComponent(spec.title.toLowerCase())}`} className="link text-xs font-semibold">
                      Consult &rarr;
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))}
            {departments.length === 0 && (
              <div className="p-6 text-center text-muted" style={{ gridColumn: "1 / -1" }}>
                Synchronizing medical departments from hospital registry...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Platform Capabilities Banner */}
      <section style={{ backgroundColor: "var(--color-surface)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", padding: "4rem 0" }}>
        <div className="layout-container">
          <div className="stats-grid">
            <div className="flex-start gap-4">
              <div style={{ backgroundColor: "var(--color-primary-50)", padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
                <Clock size={28} className="text-primary" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "var(--font-size-base)" }}>Zero Wait Time</h4>
                <p className="text-xs text-muted mt-1">Guaranteed appointment schedule slots with active doctor tracking.</p>
              </div>
            </div>

            <div className="flex-start gap-4">
              <div style={{ backgroundColor: "var(--color-primary-50)", padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
                <ShieldCheck size={28} className="text-primary" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "var(--font-size-base)" }}>Encrypted Records</h4>
                <p className="text-xs text-muted mt-1">Hospital EMR records protected with role-based JWT authentication.</p>
              </div>
            </div>

            <div className="flex-start gap-4">
              <div style={{ backgroundColor: "var(--color-primary-50)", padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
                <Users size={28} className="text-primary" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "var(--font-size-base)" }}>Multi-Role Portals</h4>
                <p className="text-xs text-muted mt-1">Distinct workflows tailored for Patients, Doctors, and Administrators.</p>
              </div>
            </div>

            <div className="flex-start gap-4">
              <div style={{ backgroundColor: "var(--color-primary-50)", padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
                <Activity size={28} className="text-primary" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "var(--font-size-base)" }}>Audit Logging</h4>
                <p className="text-xs text-muted mt-1">Complete security audit events recorded for clinical accountability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
