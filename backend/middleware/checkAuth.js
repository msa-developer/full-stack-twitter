import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(404).json({ message: "Token not found" });
    next();
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Error in checkAuth func" });
  }
};

export default checkAuth;
