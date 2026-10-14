import mongoose, { Types } from "mongoose";

interface IPost {
  text?: string;
  img?: string;
  user: Types.ObjectId;
  comments: { text: string; user: Types.ObjectId }[];
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    text: {
      type: String,
    },
    img: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const Post = mongoose.model<IPost>("post", postSchema);

export default Post;
