import {
  commentpost,
  createPost,
  getAllPosts,
  deletePost,
  likeUnlike,
  likedPosts,
  getFollowingUsers,
} from "../controllers/post.controller.js";
import checkAuthUser from "../middleware/checkAuthUser.js";
import express from "express";

const postRouter = express.Router();

postRouter.use(checkAuthUser);

postRouter.get("/allposts", getAllPosts);
postRouter.get("/following", getFollowingUsers);
postRouter.get("/likedposts/:id", likedPosts);
postRouter.post("/create", createPost);
postRouter.post("/like/:id", likeUnlike);
postRouter.post("/comment/:id", commentpost);
postRouter.delete("/:id", deletePost);

export default postRouter;
