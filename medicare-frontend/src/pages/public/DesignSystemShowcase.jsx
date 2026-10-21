import { useState } from "react";
import {
  HeartPulse,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Calendar,
  User,
  Stethoscope,
  Search,
  Activity,
  ArrowRight,
} from "lucide-react";

export default function DesignSystemShowcase() {
  const [btnLoading, setBtnLoading] = useState(false);

  return (
    <div className="layout-container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
      {/* Header Banner */}
      <div className="card mb-8 animate-fade-in" style={{ borderLeft: "5px solid var(--color-primary)" }}>
        <div className="card-body flex-between" style={{ flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div className="flex-start gap-2 mb-2">
              <span className="badge badge-primary">
                <HeartPulse size={14} /> MediCore Architecture
              </span>
              <span className="badge badge-success">
                <span className="badge-dot"></span> Phase 1 Active
              </span>
            </div>
            <h1 className="text-h2 text-primary" style={{ margin: 0 }}>
              MediCore Healthcare Platform
            </h1>
            <p className="text-muted mt-2">
              Phase 1: Centralized CSS Design System & Project Architecture Foundation.
            </p>
          </div>
          <div className="flex-start gap-3">
            <button
              className={`btn btn-primary ${btnLoading ? "btn-loading" : ""}`}
              onClick={() => {
                setBtnLoading(true);
                setTimeout(() => setBtnLoading(false), 2000);
              }}
            >
              <Activity size={16} /> Test Interactive State
            </button>
            <span className="status-indicator">
              <span className="status-dot status-online"></span> System Online
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="stats-grid">
        <div className="card card-hover">
          <div className="card-body">
            <div className="flex-between mb-2">
              <span className="text-xs text-muted font-medium">TOTAL PATIENTS</span>
              <User size={18} className="text-primary" />
            </div>
            <h3 className="text-h3" style={{ margin: 0 }}>2,845</h3>
            <span className="badge badge-success mt-2">
              <CheckCircle2 size={12} /> +12% this month
            </span>
          </div>
        </div>

        <div className="card card-hover">
          <div className="card-body">
            <div className="flex-between mb-2">
              <span className="text-xs text-muted font-medium">ACTIVE DOCTORS</span>
              <Stethoscope size={18} className="text-primary" />
            </div>
            <h3 className="text-h3" style={{ margin: 0 }}>48</h3>
            <span className="badge badge-info mt-2">
              <Info size={12} /> 14 Specialties
            </span>
          </div>
        </div>

        <div className="card card-hover">
          <div className="card-body">
            <div className="flex-between mb-2">
              <span className="text-xs text-muted font-medium">APPOINTMENTS TODAY</span>
              <Calendar size={18} className="text-primary" />
            </div>
            <h3 className="text-h3" style={{ margin: 0 }}>124</h3>
            <span className="badge badge-warning mt-2">
              <AlertTriangle size={12} /> 8 Pending Approval
            </span>
          </div>
        </div>

        <div className="card card-hover">
          <div className="card-body">
            <div className="flex-between mb-2">
              <span className="text-xs text-muted font-medium">SYSTEM SECURITY</span>
              <ShieldCheck size={18} className="text-primary" />
            </div>
            <h3 className="text-h3" style={{ margin: 0 }}>JWT + RBAC</h3>
            <span className="badge badge-success mt-2">
              <CheckCircle2 size={12} /> Ready for Auth
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Component Showcase */}
      <div className="dashboard-grid-2col">
        {/* Left Column: Buttons & Forms */}
        <div className="flex-col gap-6">
          {/* Buttons Showcase */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Centralized Button Hierarchy</h4>
              <span className="badge badge-neutral">assets/css/buttons.css</span>
            </div>
            <div className="card-body flex-col gap-4">
              <div>
                <p className="text-sm font-semibold mb-2">Button Variants</p>
                <div className="flex-start gap-3" style={{ flexWrap: "wrap" }}>
                  <button className="btn btn-primary">Primary Action</button>
                  <button className="btn btn-secondary">Secondary</button>
                  <button className="btn btn-outline">Outline</button>
                  <button className="btn btn-danger">Danger</button>
                  <button className="btn btn-ghost">Ghost</button>
                  <button className="btn btn-primary" disabled>Disabled</button>
                </div>
              </div>

              <div className="border-top" style={{ paddingTop: "1rem" }}>
                <p className="text-sm font-semibold mb-2">Button Sizes & Loading</p>
                <div className="flex-start gap-3" style={{ flexWrap: "wrap", alignItems: "center" }}>
                  <button className="btn btn-primary btn-sm">Small (.btn-sm)</button>
                  <button className="btn btn-primary btn-md">Medium (.btn-md)</button>
                  <button className="btn btn-primary btn-lg">Large (.btn-lg)</button>
                  <button className="btn btn-primary btn-loading">Loading</button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Elements Showcase */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Centralized Form Controls</h4>
              <span className="badge badge-neutral">assets/css/forms.css</span>
            </div>
            <div className="card-body flex-col gap-4">
              <div className="form-group">
                <label className="form-label">
                  Doctor / Patient Full Name <span className="required-mark">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon-left"><User size={16} /></span>
                  <input
                    type="text"
                    className="form-input has-icon-left"
                    placeholder="e.g. Dr. Sarah Jenkins"
                    defaultValue="Dr. Sarah Jenkins"
                  />
                </div>
                <span className="form-hint">Displayed on official medical certificates.</span>
              </div>

              <div className="dashboard-grid-equal" style={{ gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Medical Specialty</label>
                  <select className="form-select" defaultValue="cardiology">
                    <option value="cardiology">Cardiology</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="neurology">Neurology</option>
                    <option value="orthopedics">Orthopedics</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Search Record</label>
                  <div className="input-with-icon">
                    <span className="input-icon-left"><Search size={16} /></span>
                    <input
                      type="text"
                      className="form-input has-icon-left"
                      placeholder="Search patient ID..."
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Invalid Input Demonstration <span className="required-mark">*</span>
                </label>
                <input
                  type="email"
                  className="form-input is-invalid"
                  defaultValue="invalid-email-address"
                />
                <span className="form-error">
                  <AlertTriangle size={14} /> Please enter a valid medical practitioner email address.
                </span>
              </div>

              <div className="flex-start gap-4">
                <label className="form-check">
                  <input type="checkbox" className="form-checkbox" defaultChecked />
                  <span>Receive SMS notifications</span>
                </label>
                <label className="form-check">
                  <input type="radio" name="gender" className="form-radio" defaultChecked />
                  <span>Verified</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts, Badges, Table */}
        <div className="flex-col gap-6">
          {/* Alerts & Feedback */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Feedback & Notification System</h4>
              <span className="badge badge-neutral">prototype/components.css</span>
            </div>
            <div className="card-body flex-col gap-3">
              <div className="alert alert-info">
                <Info className="alert-icon" />
                <div className="alert-content">
                  <div className="alert-title">Schedule Notice</div>
                  <div>Next doctor availability updates are scheduled for 09:00 AM UTC.</div>
                </div>
              </div>

              <div className="alert alert-success">
                <CheckCircle2 className="alert-icon" />
                <div className="alert-content">
                  <div className="alert-title">Appointment Confirmed</div>
                  <div>Dr. Fernando has confirmed appointment slot #MED-4029.</div>
                </div>
              </div>

              <div className="alert alert-warning">
                <AlertTriangle className="alert-icon" />
                <div className="alert-content">
                  <div className="alert-title">Action Required</div>
                  <div>3 pending patient registrations awaiting Administrator verification.</div>
                </div>
              </div>

              <div className="alert alert-danger">
                <XCircle className="alert-icon" />
                <div className="alert-content">
                  <div className="alert-title">Slot Unavailable</div>
                  <div>The requested time slot has just been reserved by another patient.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Primitive */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Data Table Primitive</h4>
              <span className="badge badge-neutral">prototype/components.css</span>
            </div>
            <div className="card-body p-0">
              <div className="table-container" style={{ border: "none" }}>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="font-medium text-main">Kamal Perera</div>
                        <div className="text-xs text-muted">ID: #PT-1002</div>
                      </td>
                      <td>Dr. Sarah Jenkins</td>
                      <td><span className="badge badge-success">Confirmed</span></td>
                    </tr>
                    <tr>
                      <td>
                        <div className="font-medium text-main">Nimali Silva</div>
                        <div className="text-xs text-muted">ID: #PT-1009</div>
                      </td>
                      <td>Dr. David Miller</td>
                      <td><span className="badge badge-warning">Pending</span></td>
                    </tr>
                    <tr>
                      <td>
                        <div className="font-medium text-main">Anura Senanayake</div>
                        <div className="text-xs text-muted">ID: #PT-1021</div>
                      </td>
                      <td>Dr. Robert Taylor</td>
                      <td><span className="badge badge-danger">Cancelled</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-outline btn-sm">
                View All Appointments <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
