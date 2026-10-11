import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import type { Response } from "express";

const generateTokenAndSetCookies = (userId: Types.ObjectId, res: Response) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret)
      return res
        .status(400)
        .json({ message: "secret is missing from .env file" });

    const token = jwt.sign({ userId }, secret, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      httpOnly: true,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "errro in generateTokenAndSetCookies" });
  }
};

export default generateTokenAndSetCookies;
