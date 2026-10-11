import express, { type Router, type Request, type Response } from "express";
import { login, logout, signup } from "../controllers/auth.controller.ts";
import checkAuthUser from "../middleware/checkAuthUser.ts";

const authRouter: Router = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/check", checkAuthUser, (req: Request, res: Response) =>
  res.status(200).json((req as Request & { user?: any }).user),
);

export default authRouter;
