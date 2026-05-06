import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log("Connected to MOngodb");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
