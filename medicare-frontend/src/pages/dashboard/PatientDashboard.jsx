import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Heart,
  PlusCircle,
  Stethoscope,
  Activity,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import { Card, CardHeader, CardTitle, CardBody } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { getDashboardStatsApi } from "../../services/dashboard/dashboardService";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStatsApi();
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard metrics error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const stats = dashboardData?.stats || {
    upcomingCount: 0,
    completedCount: 0,
    profileHealthScore: "100%",
    primaryDoctor: "None Scheduled",
  };

  const upcomingAppointments = dashboardData?.upcomingAppointments || [];

  return (
    <div className="flex-col gap-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="card" style={{ borderLeft: "5px solid var(--color-primary)", backgroundColor: "var(--color-surface)" }}>
        <div className="card-body flex-between" style={{ flexWrap: "wrap", gap: "1.5rem" }}>
          <div className="flex-start gap-4">
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--color-primary-50)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              {user?.avatar || "KJ"}
            </div>
            <div>
              <div className="flex-start gap-2 mb-1">
                <Badge variant="success" withDot>Patient Account Active</Badge>
                <span className="text-xs text-muted">Blood Group: <strong>{user?.bloodGroup || "O+"}</strong></span>
              </div>
              <h2 className="text-h2" style={{ margin: 0 }}>
                Hello, {user?.name || "Patient"}
              </h2>
              <p className="text-sm text-muted mt-1">
                You have <strong>{stats.upcomingCount} upcoming appointments</strong> recorded in your clinical schedule.
              </p>
            </div>
          </div>

          <div className="flex-start gap-3">
            <Link to="/appointments/book">
              <Button variant="primary" icon={<PlusCircle size={16} />}>
                Book New Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Patient Health Stats Grid */}
      <div className="stats-grid">
        <Card hover>
          <CardBody>
            <div className="flex-between mb-2">
              <span className="text-xs text-muted font-bold uppercase">Upcoming Visits</span>
              <Calendar size={18} className="text-primary" />
            </div>
            <h3 className="text-h2" style={{ margin: 0 }}>{stats.upcomingCount}</h3>
            <span className="text-xs text-muted mt-1 block">Live database records</span>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody>
            <div className="flex-between mb-2">
              <span className="text-xs text-muted font-bold uppercase">Completed Consultations</span>
              <CheckCircle2 size={18} className="text-success" />
            </div>
            <h3 className="text-h2" style={{ margin: 0 }}>{stats.completedCount}</h3>
            <span className="text-xs text-muted mt-1 block">Prescriptions archived</span>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody>
            <div className="flex-between mb-2">
              <span className="text-xs text-muted font-bold uppercase">Primary Physician</span>
              <Stethoscope size={18} className="text-info" />
            </div>
            <h3 className="text-h4 text-primary truncate" style={{ margin: 0 }}>{stats.primaryDoctor}</h3>
            <span className="text-xs text-muted mt-1 block">Assigned Clinic Desk</span>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody>
            <div className="flex-between mb-2">
              <span className="text-xs text-muted font-bold uppercase">Profile Health Status</span>
              <Heart size={18} className="text-danger" />
            </div>
            <h3 className="text-h2" style={{ margin: 0 }}>{stats.profileHealthScore}</h3>
            <span className="text-xs text-success mt-1 block">Demographics verified</span>
          </CardBody>
        </Card>
      </div>

      {/* Main 2-Column Section */}
      <div className="dashboard-grid-2col">
        {/* Left Column: Upcoming Appointments Table */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>My Active Appointments</CardTitle>
              <span className="text-xs text-muted">Synchronized with Express API & Firestore</span>
            </div>
            <Link to="/appointments">
              <Button variant="outline" size="sm">
                View All History <ArrowRight size={14} />
              </Button>
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            {loading ? (
              <div className="text-center p-8">
                <Loader2 size={24} className="animate-spin text-primary" style={{ margin: "0 auto" }} />
              </div>
            ) : (
              <div className="table-container" style={{ border: "none" }}>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Specialist & Room</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingAppointments.map((apt) => (
                      <tr key={apt.id}>
                        <td>
                          <div className="font-semibold text-main">{apt.doctorName}</div>
                          <div className="text-xs text-muted">{apt.specialty} &bull; {apt.room}</div>
                        </td>
                        <td>
                          <div className="text-sm font-medium text-main">{apt.date}</div>
                          <div className="text-xs text-muted flex-start gap-1">
                            <Clock size={12} /> {apt.time}
                          </div>
                        </td>
                        <td>
                          <Badge
                            variant={apt.status === "confirmed" ? "success" : "warning"}
                            withDot
                          >
                            {apt.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <Link to="/appointments">
                            <button type="button" className="btn btn-ghost btn-sm text-primary">
                              Details
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {upcomingAppointments.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-muted p-6 text-xs">
                          No upcoming appointments booked. Use the button above to reserve a slot.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Right Column: Health Reminders & Quick Actions */}
        <div className="flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Reminders</CardTitle>
              <Badge variant="neutral">Auto-generated</Badge>
            </CardHeader>
            <CardBody className="flex-col gap-3">
              {upcomingAppointments.length > 0 ? (
                <div className="alert alert-info" style={{ margin: 0 }}>
                  <Clock className="alert-icon" />
                  <div className="alert-content text-xs">
                    <strong>Upcoming Consultation:</strong> Visit with {upcomingAppointments[0].doctorName} ({upcomingAppointments[0].specialty}) on {upcomingAppointments[0].date} at {upcomingAppointments[0].time}.
                  </div>
                </div>
              ) : (
                <div className="alert alert-info" style={{ margin: 0 }}>
                  <CheckCircle2 className="alert-icon" />
                  <div className="alert-content text-xs">
                    <strong>Schedule Open:</strong> You have no pending clinical appointments. Book a specialist slot whenever you require consultation.
                  </div>
                </div>
              )}

              <div className="alert alert-success" style={{ margin: 0 }}>
                <CheckCircle2 className="alert-icon" />
                <div className="alert-content text-xs">
                  <strong>Encrypted Electronic Records:</strong> Your clinical chart is secured with custom JWT and Firestore rules.
                </div>
              </div>
            </CardBody>
          </Card>

          <Card style={{ backgroundColor: "var(--color-primary-50)", borderColor: "var(--color-primary-200)" }}>
            <CardBody className="flex-col gap-3">
              <div className="flex-start gap-3">
                <Activity size={24} className="text-primary" />
                <div>
                  <h4 style={{ margin: 0, fontSize: "var(--font-size-base)" }}>Explore Hospital Specialists</h4>
                  <p className="text-xs text-muted mt-1">Directly consult verified practitioners across 14 specialties.</p>
                </div>
              </div>
              <Link to="/doctors">
                <Button variant="primary" size="sm" fullWidth>
                  Browse Doctor Directory &rarr;
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
