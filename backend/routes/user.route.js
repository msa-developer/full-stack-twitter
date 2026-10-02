import express from "express";
import checkAuthUser from "../middleware/checkAuthUser.js";
import {
  followUnfollow,
  suggestUsers,
  updateprofile,
  getProfile,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.use(checkAuthUser);

userRouter.get("/profile/:userName", getProfile);
userRouter.get("/suggestUsers", suggestUsers);
userRouter.post("/updateProfile", updateprofile);
userRouter.post("/follow/:id", followUnfollow);

export default userRouter;
