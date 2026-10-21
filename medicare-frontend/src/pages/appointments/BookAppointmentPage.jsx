import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  Stethoscope,
  CheckCircle2,
  MapPin,
  Loader2,
} from "lucide-react";
import Button from "../../components/common/Button";
import InputField from "../../components/forms/InputField";
import SelectField from "../../components/forms/SelectField";
import { Card, CardHeader, CardTitle, CardBody } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { getDoctorsApi, getDoctorSlotsApi } from "../../services/doctors/doctorService";
import { createAppointmentApi } from "../../services/appointments/appointmentService";

export default function BookAppointmentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramDoctorId = searchParams.get("doctorId") || "";
  const paramSpecialty = searchParams.get("specialty") || "all";
  const paramDate = searchParams.get("date") || "";

  const [doctorsList, setDoctorsList] = useState([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);

  const [selectedSpecialty, setSelectedSpecialty] = useState(paramSpecialty);
  const [selectedDoctorId, setSelectedDoctorId] = useState(paramDoctorId);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (paramDate) return paramDate;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState("04:30 PM");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await getDoctorsApi();
        setDoctorsList(data);
        if (data.length > 0) {
          if (paramDoctorId && data.some((d) => d.id === paramDoctorId)) {
            setSelectedDoctorId(paramDoctorId);
          } else {
            setSelectedDoctorId(data[0].id);
          }
        }
      } catch (err) {
        setErrorMessage(err.message || "Failed to load active doctors roster.");
      } finally {
        setFetchingDoctors(false);
      }
    };
    loadDoctors();
  }, [paramDoctorId]);

  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) return;
    let ignore = false;
    getDoctorSlotsApi(selectedDoctorId, selectedDate)
      .then((data) => {
        if (!ignore) {
          setAvailableSlots(data);
          const firstFree = data.find((s) => s.available);
          if (firstFree) setSelectedSlot(firstFree.time);
        }
      })
      .catch(() => {})
