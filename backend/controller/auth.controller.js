import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const Signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid Email" });
    }
    const existUser = await User.findOne({ username });

    if (existUser) res.status(400).json({ message: "User already exists" });

    existEmail = await User.findOne({ existEmail });
    if (existEmail) res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashPass,
      username,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json(newUser);
    } else {
      res.staus(400).json({ message: "Something went wrong" });
    }
  } catch (err) {
    console.log(erro);
    res.status(500).json({ message: "Error in Signup function" });
  }
};

export const Login = async (req, res) => {};
export const Logout = async (req, res) => {};
