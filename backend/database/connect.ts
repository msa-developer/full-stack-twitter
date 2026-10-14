import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const url = process.env.MONGO_URI;
    if (!url) throw new Error("mongo db url not found");
    await mongoose.connect(url);
    console.log("connected to db");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
