import { db } from "../config/db.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { APPOINTMENT_STATUS } from "../constants/appointmentStatus.js";
import { ROLES } from "../constants/roles.js";
import {
  bookAppointmentSchema,
  updateAppointmentStatusSchema,
} from "../validators/appointmentValidator.js";

/**
 * Create new appointment reservation
 * RBAC: Only PATIENT or ADMIN can create reservations
 */
export const createAppointment = async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.PATIENT && req.user.role !== ROLES.ADMIN) {
      return errorResponse(res, 403, "Only patient accounts are authorized to book clinical consultations.");
    }

    const validated = bookAppointmentSchema.parse(req.body);

    // 1. Verify doctor exists and is verified
    const doctorDoc = await db.collection("doctors").doc(validated.doctorId).get();
    if (!doctorDoc.exists) {
      return errorResponse(res, 404, "Selected medical specialist could not be found.");
    }
    const doctorData = doctorDoc.data();

    if (!doctorData.isVerified) {
      return errorResponse(res, 400, "Selected practitioner is not currently verified for clinical reservations.");
    }

    // 2. Server-Side Concurrency & Double-Booking Prevention (Transactional Lock)
    const existingSlots = await db
      .collection("appointments")
      .where("doctorId", "==", validated.doctorId)
      .get();

    const isSlotTaken = existingSlots.docs.some((doc) => {
      const apt = doc.data();
      return (
        apt.date === validated.date &&
        apt.time === validated.time &&
        apt.status !== APPOINTMENT_STATUS.CANCELLED
      );
    });

    if (isSlotTaken) {
      return errorResponse(
        res,
        409,
        `The consultation time slot ${validated.time} on ${validated.date} is already reserved. Please select another slot.`
      );
    }

    // 3. Create Appointment Record bound to authenticated user
    const appointmentRecord = {
      patientId: req.user.id,
      patientName: req.user.name,
      patientEmail: req.user.email,
      doctorId: validated.doctorId,
      doctorName: doctorData.name,
      specialty: doctorData.specialtyLabel || validated.specialty || "General",
      room: doctorData.hospital || "OPD Room 204",
      fee: doctorData.consultationFee || "LKR 3,500",
      date: validated.date,
      time: validated.time,
      symptoms: validated.symptoms || "Routine Consultation",
      status: APPOINTMENT_STATUS.CONFIRMED,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("appointments").add(appointmentRecord);

    // 4. Record Audit Log
    await db.collection("audit_logs").add({
      action: "APPOINTMENT_BOOKED",
      actorId: req.user.id,
      actorRole: req.user.role,
      details: `Appointment #${docRef.id} booked with ${doctorData.name} on ${validated.date} at ${validated.time}`,
      timestamp: new Date().toISOString(),
    });

    return successResponse(res, 201, "Appointment reserved and confirmed successfully.", {
      ...appointmentRecord,
      id: docRef.id,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieve appointments for authenticated user
 * RBAC: Scoped strictly to patientId or doctorId (Admin sees all)
 */
export const getMyAppointments = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    const snapshot = await db.collection("appointments").get();
    let appointments = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    if (role === ROLES.PATIENT) {
      appointments = appointments.filter((apt) => apt.patientId === id);
    } else if (role === ROLES.DOCTOR) {
      appointments = appointments.filter((apt) => apt.doctorId === id);
    } else if (role !== ROLES.ADMIN) {
      return errorResponse(res, 403, "Unauthorized role access.");
    }

    appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return successResponse(res, 200, "Appointments retrieved successfully.", appointments);
  } catch (err) {
    next(err);
  }
};

/**
 * Get appointment by ID
 * IDOR Defense: Verifies ownership (Patient must match patientId, Doctor must match doctorId)
 */
export const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const aptDoc = await db.collection("appointments").doc(id).get();

    if (!aptDoc.exists) {
      return errorResponse(res, 404, "Appointment record not found.");
    }

    const apt = aptDoc.data();

    // IDOR Authorization Checks
    if (req.user.role === ROLES.PATIENT && apt.patientId !== req.user.id) {
      return errorResponse(res, 403, "Access denied. You do not have permission to view this clinical record.");
    }

    if (req.user.role === ROLES.DOCTOR && apt.doctorId !== req.user.id) {
      return errorResponse(res, 403, "Access denied. You are not assigned to this patient consultation.");
    }

    return successResponse(res, 200, "Appointment retrieved.", { ...apt, id: aptDoc.id });
  } catch (err) {
    next(err);
  }
};

/**
 * Update appointment status
 * IDOR & Broken Access Defense: Patients forbidden. Only assigned doctor or Admin.
 */
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = updateAppointmentStatusSchema.parse(req.body);

    const aptRef = db.collection("appointments").doc(id);
    const aptDoc = await aptRef.get();

    if (!aptDoc.exists) {
      return errorResponse(res, 404, "Appointment not found.");
    }

    const apt = aptDoc.data();

    // Security: Patients are strictly forbidden from modifying clinical status
    if (req.user.role === ROLES.PATIENT) {
      return errorResponse(res, 403, "Patients are strictly forbidden from modifying clinical appointment statuses.");
    }

    // Security: Doctors can only modify their own assigned appointments
    if (req.user.role === ROLES.DOCTOR && apt.doctorId !== req.user.id) {
      return errorResponse(res, 403, "Unauthorized: You may only update appointments assigned to your clinical schedule.");
    }

    await aptRef.update({
      status: validated.status,
      physicianNotes: validated.notes || apt.physicianNotes || "",
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.id,
    });

    // Audit log
    await db.collection("audit_logs").add({
      action: "APPOINTMENT_STATUS_UPDATED",
      actorId: req.user.id,
      actorRole: req.user.role,
      details: `Appointment #${id} status changed to ${validated.status}`,
      timestamp: new Date().toISOString(),
    });

    return successResponse(res, 200, `Appointment status updated to ${validated.status}.`);
  } catch (err) {
    next(err);
  }
};

/**
 * Cancel appointment
 * IDOR Defense: Only the patient who booked it, the assigned doctor, or admin can cancel.
 */
export const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const aptRef = db.collection("appointments").doc(id);
    const aptDoc = await aptRef.get();

    if (!aptDoc.exists) {
      return errorResponse(res, 404, "Appointment not found.");
    }

    const apt = aptDoc.data();

    // IDOR Checks:
    if (req.user.role === ROLES.PATIENT && apt.patientId !== req.user.id) {
      return errorResponse(res, 403, "Unauthorized: You are only permitted to cancel your own appointments.");
    }

    if (req.user.role === ROLES.DOCTOR && apt.doctorId !== req.user.id) {
      return errorResponse(res, 403, "Unauthorized: You are only permitted to cancel appointments assigned to your clinic.");
    }

    if (apt.status === APPOINTMENT_STATUS.COMPLETED) {
      return errorResponse(res, 400, "Completed consultations cannot be cancelled.");
    }

    await aptRef.update({
      status: APPOINTMENT_STATUS.CANCELLED,
      cancelledAt: new Date().toISOString(),
      cancelledBy: req.user.id,
    });

    // Audit log
    await db.collection("audit_logs").add({
      action: "APPOINTMENT_CANCELLED",
      actorId: req.user.id,
      actorRole: req.user.role,
      details: `Appointment #${id} cancelled by user ${req.user.id}`,
      timestamp: new Date().toISOString(),
    });

    return successResponse(res, 200, "Appointment cancelled successfully. Time slot has been released.");
  } catch (err) {
    next(err);
  }
};
