import {
  commentpost,
  createPost,
  deletePost,
  likeUnlike,
} from "../controllers/post.controller.js";
import checkAuthUser from "../middleware/checkAuthUser.js";
import express from "express";

const postRouter = express.Router();

postRouter.use(checkAuthUser);

postRouter.post("/create", createPost);
postRouter.post("/like/:id", likeUnlike);
postRouter.get("/comment/:id", commentpost);
postRouter.get("/", deletePost);

export default postRouter;
