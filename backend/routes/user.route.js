import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { getFollow, getUserProfile } from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.use(checkAuth);
userRouter.get("/profile/:userName", getUserProfile);
userRouter.post("follow/:id", getFollow);

export default userRouter;
