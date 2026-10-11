import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongUrl = process.env.MONGO_URI;
    if (!mongUrl) {
      console.error("error in string ");
      process.exit(1);
    }
    await mongoose.connect(mongUrl);
    console.log("connected to db");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
