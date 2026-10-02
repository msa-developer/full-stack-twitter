import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const checkAuthUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Unauthorized User" });

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) return res.status(401).json({ message: "invalid token" });

    const user = await User.findById(verifyToken.userId);
    if (!user) return res.status(404).json({ message: "user not found" });

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erorr in checkAuthUser func" });
  }
};

export default checkAuthUser;
