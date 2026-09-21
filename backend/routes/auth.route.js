import express from "express";
import {
  Signup,
  Login,
  Logout,
  getAuthUser,
} from "../controller/auth.controller.js";
import checkAuth from "../middleware/checkAuth.js";

const authRouter = express.Router();

authRouter.post("/authUser", checkAuth, getAuthUser);
authRouter.post("/signup", Signup);
authRouter.post("/login", Login);
authRouter.post("/logout", Logout);

export default authRouter;
