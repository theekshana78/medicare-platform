import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../constants/roles.js";
import { getTelemetryStats, downloadAppLog } from "../controllers/adminController.js";

const router = Router();

// Strict Admin-Only Authorization Barrier (OWASP A01 & A07)
router.use(authenticate, authorizeRoles(ROLES.ADMIN));

router.get("/telemetry", getTelemetryStats);
router.get("/logs/download", downloadAppLog);

export default router;
