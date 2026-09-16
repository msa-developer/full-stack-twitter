import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv/config";
import connectDB from "./db/connection.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Running on port");
  });
});
