import express from "express";
import {
  followUnfollow,
  getSuggestedUsers,
  getUserByUserName,
  getUserDetails,
  getUserProfile,
} from "../controller/user.controller.js";
import checkAuthUser from "../middleware/checkAuthUser.js";

const userRouter = express.Router();

userRouter.use(checkAuthUser);

userRouter.get("/profile", getUserProfile);
userRouter.get("/suggestedUsers", getSuggestedUsers);
userRouter.post("/follow/:id", followUnfollow);
userRouter.get("/user/:id", getUserDetails);
userRouter.get("/username/:username", getUserByUserName);

export default userRouter;
