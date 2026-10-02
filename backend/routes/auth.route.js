import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import checkAuthUser from "../middleware/checkAuthUser.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/checkAuthUser", checkAuthUser, (req, res) =>
  res.status(200).json(req.user),
);

export default authRouter;
