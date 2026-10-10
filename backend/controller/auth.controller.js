import generateTokenAndSetCookies from "../lib/generateTokenAndSetCookies.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password)
      return res.status(400).json({ message: "fill all details" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "invalid email" });

    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res.status(400).json({ message: "email already in use" });

    const usernameExists = await User.findOne({ username });
    if (usernameExists)
      return res.status(400).json({ message: "username already taken" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "password should be min 6 characters" });

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      fullname,
      email,
      password: hashPass,
    });
    await newUser.save();

    generateTokenAndSetCookies(newUser._id, res);

    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in signup" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "invalid email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "user not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "invalid password" });

    generateTokenAndSetCookies(user._id, res);
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error login" });
  }
};

export const logout = async (_, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    return res.status(200).json({ message: "user logged out" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in logout" });
  }
};
