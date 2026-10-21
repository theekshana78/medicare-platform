import SEO from "../../components/common/SEO";
import { useState } from "react";
import { PhoneCall, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import Button from "../../components/common/Button";
import InputField from "../../components/forms/InputField";
import { Card, CardBody } from "../../components/common/Card";
import Badge from "../../components/common/Badge";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="layout-container" style={{ padding: "4rem 0" }}>
      <SEO
        title="24/7 Clinical Contact & Emergency Hospital Support"
        description="Get in touch with MediCore clinical operators, patient billing support, and emergency hospital headquarters in Colombo 07."
        canonical="https://medicore.health/contact"
      />
      <div className="page-header" style={{ maxWidth: "700px", marginBottom: "3rem" }}>
        <div>
          <Badge variant="primary" className="mb-2">Get In Touch</Badge>
          <h1 className="page-title">We Are Here To Assist You</h1>
          <p className="page-subtitle text-lead">
            Have questions regarding doctor schedules, medical departments, or clinical billing? Contact our support staff 24/7.
          </p>
        </div>
      </div>

      <div className="dashboard-grid-2col">
        {/* Left Column: Contact Information Cards */}
        <div className="flex-col gap-4">
          <Card hover>
            <CardBody className="flex-start gap-4">
              <div style={{ backgroundColor: "var(--color-primary-50)", padding: "0.875rem", borderRadius: "var(--radius-md)" }}>
                <PhoneCall size={24} className="text-primary" />
              </div>
              <div>
                <span className="text-xs text-muted font-bold uppercase tracking-wider">Clinical Telephone</span>
                <h4 style={{ margin: "0.25rem 0", fontSize: "var(--font-size-lg)" }}>+94 (11) 234-5678</h4>
                <p className="text-xs text-muted">Direct operator line for appointments & emergencies.</p>
              </div>
            </CardBody>
          </Card>

          <Card hover>
            <CardBody className="flex-start gap-4">
              <div style={{ backgroundColor: "var(--color-primary-50)", padding: "0.875rem", borderRadius: "var(--radius-md)" }}>
                <Mail size={24} className="text-primary" />
              </div>
              <div>
                <span className="text-xs text-muted font-bold uppercase tracking-wider">Electronic Inquiries</span>
                <h4 style={{ margin: "0.25rem 0", fontSize: "var(--font-size-lg)" }}>care@medicore.health</h4>
                <p className="text-xs text-muted">Official correspondence & patient record requests.</p>
              </div>
            </CardBody>
          </Card>

          <Card hover>
            <CardBody className="flex-start gap-4">
              <div style={{ backgroundColor: "var(--color-primary-50)", padding: "0.875rem", borderRadius: "var(--radius-md)" }}>
                <MapPin size={24} className="text-primary" />
              </div>
              <div>
                <span className="text-xs text-muted font-bold uppercase tracking-wider">Hospital Campus</span>
                <h4 style={{ margin: "0.25rem 0", fontSize: "var(--font-size-base)" }}>MediCore Central Hospital</h4>
                <p className="text-xs text-muted">No. 120, Healthcare Avenue, Colombo 07, Sri Lanka.</p>
              </div>
            </CardBody>
          </Card>

          <Card hover>
            <CardBody className="flex-start gap-4">
              <div style={{ backgroundColor: "var(--color-primary-50)", padding: "0.875rem", borderRadius: "var(--radius-md)" }}>
                <Clock size={24} className="text-primary" />
              </div>
              <div>
                <span className="text-xs text-muted font-bold uppercase tracking-wider">Consulting Hours</span>
                <h4 style={{ margin: "0.25rem 0", fontSize: "var(--font-size-base)" }}>Mon – Sun: 07:00 AM – 10:00 PM</h4>
                <p className="text-xs text-muted">Emergency trauma unit active 24/7/365.</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Contact Inquiry Form */}
        <div>
          <Card>
            <div className="card-header">
              <h3 className="card-title">Send a Clinical Message</h3>
              <Badge variant="neutral">Response in &lt; 2 hrs</Badge>
            </div>
            <CardBody>
              {submitted ? (
                <div className="flex-col items-center justify-center text-center p-6 gap-3">
                  <div style={{ backgroundColor: "var(--color-success-light)", color: "var(--color-success-text)", padding: "1rem", borderRadius: "50%" }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-h3" style={{ margin: 0 }}>Message Received</h3>
                  <p className="text-sm text-muted">
                    Thank you for reaching out to MediCore. Our clinical coordination desk will review your inquiry and respond shortly.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex-col gap-4">
                  <InputField
                    label="Your Full Name"
                    name="name"
                    required
                    placeholder="e.g. Kasun Jayawardena"
                  />

                  <div className="dashboard-grid-equal" style={{ gap: "1rem" }}>
                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. kasun@example.com"
                    />
                    <InputField
                      label="Contact Phone"
                      name="phone"
                      type="tel"
                      placeholder="e.g. +94 77 123 4567"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department / Inquiry Type</label>
                    <select className="form-select" defaultValue="appointment">
                      <option value="appointment">Appointment Rescheduling</option>
                      <option value="billing">Insurance & Billing Query</option>
                      <option value="records">Medical Records Request</option>
                      <option value="general">General Healthcare Inquiry</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Message Details <span className="required-mark">*</span>
                    </label>
                    <textarea
                      className="form-textarea"
                      placeholder="Please explain your clinical query or doctor preference..."
                      rows="4"
                      required
                    />
                  </div>

                  <Button type="submit" variant="primary" loading={loading} icon={<Send size={16} />}>
                    Submit Inquiry
                  </Button>
                </form>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
