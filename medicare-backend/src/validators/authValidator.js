import { z } from "zod";
import { ROLES } from "../constants/roles.js";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters.").max(100),
  email: z.string().trim().email("Invalid email address format.").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters for healthcare data protection.")
    .regex(/[A-Za-z]/, "Password must contain at least one letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
  // Security: Public self-registration only permits PATIENT role. ADMIN and DOCTOR roles require authorized internal provisioning.
  role: z.literal(ROLES.PATIENT).default(ROLES.PATIENT),
  phone: z.string().trim().optional(),
  dob: z.string().trim().optional(),
  gender: z.string().trim().optional(),
  bloodGroup: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid registered email.").toLowerCase(),
  password: z.string().min(1, "Password is required."),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters.").max(100).optional(),
  phone: z.string().trim().max(25).optional(),
  dob: z.string().trim().optional(),
  gender: z.string().trim().optional(),
  bloodGroup: z.string().trim().optional(),
  address: z.string().trim().max(250).optional(),
  emergencyContact: z.string().trim().max(100).optional(),
});
