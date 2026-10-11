import express, { type Express } from "express";
import connectDB from "./db.ts";
import "dotenv/config";
import authRouter from "./routes/user.route.ts";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRouter);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("server is running");
  });
});
