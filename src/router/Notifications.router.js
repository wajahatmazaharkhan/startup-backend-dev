import express from "express";
import {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
  updateNotification,
  deleteNotification,
  clearAllNotifications,
  sendNotificationToAllUsers,
  sendNotificationToAllCounsellors,
} from "../controllers/Notifications.controller.js";
import authMiddleware, {
  adminVerify,
} from "../middlewares/auth.middlewares.js";

export const notificationRouter = express.Router();

notificationRouter.post("/", authMiddleware, createNotification);
notificationRouter.get("/", authMiddleware, getNotifications);
notificationRouter.get("/:id", authMiddleware, getNotificationById);
notificationRouter.patch("/:id/read", authMiddleware, markAsRead);
notificationRouter.patch("/:id", authMiddleware, updateNotification);
notificationRouter.delete("/:id", authMiddleware, deleteNotification);
notificationRouter.delete("/", authMiddleware, clearAllNotifications);

// admins only
notificationRouter.post(
  "/broadcast/users",
  adminVerify,
  sendNotificationToAllUsers
);

notificationRouter.post(
  "/broadcast/counsellors",
  adminVerify,
  sendNotificationToAllCounsellors
);
