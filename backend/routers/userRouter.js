import express from "express";
import { requireAuth } from "../guards/requireAuth.js";
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUser } from "../handlers/userHandler.js";

const router = express.Router();

router.get("/profile/:username", requireAuth, getUserProfile);
router.get("/suggested", requireAuth, getSuggestedUsers);
router.post("/follow/:id", requireAuth, followUnfollowUser);
router.post("/update", requireAuth, updateUser);

export default router;
