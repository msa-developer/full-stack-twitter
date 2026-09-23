import generateTokenAndSetCookies from "../lib/auth/generateTokenAndSetCookies.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const EmailIsValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isPasswordTooShort = (password) => password.length < 6;

export const signup = async (req, res) => {
  const { email, password, userName } = req.body;
  try {
    if (!email || !password || !userName)
      return res.status(400).json({ message: "fill all details" });

    if (!EmailIsValid(email))
      return res.status(400).json({ message: "Invalid email" });

    if (isPasswordTooShort(password))
      return res
        .status(400)
        .json({ message: "password should be min 6 characters" });

    const exists = await User.findOne({
      $or: [{ email }, { userName }],
    }).select("-password");

    if (exists) {
      if (exists.userName === userName)
        return res.status(400).json({ message: "username is already taken" });
      if (exists.email === email)
        return res.status(400).json({ message: "email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      userName,
      password: hashPassword,
    });

    await newUser.save();
    generateTokenAndSetCookies(newUser._id, res);

    const userObj = newUser.toObject();
    delete userObj.password;
    return res.status(201).json(userObj);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in signup func" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "fill all details" });

    if (!EmailIsValid(email))
      return res.status(400).json({ message: "invalid email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "user not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "invalid credentails" });

    generateTokenAndSetCookies(user._id, res);

    const userObj = user.toObject();
    delete userObj.password;
    return res.status(200).json(userObj);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "erorr in login function" });
  }
};

export const logout = async (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 0,
  });
  return res.status(200).json({ message: "User logged out" });
};
