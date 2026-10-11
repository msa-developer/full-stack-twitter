import type { Response, Request } from "express";
import bcrypt from "bcrypt";
import generateTokenAndSetCookies from "../lib/generateTokenAndSetCookies.ts";
import User from "../models/User.ts";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, fullname, email, password } = req.body;

    if (!username || !fullname || !email || !password)
      return res.status(400).json({ message: "fill all details" });

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "invalid email" });

    const usernameExists = await User.findOne({ username });
    if (usernameExists)
      return res.status(400).json({ message: "username is already taken" });

    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res.status(400).json({ message: "email already in use" });

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      fullname,
      password: hashPass,
    });

    generateTokenAndSetCookies(user._id, res);
    await user.save();
    return res.status(201).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in signup" });
  }
};

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

export const logout = (_: Request, res: Response) => {
  res.cookie("jwt", "", {
    maxAge: 0,
  });
  return res.status(200).json({ message: "user logged out " });
};
