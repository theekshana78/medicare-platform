import { Router } from "express";
import authRoutes from "./authRoutes.js";
import doctorRoutes from "./doctorRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import publicRoutes from "./publicRoutes.js";
import adminRoutes from "./adminRoutes.js";
import notificationRoutes from "./notificationRoutes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString(), platform: "MediCore API v1" });
});

router.use("/public", publicRoutes);
router.use("/auth", authRoutes);
router.use("/doctors", doctorRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/admin", adminRoutes);
router.use("/notifications", notificationRoutes);

export default router;
