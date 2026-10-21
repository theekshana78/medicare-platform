import { z } from "zod";
import { db } from "../config/db.js";
import { successResponse, errorResponse } from "../utils/response.js";

const getDoctorsQuerySchema = z.object({
  search: z.string().trim().max(100).optional().default(""),
  specialty: z.string().trim().max(50).optional().default("all"),
});

const getDoctorSlotsSchema = z.object({
  id: z.string().trim().min(1).max(100),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must follow YYYY-MM-DD format.")
    .optional(),
});

export const getDoctors = async (req, res, next) => {
  try {
    const { search, specialty } = getDoctorsQuerySchema.parse(req.query);

    const snapshot = await db.collection("doctors").get();
    let doctors = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Filter by Specialty
    if (specialty && specialty !== "all") {
      doctors = doctors.filter(
        (doc) => doc.specialty && doc.specialty.toLowerCase() === specialty.toLowerCase()
      );
    }

    // Filter by Search Term (sanitized string matching)
    if (search) {
      const q = search.toLowerCase();
      doctors = doctors.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.qualification.toLowerCase().includes(q) ||
          (doc.specialtyLabel && doc.specialtyLabel.toLowerCase().includes(q))
      );
    }

    return successResponse(res, 200, "Doctors retrieved successfully.", doctors);
  } catch (err) {
    next(err);
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string().min(1).max(100) }).parse(req.params);
    const doc = await db.collection("doctors").doc(id).get();

    if (!doc.exists) {
      return errorResponse(res, 404, "Physician profile not found.");
    }

    return successResponse(res, 200, "Doctor profile retrieved.", {
      ...doc.data(),
      id: doc.id,
    });
  } catch (err) {
    next(err);
  }
};

export const getDoctorSlots = async (req, res, next) => {
  try {
    const { id, date } = getDoctorSlotsSchema.parse({
      id: req.params.id,
      date: req.query.date,
    });

    const baseSlots = [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "02:00 PM",
      "02:30 PM",
      "03:00 PM",
      "03:30 PM",
      "04:00 PM",
      "04:30 PM",
    ];

    if (!date) {
      return successResponse(
        res,
        200,
        "Doctor base slots retrieved.",
        baseSlots.map((time) => ({ time, available: true }))
      );
    }

    // Check actual booked appointments for this doctor on this date
    const snapshot = await db.collection("appointments").where("doctorId", "==", id).get();
    const bookedTimes = snapshot.docs
      .map((d) => d.data())
      .filter((apt) => apt.date === date && apt.status !== "cancelled")
      .map((apt) => apt.time);

    const slots = baseSlots.map((time) => ({
      time,
      available: !bookedTimes.includes(time),
    }));

    return successResponse(res, 200, "Doctor dynamic time slots retrieved.", slots);
  } catch (err) {
    next(err);
  }
};

export const verifyDoctor = async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string().min(1).max(100) }).parse(req.params);
    const docRef = db.collection("doctors").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return errorResponse(res, 404, "Doctor not found.");
    }

    await docRef.update({
      isVerified: true,
      verifiedAt: new Date().toISOString(),
      verifiedBy: req.user.id,
    });

    return successResponse(res, 200, "Doctor credentials verified successfully.");
  } catch (err) {
    next(err);
  }
};
