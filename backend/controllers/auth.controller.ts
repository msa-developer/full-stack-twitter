import type { Response, Request } from "express";
import bcrypt from "bcrypt";
import generateTokenAndSetCookies from "../lib/generateTokenAndSetCookies.ts";
import User from "../models/User.ts";

export const signup = (req: Request, res: Response) => {};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "invalid email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "user not found" });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.status(400).json({ message: "invalid credentails" });

    generateTokenAndSetCookies(user._id, res);
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "eror in login" });
  }
};

export const logout = (req: Request, res: Response) => {};
