import generateTokenAndSetCookies from "../lib/auth/generateTokenAndSetCookies.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const checkValid = (email, password) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 6)
    return res
      .status(400)
      .json({ message: "password length should be min 6 characters" });
};

export const Signup = async (req, res) => {
  const { fullName, email, password, userName } = req.body;
  try {
    if (!email || !password || !userName)
      return res.status(400).json({ message: "Fill all details" });

    checkValid(email, password);

    const userNameExists = await User.findOne({ userName });
    if (userNameExists)
      return res.status(400).json({ message: "user name is already taken" });

    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res.status(400).json({ message: "Email Already In Use" });

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashPass,
      userName,
      fullName,
    });
    await newUser.save();

    generateTokenAndSetCookies(newUser._id, res);
    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error in Signup function" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "Fill all details" });

    checkValid(email, password);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const passwordCorrect = await bcrypt.compare(
      password,
      user?.password || "",
    );

    if (!passwordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    generateTokenAndSetCookies(user._id, res);
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error in login" });
  }
};

export const Logout = async (_, res) => {
  try {
    res.cookies("jwt", "", {
      maxAge: 0,
    });
    return res.status(200).json({ message: "loged out" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Loged out successfully" });
  }
};

export const getAuthUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error getAuthUser" });
  }
};
