import express from "express";
import { requireAuth } from "../guards/requireAuth.js";
import {
  deleteNotifcationById,
  deleteNotifications,
  getNotifications,
} from "../handlers/notificationHandler.js";

const router = express.Router();

router.get("/", requireAuth, getNotifications);
router.delete("/", requireAuth, deleteNotifications);
router.delete("/:id", requireAuth, deleteNotifcationById);

export default router;
