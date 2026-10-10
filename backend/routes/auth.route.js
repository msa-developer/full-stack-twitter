import express from "express";
import { login, logout, signup } from "../controller/auth.controller.js";
import checkAuthUser from "../middleware/checkAuthUser.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", checkAuthUser, (req, res) =>
  res.status(200).json(req.user),
);

export default router;
