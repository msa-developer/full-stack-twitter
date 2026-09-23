import express from "express";
import "dotenv/config";
import connectDB from "./db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`server started`);
  });
});
