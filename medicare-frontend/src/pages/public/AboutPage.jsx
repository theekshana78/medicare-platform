import SEO from "../../components/common/SEO";
import { ShieldCheck, Award, HeartHandshake, Stethoscope } from "lucide-react";
import { Card, CardBody } from "../../components/common/Card";
import Badge from "../../components/common/Badge";

export default function AboutPage() {
  return (
    <div className="layout-container" style={{ padding: "4rem 0" }}>
      <SEO
        title="About MediCore | Healthcare Digital Innovation"
        description="Learn about MediCore mission to streamline clinical scheduling, doctor workflow automation, and electronic health record security."
        canonical="https://medicore.health/about"
      />
      {/* Page Header */}
      <div className="page-header" style={{ maxWidth: "750px", marginBottom: "3rem" }}>
        <div>
          <Badge variant="primary" className="mb-2">About MediCore</Badge>
          <h1 className="page-title">Pioneering Digital Healthcare Excellence</h1>
          <p className="page-subtitle text-lead">
            MediCore is an integrated healthcare management platform engineered to modernize clinical appointments, medical records, and physician workflows.
          </p>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="dashboard-grid-equal mb-8">
        <Card hover>
          <CardBody className="flex-col gap-3">
            <div style={{ backgroundColor: "var(--color-primary-50)", width: "48px", height: "48px", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HeartHandshake size={24} className="text-primary" />
            </div>
            <h3 className="card-title">Our Clinical Mission</h3>
            <p className="text-sm text-body" style={{ lineHeight: 1.6 }}>
              To eliminate communication bottlenecks between healthcare seekers and medical specialists by providing transparent, real-time appointment booking and patient record governance.
            </p>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="flex-col gap-3">
            <div style={{ backgroundColor: "var(--color-primary-50)", width: "48px", height: "48px", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Award size={24} className="text-primary" />
            </div>
            <h3 className="card-title">Our Architecture Standard</h3>
            <p className="text-sm text-body" style={{ lineHeight: 1.6 }}>
              Built with industry-standard web engineering: Node.js, Express, Firebase Firestore, React, Tailwind CSS v4, and strict role-based access control (RBAC).
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Core Values */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Core Operating Principles</h3>
          <Badge variant="neutral">Healthcare Quality Metrics</Badge>
        </div>
        <div className="card-body">
          <div className="stats-grid">
            <div className="flex-col gap-2">
              <div className="flex-start gap-2">
                <ShieldCheck size={20} className="text-primary" />
                <h4 style={{ margin: 0, fontSize: "var(--font-size-base)" }}>Data Privacy</h4>
              </div>
              <p className="text-xs text-muted">All patient records and diagnoses are strictly confidential with zero unauthorized exposure.</p>
            </div>

            <div className="flex-col gap-2">
              <div className="flex-start gap-2">
                <Stethoscope size={20} className="text-primary" />
                <h4 style={{ margin: 0, fontSize: "var(--font-size-base)" }}>Verified Physicians</h4>
              </div>
              <p className="text-xs text-muted">Every doctor on MediCore undergoes medical license and qualification verification by administrators.</p>
            </div>

            <div className="flex-col gap-2">
              <div className="flex-start gap-2">
                <Award size={20} className="text-primary" />
                <h4 style={{ margin: 0, fontSize: "var(--font-size-base)" }}>Clinical Reliability</h4>
              </div>
              <p className="text-xs text-muted">Zero double-bookings through server-side concurrency checking and race-condition locking.</p>
            </div>

            <div className="flex-col gap-2">
              <div className="flex-start gap-2">
                <HeartHandshake size={20} className="text-primary" />
                <h4 style={{ margin: 0, fontSize: "var(--font-size-base)" }}>Accessibility</h4>
              </div>
              <p className="text-xs text-muted">Responsive mobile-first interface designed for fast loading on all devices and networks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
