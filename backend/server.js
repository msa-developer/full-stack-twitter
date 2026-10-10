import express from "express";
import "dotenv/config";
import connectDB from "./db.js";
import router from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", router);
app.use("/api/user", userRouter);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("server is running");
  });
});