;
    return () => {
      ignore = true;
    };
  }, [selectedDoctorId, selectedDate]);

  const selectedDoctor =
    doctorsList.find((d) => d.id === selectedDoctorId) || doctorsList[0] || {};

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      await createAppointmentApi({
        doctorId: selectedDoctorId,
        date: selectedDate,
        time: selectedSlot,
        specialty: selectedDoctor.specialtyLabel || selectedDoctor.specialty,
        symptoms: symptoms || "Routine Checkup",
      });

      setBookingSuccess(true);
      setTimeout(() => {
        navigate("/appointments");
      }, 1500);
    } catch (err) {
      setErrorMessage(
        err.message || "Failed to reserve appointment. Slot may be contested."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col gap-6 animate-fade-in" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: "1rem" }}>
        <div>
          <Badge variant="primary" className="mb-2">New Clinic Reservation</Badge>
          <h1 className="page-title">Book a Specialist Consultation</h1>
          <p className="page-subtitle">
            Choose your specialist, preferred appointment date, and available consultation time.
          </p>
        </div>
      </div>

      {bookingSuccess && (
        <div className="alert alert-success">
          <CheckCircle2 className="alert-icon" />
          <div className="alert-content">
            <div className="alert-title">Appointment Reserved & Recorded in Database!</div>
            <div>
              Slot with <strong>{selectedDoctor.name}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong> confirmed. Redirecting...
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger">
          <div className="alert-content">{errorMessage}</div>
        </div>
      )}

      {fetchingDoctors ? (
        <div className="text-center p-12">
          <Loader2 size={32} className="animate-spin text-primary" style={{ margin: "0 auto" }} />
          <p className="text-muted text-sm mt-3">Loading active hospital specialists...</p>
        </div>
      ) : (
        <form onSubmit={handleBookingSubmit} className="dashboard-grid-2col" style={{ alignItems: "flex-start" }}>
          {/* Left Column: Form Controls */}
          <div className="flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Select Specialist & Date</CardTitle>
                <Badge variant="neutral">Step 1 of 2</Badge>
              </CardHeader>
              <CardBody className="flex-col gap-4">
                <SelectField
                  label="Filter by Department"
                  name="specialty"
                  options={[
                    { value: "all", label: "All Departments" },
                    { value: "cardiology", label: "Cardiology (Heart Health)" },
                    { value: "pediatrics", label: "Pediatrics (Child Health)" },
                    { value: "neurology", label: "Neurology (Brain & Spine)" },
                    { value: "orthopedics", label: "Orthopedics (Bones & Joints)" },
                    { value: "general", label: "Internal Medicine" },
                  ]}
                  value={selectedSpecialty}
                  onChange={(e) => {
                    const spec = e.target.value;
                    setSelectedSpecialty(spec);
                    const matching = doctorsList.find(
                      (d) => spec === "all" || d.specialty === spec
                    );
                    if (matching) setSelectedDoctorId(matching.id);
                  }}
                />

                <SelectField
                  label="Assigned Specialist"
                  name="doctor"
                  options={doctorsList
                    .filter((d) => selectedSpecialty === "all" || d.specialty === selectedSpecialty)
                    .map((d) => ({
                      value: d.id,
                      label: `${d.name} (${d.specialtyLabel || d.specialty} - ${d.consultationFee || "LKR 3,500"})`,
                    }))}
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                />

                <InputField
                  label="Consultation Date"
                  name="date"
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Available Time Slots & Notes</CardTitle>
                <Badge variant="neutral">Step 2 of 2</Badge>
              </CardHeader>
              <CardBody className="flex-col gap-4">
                <div>
                  <label className="form-label mb-2 block">
                    Select Time Slot <span className="required-mark">*</span>
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.5rem" }}>
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        className={`btn btn-sm ${
                          selectedSlot === slot.time
                            ? "btn-primary"
                            : slot.available
                            ? "btn-outline"
                            : "btn-ghost disabled"
                        }`}
                        style={{ fontSize: "11px", justifyContent: "center" }}
                        onClick={() => setSelectedSlot(slot.time)}
                      >
                        {slot.time} {!slot.available ? " (Booked)" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Reason for Visit / Clinical Symptoms</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Describe your symptoms (e.g. routine review, chest discomfort, medication check)..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                  />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column: Reservation Summary Card */}
          <div>
            <Card style={{ position: "sticky", top: "calc(var(--header-height) + 1.5rem)" }}>
              <CardHeader style={{ backgroundColor: "var(--color-primary-50)" }}>
                <div className="flex-start gap-2">
                  <Stethoscope size={18} className="text-primary" />
                  <CardTitle style={{ fontSize: "var(--font-size-base)" }}>Booking Summary</CardTitle>
                </div>
                <Badge variant="primary">Server Verified</Badge>
              </CardHeader>
              <CardBody className="flex-col gap-3">
                <div>
                  <span className="text-xs text-muted font-bold uppercase">Physician</span>
                  <h4 className="text-h4" style={{ margin: "0.125rem 0" }}>{selectedDoctor.name || "Select Doctor"}</h4>
                  <span className="text-xs text-primary font-semibold">{selectedDoctor.specialtyLabel || selectedDoctor.specialty}</span>
                </div>

                <div className="border-top pt-2">
                  <div className="flex-between text-xs text-body mb-2">
                    <span className="flex-start gap-1 text-muted"><MapPin size={14} /> Location:</span>
                    <strong>{selectedDoctor.hospital || "Central OPD"}</strong>
                  </div>
                  <div className="flex-between text-xs text-body mb-2">
                    <span className="flex-start gap-1 text-muted"><Calendar size={14} /> Date:</span>
                    <strong>{selectedDate}</strong>
                  </div>
                  <div className="flex-between text-xs text-body mb-2">
                    <span className="flex-start gap-1 text-muted"><Clock size={14} /> Time:</span>
                    <strong>{selectedSlot}</strong>
                  </div>
                </div>

                <div className="border-top pt-3 flex-between">
                  <div>
                    <span className="text-xs text-muted block">Hospital Consultation Fee</span>
                    <span className="text-h4 font-bold text-main">{selectedDoctor.consultationFee || "LKR 3,500"}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  icon={<CheckCircle2 size={18} />}
                  className="mt-2"
                >
                  Confirm Appointment Slot
                </Button>

                <p className="text-xs text-muted text-center mt-1" style={{ margin: 0 }}>
                  Backed by server-side race-condition prevention lock.
                </p>
              </CardBody>
            </Card>
          </div>
        </form>
      )}
    </div>
  );
}
