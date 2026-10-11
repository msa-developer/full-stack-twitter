import express, { type Express } from "express";
import connectDB from "./db.ts";
import "dotenv/config";
import cookieparser from "cookie-parser";
import authRouter from "./routes/user.route.ts";

const app: Express = express();

app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRouter);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("server is running");
  });
});
