import mongoose, { Types } from "mongoose";

export interface IUser {
  username: string;
  fullName: string;
  password: string;
  email: string;
  profilePic?: string;
  coverBg?: string;
  bio?: string;
  link?: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  likedPosts: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    profilePic: {
      type: String,
    },
    coverBg: {
      type: String,
    },
    bio: {
      type: String,
    },
    link: {
      type: String,
    },
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("user", userSchema);

export default User;
