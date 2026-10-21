import SEO from "../../components/common/SEO";
import { Link } from "react-router-dom";
import {
  Heart,
  Baby,
  Brain,
  Bone,
  Eye,
  Stethoscope,
  Clock,
  FlaskConical,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import Button from "../../components/common/Button";
import { Card, CardBody } from "../../components/common/Card";
import Badge from "../../components/common/Badge";

export default function ServicesPage() {
  const departments = [
    {
      title: "Cardiovascular Medicine",
      desc: "Specialized clinical evaluation of hypertension, coronary diseases, arrhythmias, and non-invasive cardiac testing.",
      icon: <Heart size={24} className="text-primary" />,
      features: ["Echocardiography (ECG)", "Hypertension Management", "Preventive Cardiac Screening"],
    },
    {
      title: "Pediatrics & Child Wellness",
      desc: "Comprehensive outpatient care for infants, children, and adolescents focusing on developmental monitoring and acute illnesses.",
      icon: <Baby size={24} className="text-primary" />,
      features: ["Immunization Schedules", "Growth & Nutrition Tracking", "Pediatric Consultations"],
    },
    {
      title: "Neurology & Neuro-Sciences",
      desc: "Diagnostic and therapeutic services for headache disorders, epilepsy, neuromuscular conditions, and stroke recovery.",
      icon: <Brain size={24} className="text-primary" />,
      features: ["EEG Diagnostic Analysis", "Neuropathy Assessments", "Cognitive Health Reviews"],
    },
    {
      title: "Orthopedic Surgery & Joints",
      desc: "Treatment of musculoskeletal conditions, sports injuries, fracture management, and joint degeneration therapy.",
      icon: <Bone size={24} className="text-primary" />,
      features: ["Joint Pain Clinics", "Fracture Assessment", "Post-Op Rehabilitation"],
    },
    {
      title: "Ophthalmology & Vision Care",
      desc: "Diagnostic eye health, refractive vision testing, cataract consultations, and diabetic retinopathy screenings.",
      icon: <Eye size={24} className="text-primary" />,
      features: ["Vision Acuity Exams", "Glaucoma Screenings", "Corneal Care"],
    },
    {
      title: "Internal & Preventive Medicine",
      desc: "Broad-spectrum diagnostic care for complex adult illnesses, metabolic disorders, and routine executive health packages.",
      icon: <Stethoscope size={24} className="text-primary" />,
      features: ["Annual Health Checks", "Diabetes & Thyroid Control", "Infectious Disease Triage"],
    },
  ];

  return (
    <div className="layout-container" style={{ padding: "4rem 0" }}>
      <SEO
        title="Comprehensive Clinical Services & Medical Departments"
        description="Explore MediCore outpatient departments, cardiovascular diagnostics, pediatric clinics, neuro-sciences, and internal medicine."
        canonical="https://medicore.health/services"
      />
      <div className="page-header" style={{ maxWidth: "750px", marginBottom: "3rem" }}>
        <div>
          <Badge variant="primary" className="mb-2">Clinical Services</Badge>
          <h1 className="page-title">Comprehensive Healthcare Services</h1>
          <p className="page-subtitle text-lead">
            Explore our specialized departments, laboratory diagnostics, and outpatient consulting facilities staffed by senior physicians.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem", marginBottom: "4rem" }}>
        {departments.map((dept) => (
          <Card key={dept.title} hover>
            <CardBody className="flex-col gap-4">
              <div style={{ backgroundColor: "var(--color-primary-50)", width: "48px", height: "48px", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {dept.icon}
              </div>
              <div>
                <h3 className="card-title" style={{ fontSize: "var(--font-size-lg)" }}>{dept.title}</h3>
                <p className="text-sm text-muted mt-2">{dept.desc}</p>
              </div>

              <div className="flex-col gap-2 border-top pt-3">
                {dept.features.map((feat) => (
                  <div key={feat} className="flex-start gap-2 text-xs text-body">
                    <CheckCircle2 size={14} className="text-success" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-2">
                <Link to="/register">
                  <Button variant="secondary" size="sm" fullWidth>
                    Book Consultation Slot
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Emergency & Lab Banner */}
      <div className="card" style={{ borderLeft: "5px solid var(--color-primary)", backgroundColor: "var(--color-surface)" }}>
        <div className="card-body flex-between" style={{ flexWrap: "wrap", gap: "2rem" }}>
          <div className="flex-start gap-4">
            <div style={{ backgroundColor: "var(--color-primary-50)", padding: "1rem", borderRadius: "var(--radius-lg)" }}>
              <FlaskConical size={32} className="text-primary" />
            </div>
            <div>
              <div className="flex-start gap-2 mb-1">
                <Badge variant="success">24/7 Service</Badge>
                <Badge variant="info">Digital Results</Badge>
              </div>
              <h3 className="card-title" style={{ fontSize: "var(--font-size-xl)" }}>
                Diagnostic Laboratory & Emergency Clinical Triage
              </h3>
              <p className="text-sm text-muted mt-1">
                Automated test processing with instant electronic report dispatch to your patient dashboard.
              </p>
            </div>
          </div>

          <div className="flex-start gap-3">
            <Link to="/contact">
              <Button variant="outline" icon={<PhoneCall size={16} />}>
                Emergency Hotline
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" icon={<Clock size={16} />}>
                Schedule Lab Test
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
