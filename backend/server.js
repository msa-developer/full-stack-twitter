import express from "express";
import "dotenv/config";
import connectDB from "./db.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import postRouter from "./routes/post.route.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("server is running");
  });
});
