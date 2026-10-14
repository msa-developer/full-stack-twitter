import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { type IUser } from "../schemas/userSchema.ts";

interface AuthReq extends Request {
  cookies: { jwt?: string };
  user?: IUser;
}

export const requireAuth = async (
  req: AuthReq,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      res.status(404).json({ message: "token not found" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("secret not present");

    const decode = jwt.verify(token, secret) as {
      userId?: string;
    };

    const user = await User.findById(decode.userId);
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }

    req.user = user<IUser>;

    next();
  } catch (err) {
    console.error(err as Error);
    return res.status(500).json({ message: "error in requireAuth" });
  }
};
