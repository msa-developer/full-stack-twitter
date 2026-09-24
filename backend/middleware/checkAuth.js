import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const checkAuthUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "unatuhorized" });

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) return res.status(401).json({ message: "invalid token" });

    const user = await User.findById(verifyToken.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "err in check auth" });
  }
};

export default checkAuthUser;
