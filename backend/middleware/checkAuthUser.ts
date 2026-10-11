import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.ts";

const checkAuthUser = async (
  req: Request & { user: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "unauthorized user" });

    const secret = process.env.JWT_SECRET;
    if (!secret)
      return res.status(400).json({ message: "secret key not found" });

    const decode = jwt.verify(token, secret) as { userId: string };
    if (!decode) return res.status(400).json({ message: "not verified token" });

    const user = await User.findById(decode.userId);
    if (!user) return res.status(404).json({ message: "user not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in checkAuthUser " });
  }
};

export default checkAuthUser;
