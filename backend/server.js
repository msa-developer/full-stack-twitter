import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import connectDB from "./db/connection.js";
dotenv.config();

const app = express();

app.use("/api/auth", authRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Running on port");
  });
});
