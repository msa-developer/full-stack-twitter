import express from "express";
import { requireAuth } from "../guards/requireAuth.js";
import {
	commentOnPost,
	createPost,
	deletePost,
	getAllPosts,
	getFollowingPosts,
	getLikedPosts,
	getUserPosts,
	likeUnlikePost,
} from "../handlers/postHandler.js";

const router = express.Router();

router.get("/all", requireAuth, getAllPosts);
router.get("/following", requireAuth, getFollowingPosts);
router.get("/likes/:id", requireAuth, getLikedPosts);
router.get("/user/:username", requireAuth, getUserPosts);
router.post("/create", requireAuth, createPost);
router.post("/like/:id", requireAuth, likeUnlikePost);
router.post("/comment/:id", requireAuth, commentOnPost);
router.delete("/:id", requireAuth, deletePost);

export default router;
