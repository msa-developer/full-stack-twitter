import express, { type Express } from "express";
import connectDB from "./db.ts";
import "dotenv/config";

const app: Express = express();

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("server is running");
  });
});
