import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import { Card, CardHeader, CardBody } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import {
  getMyAppointmentsApi,
  cancelAppointmentApi,
} from "../../services/appointments/appointmentService";

export default function AppointmentListPage() {
  const { user } = useAuth();
  const [filterTab, setFilterTab] = useState("all");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAppointmentForCancel, setSelectedAppointmentForCancel] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyAppointmentsApi();
      setAppointments(data);
    } catch (err) {
      setError(err.message || "Unable to fetch appointment records from server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    getMyAppointmentsApi()
      .then((data) => {
        if (!ignore) setAppointments(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Unable to fetch appointment records from server.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [user]);

  const filteredAppointments = appointments.filter((apt) => {
    if (filterTab === "all") return true;
    return apt.status === filterTab;
  });

  const handleConfirmCancel = async () => {
    if (!selectedAppointmentForCancel) return;
    setCancelling(true);
    try {
      await cancelAppointmentApi(selectedAppointmentForCancel.id);
      await fetchAppointments();
      setCancelModalOpen(false);
      setSelectedAppointmentForCancel(null);
    } catch (err) {
      alert(err.message || "Failed to cancel appointment.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="flex-col gap-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: "1rem" }}>
        <div>
          <Badge variant="primary" className="mb-2">Clinical Appointments</Badge>
          <h1 className="page-title">Appointment Roster & History</h1>
          <p className="page-subtitle">
            Live database records for consultations, patient logs, and scheduling.
          </p>
        </div>

        <Link to="/appointments/book">
          <Button variant="primary" icon={<PlusCircle size={16} />}>
            Book New Appointment
          </Button>
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">
          <div className="alert-content">{error}</div>
        </div>
      )}

      {/* Main Card with Tabs */}
      <Card>
        <CardHeader>
          <div className="tab-list" style={{ border: "none" }}>
            <button
              type="button"
              className={`tab-btn ${filterTab === "all" ? "active" : ""}`}
              onClick={() => setFilterTab("all")}
            >
              All Appointments ({appointments.length})
            </button>
            <button
              type="button"
              className={`tab-btn ${filterTab === "confirmed" ? "active" : ""}`}
              onClick={() => setFilterTab("confirmed")}
            >
              Confirmed ({appointments.filter((a) => a.status === "confirmed").length})
            </button>
            <button
              type="button"
              className={`tab-btn ${filterTab === "pending" ? "active" : ""}`}
              onClick={() => setFilterTab("pending")}
            >
              Pending Approval ({appointments.filter((a) => a.status === "pending").length})
            </button>
            <button
              type="button"
              className={`tab-btn ${filterTab === "completed" ? "active" : ""}`}
              onClick={() => setFilterTab("completed")}
            >
              Completed ({appointments.filter((a) => a.status === "completed").length})
            </button>
            <button
              type="button"
              className={`tab-btn ${filterTab === "cancelled" ? "active" : ""}`}
              onClick={() => setFilterTab("cancelled")}
            >
              Cancelled ({appointments.filter((a) => a.status === "cancelled").length})
            </button>
          </div>
        </CardHeader>

        <CardBody className="p-0">
          {loading ? (
            <div className="text-center p-12">
              <Loader2 size={32} className="animate-spin text-primary" style={{ margin: "0 auto" }} />
              <p className="text-muted text-sm mt-3">Retrieving live appointment records...</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: "none" }}>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Appointment ID</th>
                    <th>{user?.role === "doctor" ? "Patient" : "Specialist"}</th>
                    <th>Department & Room</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <span className="font-mono text-xs font-bold text-main">{apt.id}</span>
                      </td>
                      <td>
                        <div className="font-semibold text-main">
                          {user?.role === "doctor" ? apt.patientName : apt.doctorName}
                        </div>
                        <div className="text-xs text-muted">{apt.fee}</div>
                      </td>
                      <td>
                        <div className="text-xs font-medium text-main">{apt.specialty}</div>
                        <div className="text-xs text-muted">{apt.room}</div>
                      </td>
                      <td>
                        <div className="text-xs font-semibold text-main">{apt.date}</div>
                        <div className="text-xs text-muted flex-start gap-1">
                          <Clock size={12} /> {apt.time}
                        </div>
                      </td>
                      <td>
                        <Badge
                          variant={
                            apt.status === "confirmed"
                              ? "success"
                              : apt.status === "pending"
                              ? "warning"
                              : apt.status === "completed"
                              ? "info"
                              : "danger"
                          }
                          withDot
                        >
                          {apt.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {(apt.status === "confirmed" || apt.status === "pending") && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm text-danger"
                            onClick={() => {
                              setSelectedAppointmentForCancel(apt);
                              setCancelModalOpen(true);
                            }}
                          >
                            Cancel Slot
                          </button>
                        )}
                        {apt.status === "completed" && (
                          <span className="badge badge-neutral text-xs">
                            <CheckCircle2 size={12} className="text-success" /> Completed
                          </span>
                        )}
                        {apt.status === "cancelled" && (
                          <span className="text-xs text-muted">Cancelled</span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted p-8 text-xs">
                        No appointments found matching this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Confirm Appointment Cancellation"
        footer={
          <div className="flex-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setCancelModalOpen(false)}>
              Keep Appointment
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={cancelling}
              onClick={handleConfirmCancel}
            >
              Release Slot
            </Button>
          </div>
        }
      >
        <div className="flex-col gap-3">
          <div className="flex-start gap-3">
            <div style={{ backgroundColor: "var(--color-danger-light)", padding: "0.5rem", borderRadius: "50%", color: "var(--color-danger)" }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: "var(--font-size-base)" }}>
                Cancel this reservation?
              </h4>
              <p className="text-xs text-muted mt-1">
                Appointment <strong>#{selectedAppointmentForCancel?.id}</strong> on{" "}
                <strong>{selectedAppointmentForCancel?.date}</strong> at{" "}
                <strong>{selectedAppointmentForCancel?.time}</strong> will be released in the backend.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
