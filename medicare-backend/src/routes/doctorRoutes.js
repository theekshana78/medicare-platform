import { Router } from "express";
import {
  getDoctors,
  getDoctorById,
  getDoctorSlots,
  verifyDoctor,
} from "../controllers/doctorController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.get("/:id/slots", getDoctorSlots);
router.put("/:id/verify", authenticate, authorizeRoles(ROLES.ADMIN), verifyDoctor);
router.patch("/:id/verify", authenticate, authorizeRoles(ROLES.ADMIN), verifyDoctor);

export default router;
