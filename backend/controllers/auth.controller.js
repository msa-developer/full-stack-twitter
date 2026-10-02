import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const checkValidEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const generateTokenAndSetCookies = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
  });
};

export const signup = async (req, res) => {
  const { fullName, userName, password, email } = req.body;
  try {
    if (!fullName || !userName || !password || !email)
      return res.status(400).json({ message: "Please fill all details" });

    if (password.length < 6)
      return res.status(400).json({ message: "password is too short" });

    if (!checkValidEmail(email))
      return res.status(400).json({ message: "invalid email" });

    if (await User.findOne({ userName }))
      return res.status(400).json({ message: "username is already taken" });
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "email is already in use" });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      userName,
      fullName,
      password: hashPassword,
    });

    generateTokenAndSetCookies(newUser._id, res);
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erorr in signup function" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "fill all details" });

    if (!checkValidEmail(email))
      return res.status(400).json({ message: "Invalid Email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "user not found" });

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword)
      return res.status(400).json({ message: "invalid credentails" });

    generateTokenAndSetCookies(user._id, res);
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error in login" });
  }
};

export const logout = async (_, res) => {
  res.cookie("jwt", "", {
    maxAge: 0,
  });
  return res.status(200).json({ message: "logout sucessfully" });
};
