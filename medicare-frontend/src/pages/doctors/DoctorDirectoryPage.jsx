import SEO from "../../components/common/SEO";
import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Stethoscope,
  Calendar,
  Star,
  MapPin,
  Clock,
  Loader2,
} from "lucide-react";
import Button from "../../components/common/Button";
import { Card, CardBody } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { getDoctorsApi } from "../../services/doctors/doctorService";

export default function DoctorDirectoryPage() {
  const [searchParams] = useSearchParams();
  const initialSpecialty = searchParams.get("specialty") || "all";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [doctors, setDoctors] = useState([]);
  const [allSpecialtiesList, setAllSpecialtiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initial load to discover all specialties dynamically from the server
  useEffect(() => {
    let ignore = false;
    getDoctorsApi({ specialty: "all" })
      .then((data) => {
        if (!ignore && Array.isArray(data)) {
          const unique = Array.from(
            new Set(data.map((d) => d.specialty).filter(Boolean))
          );
          setAllSpecialtiesList(unique);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  // Dynamic filter query
  useEffect(() => {
    let ignore = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getDoctorsApi({
          search: searchTerm,
          specialty: selectedSpecialty,
        });
        if (!ignore) setDoctors(data);
      } catch (err) {
        if (!ignore) setError(err.message || "Unable to fetch active doctors from server.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }, 250);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [searchTerm, selectedSpecialty]);

  const specialties = useMemo(() => {
    const list = [{ id: "all", label: "All Specialties" }];
    allSpecialtiesList.forEach((spec) => {
      list.push({
        id: spec.toLowerCase(),
        label: spec.charAt(0).toUpperCase() + spec.slice(1),
      });
    });
    return list;
  }, [allSpecialtiesList]);

  return (
    <div className="layout-container" style={{ padding: "4rem 0" }}>
      <SEO title="Find Certified Doctors and Specialists" description="Search board-certified physicians." canonical="https://medicore.health/doctors" />
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: "2.5rem" }}>
        <div>
          <Badge variant="primary" className="mb-2">Medical Directory</Badge>
          <h1 className="page-title">Find Certified Doctors & Specialists</h1>
          <p className="page-subtitle text-lead">
            Select your preferred specialist and schedule your clinic visit with zero wait times.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        className="card mb-6"
        style={{
          padding: "1.25rem",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {/* Search Input */}
          <div className="input-with-icon">
            <span className="input-icon-left">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by physician name, specialty, or qualifications..."
              className="form-input has-icon-left"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Specialty Filter Dropdown */}
          <div className="flex-start gap-2">
            <select
              className="form-select"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              {specialties.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.label}
                </option>
              ))}
            </select>

            {(searchTerm || selectedSpecialty !== "all") && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialty("all");
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger mb-6">
          <div className="alert-content">{error}</div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center p-12">
          <Loader2 size={36} className="animate-spin text-primary" style={{ margin: "0 auto" }} />
          <p className="text-sm text-muted mt-3">Synchronizing active doctors from Firestore...</p>
        </div>
      ) : (
        /* Doctors Grid */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {doctors.map((doc) => (
            <Card key={doc.id} hover className="flex-col">
              <CardBody className="flex-col gap-4 flex-1">
                <div className="flex-between">
                  <div className="flex-start gap-3">
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        backgroundColor: "var(--color-primary-50)",
                        color: "var(--color-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "var(--font-size-lg)",
                        border: "2px solid var(--color-primary-200)",
                      }}
                    >
                      {doc.name.charAt(3) || "D"}
                    </div>
                    <div>
                      <h3 className="card-title" style={{ fontSize: "var(--font-size-base)", margin: 0 }}>
                        {doc.name}
                      </h3>
                      <span className="text-xs font-semibold text-primary block mt-0.5">
                        {doc.specialtyLabel || doc.specialty}
                      </span>
                    </div>
                  </div>

                  <div className="flex-start gap-1 text-xs font-bold text-main">
                    <Star size={14} fill="var(--color-warning)" color="var(--color-warning)" />
                    <span>{doc.rating || "5.0"}</span>
                  </div>
                </div>

                <p className="text-xs text-muted" style={{ lineHeight: 1.5, margin: 0 }}>
                  {doc.qualification}
                </p>

                <div className="flex-col gap-1.5 border-top pt-3 text-xs text-muted">
                  <div className="flex-start gap-2">
                    <MapPin size={14} className="text-primary" />
                    <span>{doc.hospital || "Central OPD"}</span>
                  </div>
                  <div className="flex-start gap-2">
                    <Clock size={14} className="text-primary" />
                    <span>{doc.experience || "10+ Years Exp."}</span>
                  </div>
                  <div className="flex-between mt-1">
                    <span className="font-semibold text-main">Consultation Fee:</span>
                    <span className="font-bold text-primary">{doc.consultationFee || "LKR 3,500"}</span>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-top">
                  <Link to={`/appointments/book?doctorId=${doc.id}`}>
                    <Button variant="primary" size="sm" fullWidth icon={<Calendar size={14} />}>
                      Book Consultation Slot
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}

          {doctors.length === 0 && (
            <div className="text-center p-12 text-muted" style={{ gridColumn: "1 / -1" }}>
              <Stethoscope size={48} className="text-muted" style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
              <h3 className="text-h3" style={{ margin: 0 }}>No Physicians Match Your Search</h3>
              <p className="text-sm mt-1">Try adjusting your specialty filter or clear your search term.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialty("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
