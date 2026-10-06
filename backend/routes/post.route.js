import {
  // commentpost,
  createPost,
  getAllPosts,
  deletePost,
  // likeUnlike,
} from "../controllers/post.controller.js";
import checkAuthUser from "../middleware/checkAuthUser.js";
import express from "express";

const postRouter = express.Router();

postRouter.use(checkAuthUser);

postRouter.get("/allposts", getAllPosts);
postRouter.post("/create", createPost);
// postRouter.post("/like/:id", likeUnlike);
// postRouter.post("/comment/:id", commentpost);
postRouter.delete("/:id", deletePost);

export default postRouter;
