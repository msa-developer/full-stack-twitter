import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const checkAuthUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ message: "unauthorized user" });

    const isTokenValid = jwt.verify(token, process.env.JWT_SECRET);
    if (!isTokenValid)
      return res.status(401).json({ message: "token expired" });

    const userId = isTokenValid.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "user not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in checkAuthUser function" });
  }
};

export default checkAuthUser;
