import express from "express";
import { Signup } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.get("/signup", Signup);

export default authRouter;
