import express from "express";
import { createPost, getUserPosts } from "../controllers/post.controller.js";
import checkAuthUser from "../middleware/checkAuthUser.js";

const postRouter = express.Router();

postRouter.use(checkAuthUser);

postRouter.get("/post/:id", getUserPosts);
postRouter.post("/create", createPost);

export default postRouter;
