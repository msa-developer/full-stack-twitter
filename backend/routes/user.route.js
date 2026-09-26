import express from "express";
import checkAuthUser from "../middleware/checkAuth.js";
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserDetails,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.use(checkAuthUser);

userRouter.get("/profile", getUserDetails);
userRouter.get("/suggestedUsers", getSuggestedUsers);
userRouter.post("/followers/:id", followUnfollowUser);

export default userRouter;
