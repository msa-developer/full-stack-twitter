import express from "express";
import { getMe, login, logout, signup } from "../handlers/authHandler.js";
import { requireAuth } from "../guards/requireAuth.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
