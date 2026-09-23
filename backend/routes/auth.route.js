import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
import checkAuthUser from "../middleware/checkAuth.js";

const authRouter = express.Router();

authRouter.get("/checkAuth", checkAuthUser, (req, res) =>
  res.status(200).json(req.user),
);
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;
