import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import type { Response } from "express";

const generateTokenAndSetCookies = (userId: Types.ObjectId, res: Response) => {
  const secret = process.env.JWT_SECRET;
  if (!secret)
    return res.status(400).json({ message: "secret is missing in jwt" });

  const token = jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
  });
};

export default generateTokenAndSetCookies;
