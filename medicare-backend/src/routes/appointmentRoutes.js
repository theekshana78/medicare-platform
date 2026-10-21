import { Router } from "express";
import {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
} from "../controllers/appointmentController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

// Enforce authentication on all appointment operations
router.use(authenticate);

router.post("/", createAppointment);
router.get("/", getMyAppointments);
router.get("/:id", getAppointmentById);
router.put("/:id/status", updateAppointmentStatus);
router.put("/:id/cancel", cancelAppointment);

export default router;
