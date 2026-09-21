import jwt from "jsonwebtoken";

const generateTokenAndSetCookies = (req, res) => {
  const token = jwt.sign("jwt", process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });
};

export default generateTokenAndSetCookies;
