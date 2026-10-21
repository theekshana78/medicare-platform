import { z } from "zod";
import { APPOINTMENT_STATUS } from "../constants/appointmentStatus.js";

export const bookAppointmentSchema = z.object({
  doctorId: z.string().min(1, "Doctor selection is required."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must follow YYYY-MM-DD format."),
  time: z.string().min(1, "Consultation time slot is required."),
  specialty: z.string().optional(),
  symptoms: z.string().optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum([
    APPOINTMENT_STATUS.PENDING,
    APPOINTMENT_STATUS.CONFIRMED,
    APPOINTMENT_STATUS.COMPLETED,
    APPOINTMENT_STATUS.CANCELLED,
  ]),
  notes: z.string().optional(),
});
