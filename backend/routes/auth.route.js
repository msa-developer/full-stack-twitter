import express from "express";
import { Signup, Login, Logout } from "../controller/auth.controller.js";
import checkAuth from "../middleware/checkAuth.js";

const authRouter = express.Router();

authRouter.get("/authUser", checkAuth, (req, res) =>
  res.status(200).json(req.user),
);
authRouter.post("/signup", Signup);
authRouter.post("/login", Login);
authRouter.post("/logout", Logout);

export default authRouter;
