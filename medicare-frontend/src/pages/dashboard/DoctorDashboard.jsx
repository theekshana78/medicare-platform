import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Stethoscope,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Card, CardHeader, CardTitle, CardBody } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { getDashboardStatsApi } from "../../services/dashboard/dashboardService";
import { updateAppointmentStatusApi } from "../../services/appointments/appointmentService";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [inClinic, setInClinic] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDashboardStatsApi();
      setDashboardData(data);
    } catch (err) {
      console.error("Doctor dashboard stats error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    getDashboardStatsApi()
      .then((data) => {
        if (!ignore) setDashboardData(data);
      })
      .catch((err) => {
        console.error("Doctor dashboard stats error:", err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [user]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateAppointmentStatusApi(id, status);
      await fetchStats();
    } catch (err) {
      alert(err.message || "Failed to update appointment status.");
    }
  };

  const stats = dashboardData?.stats || {
    scheduledTodayCount: 0,
    pendingCount: 0,
    completedCount: 0,
    totalPatientRoster: 0,
  };

  const queue = dashboardData?.queue || [];

  return (
    <div className="flex-col gap-6 animate-fade-in">
      {/* Doctor Header Banner */}
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
              <Stethoscope size={28} />
            </div>
            <div>
              <div className="flex-start gap-2 mb-1">
                <Badge variant="primary">Physician Console</Badge>
                <span className="text-xs text-muted font-medium">Room 204 &bull; Specialty: Cardiology</span>
              </div>
              <h2 className="text-h2" style={{ margin: 0 }}>
                {user?.name || "Dr. Sarah Jenkins"}
              </h2>
              <p className="text-sm text-muted mt-1">
                Managing live clinical schedule for today&apos;s outpatient appointments.
              </p>
            </div>
          </div>

          <div className="flex-start gap-3">
            <button
              type="button"
              className={`btn ${inClinic ? "btn-success" : "btn-outline"} btn-sm`}
              onClick={() => setInClinic(!inClinic)}
            >
              <span className={`status-dot ${inClinic ? "status-online" : "status-offline"}`} />
              {inClinic ? "Clinic Active (Accepting Calls)" : "Status: On Break"}
            </button>
          </div>
        </div>
      </div>

      {/* Doctor Stats Grid */}
      <div className="stats-grid">
        <Card hover>
          <CardBody>
            <div className="flex-between mb-2">
              <span className="text-xs text-muted font-bold uppercase">Scheduled Consultations</span>
              <Calendar size={18} className="text-primary" />
            </div>
            <h3 className="text-h2" style={{ margin: 0 }}>{stats.scheduledTodayCount}</h3>
            <span className="text-xs text-muted mt-1 block">Live Firestore records</span>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody>
            <div className="flex-between mb-2">
              <span className="text-xs text-muted font-bold uppercase">Pending Requests</span>
              <Clock size={18} className="text-warning" />
            </div>
            <h3 className="text-h2 text-warning" style={{ margin: 0 }}>
              {stats.pendingCount}
            </h3>
            <span className="text-xs text-muted mt-1 block">Awaiting doctor review</span>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody>
            <div className="flex-between mb-2">
              <span className="text-xs text-muted font-bold uppercase">Completed Today</span>
              <CheckCircle2 size={18} className="text-success" />
            </div>
            <h3 className="text-h2 text-success" style={{ margin: 0 }}>
              {stats.completedCount}
            </h3>
            <span className="text-xs text-muted mt-1 block">Prescriptions logged</span>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody>
            <div className="flex-between mb-2">
              <span className="text-xs text-muted font-bold uppercase">Patient Pool</span>
              <Users size={18} className="text-info" />
            </div>
            <h3 className="text-h2" style={{ margin: 0 }}>{stats.totalPatientRoster}</h3>
            <span className="text-xs text-muted mt-1 block">Under active cardiac care</span>
          </CardBody>
        </Card>
      </div>

      {/* Doctor Patient Queue Management */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Live Patient Queue</CardTitle>
            <span className="text-xs text-muted">Review, approve, or complete patient visit statuses</span>
          </div>
          <Badge variant="neutral">Auto-Sync Enabled</Badge>
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
                    <th>Patient Details</th>
                    <th>Appointment Time</th>
                    <th>Clinical Reason</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Physician Action</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="font-semibold text-main">{item.patientName}</div>
                        <div className="text-xs text-muted">ID: #{item.id}</div>
                      </td>
                      <td>
                        <div className="flex-start gap-1 text-sm font-medium text-main">
                          <Clock size={14} className="text-primary" /> {item.date} {item.time}
                        </div>
                      </td>
                      <td>
                        <span className="text-xs text-body" style={{ maxWidth: "250px", display: "inline-block" }}>
                          {item.symptoms || "Clinical Review"}
                        </span>
                      </td>
                      <td>
                        <Badge
                          variant={
                            item.status === "confirmed"
                              ? "success"
                              : item.status === "pending"
                              ? "warning"
                              : item.status === "completed"
                              ? "info"
                              : "danger"
                          }
                          withDot
                        >
                          {item.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="flex-end gap-1">
                          {item.status === "pending" && (
                            <>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => handleUpdateStatus(item.id, "confirmed")}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline btn-sm text-danger"
                                onClick={() => handleUpdateStatus(item.id, "cancelled")}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {item.status === "confirmed" && (
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              onClick={() => handleUpdateStatus(item.id, "completed")}
                            >
                              Mark Completed
                            </button>
                          )}
                          {item.status === "completed" && (
                            <span className="text-xs text-success font-semibold flex-start gap-1">
                              <CheckCircle2 size={14} /> Completed
                            </span>
                          )}
                          {item.status === "cancelled" && (
                            <span className="text-xs text-danger font-semibold flex-start gap-1">
                              <XCircle size={14} /> Cancelled
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {queue.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted p-8 text-xs">
                        No appointments queued for your schedule at this time.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
