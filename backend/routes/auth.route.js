import express from "express";
import { Login, Logout, Signup } from "../controller/auth.controller.js";

const authRoutes = express.Router();

authRoutes.get("/singup", Signup);
authRoutes.get("/login", Login);
authRoutes.get("/logout", Logout);

export default authRoutes;
