import express from "express";
import {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
  updateNotification,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/Notifications.controller.js";
import authMiddleware from "../middlewares/auth.middlewares.js";

export const notificationRouter = express.Router();

notificationRouter.post("/", authMiddleware, createNotification);
notificationRouter.get("/", authMiddleware, getNotifications);
notificationRouter.get("/:id", authMiddleware, getNotificationById);
notificationRouter.patch("/:id/read", authMiddleware, markAsRead);
notificationRouter.patch("/:id", authMiddleware, updateNotification);
notificationRouter.delete("/:id", authMiddleware, deleteNotification);
notificationRouter.delete("/", authMiddleware, clearAllNotifications);
