import express from "express";
import checkAuthUser from "../middleware/checkAuth.js";
import {
  commentPost,
  createPost,
  deletePost,
  likeUnLikePost,
} from "../controllers/post.controller.js";

const postRouter = express.Router();

postRouter.use(checkAuthUser);

postRouter.post("/create", createPost);
postRouter.post("/like/:id", likeUnLikePost);
postRouter.post("/comment/:id", commentPost);
postRouter.delete("/", deletePost);

export default postRouter;
