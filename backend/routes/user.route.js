import express from "express";
import checkAuthUser from "../middleware/checkAuth.js";
import {
  followUnfollowUser,
  getUserDetails,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.use(checkAuthUser);

userRouter.get("/profile", getUserDetails);
userRouter.post("/followers/:id", followUnfollowUser);

export default userRouter;
