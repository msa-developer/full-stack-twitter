import express from "express";
import {
  followUnfollow,
  getUserByUserName,
  getUserDetails,
  getUserProfile,
} from "../controller/user.controller.js";
import checkAuthUser from "../middleware/checkAuthUser.js";

const userRouter = express.Router();

userRouter.use(checkAuthUser);

userRouter.get("/profile", getUserProfile);
userRouter.post("/follow/:id", followUnfollow);
userRouter.get("/:id", getUserDetails);
userRouter.get("/username/:username", getUserByUserName);

export default userRouter;
