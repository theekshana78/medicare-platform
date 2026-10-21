import { z } from "zod";
import { db } from "../config/db.js";
import { successResponse, errorResponse } from "../utils/response.js";

const notificationSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(120),
  message: z.string().trim().min(5, "Message must be at least 5 characters.").max(500),
  type: z.enum(["info", "warning", "alert", "success"]).default("info"),
  target: z.enum(["all_patients", "all_doctors", "all"]).default("all_patients"),
});

/**
 * Retrieve notifications for current authenticated user
 */
export const getNotifications = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    const snapshot = await db.collection("notifications").get();
    const list = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      // Filter based on target role
      let isTargeted = false;
      if (userRole === "admin") {
        isTargeted = true;
      } else if (userRole === "doctor") {
        isTargeted = data.target === "all" || data.target === "all_doctors";
      } else {
        // patient
        isTargeted = data.target === "all" || data.target === "all_patients";
      }

      if (isTargeted) {
        const readBy = Array.isArray(data.readBy) ? data.readBy : [];
        list.push({
          id: doc.id,
          title: data.title,
          message: data.message,
          type: data.type || "info",
          target: data.target,
          createdAt: data.createdAt,
          createdBy: data.createdBy || "Hospital Administration",
          isRead: readBy.includes(userId),
        });
      }
    });

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return successResponse(res, 200, "Notifications retrieved successfully.", {
      notifications: list,
      unreadCount: list.filter((n) => !n.isRead).length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create clinical broadcast notification (ADMIN ONLY)
 */
export const createNotification = async (req, res, next) => {
  try {
    const validated = notificationSchema.parse(req.body);

    const newNotification = {
      ...validated,
      createdAt: new Date().toISOString(),
      createdBy: req.user.name || "Hospital Administration",
      readBy: [],
    };

    const docRef = await db.collection("notifications").add(newNotification);

    return successResponse(res, 201, "Clinical announcement broadcasted successfully.", {
      notification: { ...newNotification, id: docRef.id },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Mark a single notification as read by current user
 */
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const docRef = db.collection("notifications").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return errorResponse(res, 404, "Notification not found.");
    }

    const currentReadBy = Array.isArray(doc.data().readBy) ? doc.data().readBy : [];
    if (!currentReadBy.includes(userId)) {
      currentReadBy.push(userId);
      await docRef.update({ readBy: currentReadBy });
    }

    return successResponse(res, 200, "Notification marked as read.");
  } catch (err) {
    next(err);
  }
};

/**
 * Mark all relevant notifications as read
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const snapshot = await db.collection("notifications").get();

    const batch = db.batch ? db.batch() : null;
    const promises = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const readBy = Array.isArray(data.readBy) ? data.readBy : [];
      if (!readBy.includes(userId)) {
        readBy.push(userId);
        if (batch) {
          batch.update(doc.ref, { readBy });
        } else {
          promises.push(doc.ref.update({ readBy }));
        }
      }
    });

    if (batch) await batch.commit();
    else if (promises.length > 0) await Promise.all(promises);

    return successResponse(res, 200, "All notifications marked as read.");
  } catch (err) {
    next(err);
  }
};
