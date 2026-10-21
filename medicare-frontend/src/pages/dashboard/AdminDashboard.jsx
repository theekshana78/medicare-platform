import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Calendar,
  ShieldCheck,
  Stethoscope,
  Loader2,
  Activity,
  AlertTriangle,
  Download,
  RefreshCw,
  Server,
  CheckCircle2,
  Send,
  BellRing,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import Button from "../../components/common/Button";
import { Card, CardHeader, CardTitle, CardBody } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { getDashboardStatsApi } from "../../services/dashboard/dashboardService";
import { verifyDoctorApi } from "../../services/doctors/doctorService";
import { getTelemetryApi, downloadLogFileApi } from "../../services/admin/adminService";
import { createNotificationApi } from "../../services/notifications/notificationService";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("telemetry");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live Telemetry State
  const [telemetry, setTelemetry] = useState(null);
  const [telemetryLoading, setTelemetryLoading] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  // Broadcast Notification State (Admin Only)
  const [notifForm, setNotifForm] = useState({
    title: "",
    message: "",
    type: "info",
    target: "all_patients",
  });
  const [sendingNotif, setSendingNotif] = useState(false);
  const [notifFeedback, setNotifFeedback] = useState("");

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    setSendingNotif(true);
    setNotifFeedback("");
    try {
      await createNotificationApi(notifForm);
      setNotifFeedback("Clinical announcement successfully broadcasted to active patients!");
      setNotifForm({ title: "", message: "", type: "info", target: "all_patients" });
      setTimeout(() => setNotifFeedback(""), 6000);
    } catch (err) {
      alert(err.message || "Failed to broadcast notification.");
    } finally {
      setSendingNotif(false);
    }
  };


  const fetchStats = useCallback(async () => {
    try {
      const data = await getDashboardStatsApi();
      setDashboardData(data);
    } catch (err) {
      console.error("Admin dashboard stats error:", err);
    }
  }, []);

  const fetchTelemetry = useCallback(async () => {
    setTelemetryLoading(true);
    try {
      const data = await getTelemetryApi();
      setTelemetry(data);
    } catch (err) {
      console.error("Admin telemetry fetch error:", err);
    } finally {
      setTelemetryLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    Promise.all([getDashboardStatsApi(), getTelemetryApi()])
      .then(([statsData, telemetryData]) => {
        if (!ignore) {
          setDashboardData(statsData);
          setTelemetry(telemetryData);
        }
      })
      .catch((err) => {
        console.error("Initialization error:", err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchTelemetry();
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchTelemetry]);

  const handleApproveDoctor = async (id) => {
    try {
      await verifyDoctorApi(id);
      await fetchStats();
    } catch (err) {
      alert(err.message || "Failed to verify doctor.");
    }
  };

  const handleDownloadLog = async (type) => {
    try {
      setDownloading(type);
      await downloadLogFileApi(type);
    } catch (err) {
      alert(err.message || `Failed to download ${type}.log`);
    } finally {
      setDownloading(null);
    }
  };

  const stats = dashboardData?.stats || {
    totalPatients: 0,
    activeDoctors: 0,
    appointmentsCount: 0,
    criticalSecurityFlags: 0,
  };

  const chartData = dashboardData?.chartData || [];
  const departmentData = dashboardData?.departmentData || [];
  const pendingDoctors = dashboardData?.pendingDoctors || [];
  const auditLogs = dashboardData?.auditLogs || [];

  const summary = telemetry?.summary || {
    totalRequests: 0,
    totalErrors: 0,
    errorRate: "0.0%",
    statusCounts: { "2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0 },
    uptimeSeconds: 0,
    memoryUsageMb: 0,
  };

  const topEndpoints = telemetry?.topEndpoints || [];
  const errorBreakdown = telemetry?.errorBreakdown || [];
  const recentLogs = telemetry?.recentLogs || [];

  const formatUptime = (sec) => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };
  return (
    <div className="flex-col gap-6 animate-fade-in">
      {/* Admin Executive Header */}
      <div className="card" style={{ borderLeft: "5px solid var(--color-primary)", backgroundColor: "var(--color-surface)" }}>
        <div className="card-body flex-between" style={{ flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div className="flex-start gap-2 mb-1">
              <Badge variant="danger">Administrator Superuser</Badge>
              <Badge variant="success" withDot>Hospital Infrastructure Healthy</Badge>
            </div>
            <h2 className="text-h2" style={{ margin: 0 }}>
              Hospital Operations & Telemetry Console
            </h2>
            <p className="text-sm text-muted mt-1">
              Real-time API traffic monitoring, app.log auditing, physician credentials, and HIPAA compliance feeds.
            </p>
          </div>

          <div className="flex-start gap-3">
            <span className="status-indicator">
              <span className="status-dot status-online" /> Cloud Firestore: Connected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchStats();
                fetchTelemetry();
              }}
              disabled={telemetryLoading}
            >
              <RefreshCw size={14} className={telemetryLoading ? "animate-spin mr-1" : "mr-1"} />
              Sync Telemetry
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="tabs-container">
        <div className="tab-list">
          <button
            type="button"
            className={`tab-btn ${activeTab === "telemetry" ? "active" : ""}`}
            onClick={() => setActiveTab("telemetry")}
          >
            <Activity size={16} className="inline mr-2" />
            Live System Telemetry & Logs (app.log)
            {summary.totalErrors > 0 && (
              <span className="badge badge-danger text-xs ml-2">{summary.totalErrors} Errors</span>
            )}
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "operations" ? "active" : ""}`}
            onClick={() => setActiveTab("operations")}
          >
            <Server size={16} className="inline mr-2" />
            Hospital Operations & Clinical Metrics
            {pendingDoctors.length > 0 && (
              <span className="badge badge-warning text-xs ml-2">{pendingDoctors.length} Pending</span>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-12">
          <Loader2 size={32} className="animate-spin text-primary" style={{ margin: "0 auto" }} />
          <p className="text-muted text-sm mt-3">Connecting to Express API telemetry...</p>
        </div>
      ) : activeTab === "telemetry" ? (
        <div className="flex-col gap-6">
          {/* Quick Action Toolbar */}
          <div className="flex-between" style={{ flexWrap: "wrap", gap: "1rem" }}>
            <div className="flex-start gap-2">
              <Badge variant="primary" withDot>
                Active Monitoring: logs/app.log & logs/error.log
              </Badge>
              <span className="text-xs text-muted">
                Uptime: <strong>{formatUptime(summary.uptimeSeconds)}</strong> | RAM: <strong>{summary.memoryUsageMb} MB</strong>
              </span>
            </div>

            <div className="flex-start gap-2">
              <label className="flex-start gap-2 text-xs text-muted cursor-pointer" style={{ userSelect: "none" }}>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                Auto-refresh (5s)
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadLog("app")}
                disabled={downloading === "app"}
              >
                <Download size={14} className="mr-1" />
                {downloading === "app" ? "Downloading..." : "Download app.log"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadLog("error")}
                disabled={downloading === "error"}
              >
                <AlertTriangle size={14} className="mr-1 text-danger" />
                {downloading === "error" ? "Downloading..." : "Download error.log"}
              </Button>
            </div>
          </div>

          {/* Telemetry Metric Cards */}
          <div className="stats-grid">
            <Card hover>
              <CardBody>
                <div className="flex-between mb-2">
                  <span className="text-xs text-muted font-bold uppercase">Total HTTP Requests</span>
                  <Activity size={18} className="text-primary" />
                </div>
                <h3 className="text-h2" style={{ margin: 0 }}>{summary.totalRequests.toLocaleString()}</h3>
                <span className="text-xs text-muted mt-1 block">Live API interactions logged</span>
              </CardBody>
            </Card>

            <Card hover>
              <CardBody>
                <div className="flex-between mb-2">
                  <span className="text-xs text-muted font-bold uppercase">Clinical System Errors</span>
                  <AlertTriangle size={18} className={summary.totalErrors > 0 ? "text-danger" : "text-muted"} />
                </div>
                <h3 className={`text-h2 ${summary.totalErrors > 0 ? "text-danger" : "text-success"}`} style={{ margin: 0 }}>
                  {summary.totalErrors}
                </h3>
                <span className="text-xs text-muted mt-1 block">4xx & 5xx HTTP exceptions</span>
              </CardBody>
            </Card>

            <Card hover>
              <CardBody>
                <div className="flex-between mb-2">
                  <span className="text-xs text-muted font-bold uppercase">Error Rate</span>
                  <ShieldCheck size={18} className="text-secondary" />
                </div>
                <h3 className={`text-h2 ${parseFloat(summary.errorRate) > 5 ? "text-danger" : "text-success"}`} style={{ margin: 0 }}>
                  {summary.errorRate}
                </h3>
                <span className="text-xs text-muted mt-1 block">Reliability SLA: 99.9% target</span>
              </CardBody>
            </Card>

            <Card hover>
              <CardBody>
                <div className="flex-between mb-2">
                  <span className="text-xs text-muted font-bold uppercase">Status Code Distribution</span>
                  <Server size={18} className="text-primary" />
                </div>
                <div className="flex-start gap-2 mt-1">
                  <span className="badge badge-success text-xs">2xx: {summary.statusCounts["2xx"]}</span>
                  <span className="badge badge-neutral text-xs">3xx: {summary.statusCounts["3xx"]}</span>
                  <span className="badge badge-warning text-xs">4xx: {summary.statusCounts["4xx"]}</span>
                  <span className="badge badge-danger text-xs">5xx: {summary.statusCounts["5xx"]}</span>
                </div>
                <span className="text-xs text-muted mt-2 block">HTTP Response breakdown</span>
              </CardBody>
            </Card>
          </div>
          {/* Telemetry Visualizations Grid */}
          <div className="dashboard-grid-2col">
            {/* Top API Call Volumes Chart */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Top API Call Volumes (Most Frequently Called)</CardTitle>
                  <span className="text-xs text-muted">Endpoints receiving highest traffic load</span>
                </div>
                <Badge variant="primary">Traffic Volume</Badge>
              </CardHeader>
              <CardBody style={{ height: "320px" }}>
                {topEndpoints.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topEndpoints}
                      layout="vertical"
                      margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                      <XAxis type="number" stroke="var(--color-text-muted)" fontSize={11} />
                      <YAxis
                        type="category"
                        dataKey="endpoint"
                        stroke="var(--color-text-muted)"
                        fontSize={11}
                        width={130}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-surface)",
                          borderColor: "var(--color-border)",
                          borderRadius: "var(--radius-md)",
                          fontSize: "12px",
                        }}
                        formatter={(value, name, item) => [
                          `${value} hits (${item.payload.avgDuration}ms avg latency)`,
                          "Request Count",
                        ]}
                      />
                      <Bar
                        dataKey="hits"
                        fill="var(--color-primary)"
                        radius={[0, 4, 4, 0]}
                        name="Total Calls"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex-center text-center p-12 text-muted text-sm">
                    No endpoint calls recorded yet. Send requests to see live distribution.
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Error Breakdown by API Endpoint */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Error Breakdown by API Endpoint</CardTitle>
                  <span className="text-xs text-muted">Endpoints producing 4xx / 5xx clinical errors</span>
                </div>
                <Badge variant={errorBreakdown.length > 0 ? "danger" : "success"}>
                  {errorBreakdown.length > 0 ? `${errorBreakdown.length} Failing Routes` : "All Routes Healthy"}
                </Badge>
              </CardHeader>
              <CardBody style={{ height: "320px", overflowY: "auto" }}>
                {errorBreakdown.length > 0 ? (
                  <div className="flex-col gap-3">
                    {errorBreakdown.map((errItem, idx) => (
                      <div
                        key={idx}
                        className="p-3 border rounded flex-between"
                        style={{ borderColor: "var(--color-danger)", backgroundColor: "rgba(239, 68, 68, 0.05)" }}
                      >
                        <div>
                          <div className="flex-start gap-2">
                            <span className="badge badge-danger text-xs font-mono">{errItem.method}</span>
                            <span className="font-semibold text-sm text-main">{errItem.endpoint}</span>
                          </div>
                          <div className="text-xs text-muted mt-1">
                            Status: <strong className="text-danger">{errItem.lastStatusCode}</strong> | Error: {errItem.lastError}
                          </div>
                          <span className="text-xs text-muted block mt-1">
                            Last occurred: {new Date(errItem.lastOccurred).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="badge badge-danger text-sm font-bold">{errItem.count} Errors</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-col flex-center text-center p-12 text-muted">
                    <CheckCircle2 size={40} className="text-success mb-2" />
                    <h4 className="text-main font-semibold">Zero Route Errors Recorded!</h4>
                    <p className="text-xs text-muted mt-1">
                      All clinical APIs and pages are currently responding with 2xx Success status codes.
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Live Recent Request & Error Log Stream (app.log table) */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Real-Time HTTP & Error Log Stream (logs/app.log)</CardTitle>
                <span className="text-xs text-muted">Latest 50 requests captured by enterprise interceptor middleware</span>
              </div>
              <Badge variant="neutral">Auto-Aggregated</Badge>
            </CardHeader>
            <CardBody className="p-0">
              <div className="table-container" style={{ border: "none" }}>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Level</th>
                      <th>Method</th>
                      <th>Endpoint URL</th>
                      <th>Status</th>
                      <th>Latency</th>
                      <th>IP</th>
                      <th>Role</th>
                      <th>Error Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map((log) => {
                      const isError = log.status >= 400;
                      return (
                        <tr key={log.id} style={isError ? { backgroundColor: "rgba(239, 68, 68, 0.04)" } : {}}>
                          <td className="text-xs font-mono text-muted">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td>
                            <span
                              className={`badge text-xs ${
                                log.level === "ERROR"
                                  ? "badge-danger"
                                  : log.level === "WARN"
                                  ? "badge-warning"
                                  : "badge-neutral"
                              }`}
                            >
                              {log.level}
                            </span>
                          </td>
                          <td>
                            <span className="font-mono text-xs font-bold text-main">{log.method}</span>
                          </td>
                          <td className="font-mono text-xs text-main">{log.url}</td>
                          <td>
                            <span
                              className={`badge text-xs ${
                                log.status < 300
                                  ? "badge-success"
                                  : log.status < 400
                                  ? "badge-neutral"
                                  : log.status < 500
                                  ? "badge-warning"
                                  : "badge-danger"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="text-xs font-mono text-muted">{log.duration}ms</td>
                          <td className="text-xs font-mono text-muted">{log.ip}</td>
                          <td>
                            <span className="badge badge-neutral text-xs">{log.role}</span>
                          </td>
                          <td className="text-xs" style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {log.error ? (
                              <span className="text-danger font-medium">{log.error}</span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {recentLogs.length === 0 && (
                      <tr>
                        <td colSpan="9" className="text-center text-muted p-8 text-xs">
                          No requests captured in buffer yet. As APIs are accessed, real-time records stream here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (        /* =========================================================================
           TAB 2: HOSPITAL CLINICAL OPERATIONS (OVERVIEW)
           ========================================================================= */
        <>
          {/* Metric Cards Grid */}
          <div className="stats-grid">
            <Card hover>
              <CardBody>
                <div className="flex-between mb-2">
                  <span className="text-xs text-muted font-bold uppercase">Total Patient Base</span>
                  <Users size={18} className="text-primary" />
                </div>
                <h3 className="text-h2" style={{ margin: 0 }}>{stats.totalPatients} Patients</h3>
                <span className="text-xs text-muted mt-1 block">Live registered accounts</span>
              </CardBody>
            </Card>

            <Card hover>
              <CardBody>
                <div className="flex-between mb-2">
                  <span className="text-xs text-muted font-bold uppercase">Active Specialists</span>
                  <Stethoscope size={18} className="text-secondary" />
                </div>
                <h3 className="text-h2" style={{ margin: 0 }}>{stats.activeDoctors} Physicians</h3>
                <span className="text-xs text-muted mt-1 block">Board-certified clinical staff</span>
              </CardBody>
            </Card>

            <Card hover>
              <CardBody>
                <div className="flex-between mb-2">
                  <span className="text-xs text-muted font-bold uppercase">Confirmed Appointments</span>
                  <Calendar size={18} className="text-warning" />
                </div>
                <h3 className="text-h2" style={{ margin: 0 }}>{stats.appointmentsCount} Bookings</h3>
                <span className="text-xs text-muted mt-1 block">Scheduled clinical consultations</span>
              </CardBody>
            </Card>

            <Card hover>
              <CardBody>
                <div className="flex-between mb-2">
                  <span className="text-xs text-muted font-bold uppercase">System Security Posture</span>
                  <ShieldCheck size={18} className="text-success" />
                </div>
                <h3 className="text-h2 text-success" style={{ margin: 0 }}>0 Critical</h3>
                <span className="text-xs text-muted mt-1 block">JWT RBAC rules active</span>
              </CardBody>
            </Card>
          </div>

          {/* Analytics Charts Grid */}
          <div className="dashboard-grid-2col">
            {/* Monthly Trend Area Chart */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Appointment Volume & Booking Trends</CardTitle>
                  <span className="text-xs text-muted">Past 6 months growth trajectory</span>
                </div>
                <Badge variant="primary">Real-time Telemetry</Badge>
              </CardHeader>
              <CardBody style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorApt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-text-muted)" fontSize={12} />
                    <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="appointments"
                      stroke="var(--color-primary)"
                      fillOpacity={1}
                      fill="url(#colorApt)"
                      strokeWidth={2}
                      name="Total Bookings"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Department Volume Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <span className="text-xs text-muted">Current Month</span>
              </CardHeader>
              <CardBody style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="department" stroke="var(--color-text-muted)" fontSize={11} />
                    <YAxis stroke="var(--color-text-muted)" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="count" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} name="Visits" />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>

          {/* Doctor Approval & Audit Log Grid */}
          <div className="dashboard-grid-equal">
            {/* Doctor Verification Queue */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Physician License Verification Queue</CardTitle>
                  <span className="text-xs text-muted">Review credentials before activating public profile</span>
                </div>
                <Badge variant="warning">{pendingDoctors.length} Pending</Badge>
              </CardHeader>
              <CardBody className="p-0">
                <div className="table-container" style={{ border: "none" }}>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Doctor Name</th>
                        <th>Specialty</th>
                        <th>License</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingDoctors.map((doc) => (
                        <tr key={doc.id}>
                          <td className="font-semibold text-main">{doc.name}</td>
                          <td className="text-xs text-muted">{doc.specialty}</td>
                          <td>
                            <span className="badge badge-neutral text-xs">{doc.licenseNumber || "Pending"}</span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleApproveDoctor(doc.id)}
                            >
                              Approve
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {pendingDoctors.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center text-muted p-4 text-xs">
                            All active specialists verified by Medical Board.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>

            {/* Real-Time Audit Log Feed */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>System Security & Clinical Audit Events</CardTitle>
                  <span className="text-xs text-muted">Immutable platform event ledger</span>
                </div>
                <Badge variant="neutral">Audit Live</Badge>
              </CardHeader>
              <CardBody className="flex-col gap-3">
                {auditLogs.map((evt) => (
                  <div key={evt.id} className="flex-between p-3 border-bottom" style={{ alignItems: "flex-start" }}>
                    <div className="flex-start gap-3">
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor:
                            evt.action === "APPOINTMENT_BOOKED"
                              ? "var(--color-success)"
                              : "var(--color-primary)",
                          marginTop: "6px",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div className="text-sm font-semibold text-main">{evt.action || "AUDIT_EVENT"}</div>
                        <div className="text-xs text-muted">{evt.details || "System event"}</div>
                      </div>
                    </div>
                    <span className="text-xs text-muted">
                      {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString() : "Just now"}
                    </span>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <p className="text-xs text-muted p-4 text-center">No audit events recorded yet.</p>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Admin Clinical Notification Broadcast Suite */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex-start gap-2">
                  <BellRing size={18} className="text-primary" />
                  Broadcast Clinical Notification to Patients
                </CardTitle>
                <span className="text-xs text-muted">
                  Official alerts and hospital notices delivered in real-time to logged-in patients
                </span>
              </div>
              <Badge variant="danger">Administrator Broadcast Only</Badge>
            </CardHeader>
            <CardBody>
              {notifFeedback && (
                <div
                  className="p-3 mb-4 rounded flex-start gap-2 animate-fade-in"
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid var(--color-success)",
                    color: "var(--color-success-dark, #065f46)",
                    fontSize: "var(--font-size-xs)",
                  }}
                >
                  <CheckCircle2 size={16} className="text-success" />
                  <span className="font-semibold">{notifFeedback}</span>
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label className="form-label" htmlFor="broadcast-title">Announcement Title</label>
                    <input
                      id="broadcast-title"
                      type="text"
                      className="input"
                      placeholder="e.g. Free Cardiology Screening Camp this Saturday"
                      value={notifForm.title}
                      onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="broadcast-type">Alert Priority & Type</label>
                    <select
                      id="broadcast-type"
                      className="select"
                      value={notifForm.type}
                      onChange={(e) => setNotifForm({ ...notifForm, type: e.target.value })}
                    >
                      <option value="info">Info Notice (Blue)</option>
                      <option value="warning">Schedule Warning (Amber)</option>
                      <option value="alert">Clinical Urgent Alert (Red)</option>
                      <option value="success">General Health Success (Green)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="broadcast-message">Notification Message Body</label>
                  <textarea
                    id="broadcast-message"
                    className="input"
                    rows="3"
                    placeholder="Enter detailed clinical advisory or scheduling guidance for patients..."
                    value={notifForm.message}
                    onChange={(e) => setNotifForm({ ...notifForm, message: e.target.value })}
                    required
                    style={{ resize: "vertical" }}
                  />
                </div>

                <div className="flex-between" style={{ flexWrap: "wrap", gap: "1rem" }}>
                  <div className="flex-start gap-2 text-xs text-muted">
                    <span>Target Audience:</span>
                    <select
                      className="select"
                      style={{ padding: "0.25rem 0.5rem", fontSize: "11px" }}
                      value={notifForm.target}
                      onChange={(e) => setNotifForm({ ...notifForm, target: e.target.value })}
                    >
                      <option value="all_patients">All Registered Patients</option>
                      <option value="all">Entire Hospital Network (Patients & Specialists)</option>
                    </select>
                  </div>

                  <Button type="submit" variant="primary" size="sm" disabled={sendingNotif}>
                    {sendingNotif ? (
                      <>
                        <Loader2 size={14} className="animate-spin mr-1" /> Broadcasting...
                      </>
                    ) : (
                      <>
                        <Send size={14} className="mr-1" /> Broadcast to Patients
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>

        </>
      )}
    </div>
  );
}