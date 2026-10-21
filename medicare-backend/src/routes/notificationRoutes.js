import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { ROLES } from "../constants/roles.js";
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";

const router = Router();

// Retrieve notifications for authenticated user
router.get("/", authenticate, getNotifications);

// Broadcast notification (STRICTLY ADMIN ONLY)
router.post("/", authenticate, authorizeRoles(ROLES.ADMIN), createNotification);

// Mark notification as read
router.patch("/:id/read", authenticate, markAsRead);
router.post("/read-all", authenticate, markAllAsRead);

export default router;
