import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    text: {
      type: String,
    },
    image: {
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
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "user",
        },
        text: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const Post = mongoose.model("post", postSchema);

export default Post;
