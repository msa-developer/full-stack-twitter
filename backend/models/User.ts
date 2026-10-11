import mongoose, { Types } from "mongoose";

interface IUser {
  username: string;
  fullname: string;
  email: string;
  password: string;
  profilePic: string;
  coverbg: string;
  likedPosts: Types.ObjectId[];
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    coverbg: {
      type: String,
    },
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("user", userSchema);

export default User;
