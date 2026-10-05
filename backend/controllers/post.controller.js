import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { image } = req.body;

    const user = await User.findById({ _id: req.user._id }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!text && !image)
      return res
        .status(400)
        .json({ message: "post must contain and image or text" });

    if (image) {
      const uploadImg = await cloudinary.uploader.upload(image);
      const imgSecureUrl = uploadImg.secure_url;
      let image = imgSecureUrl;
    }

    const newPost = new Post({
      user: user._id,
      text,
      image,
    });

    await newPost.save();
    return res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erorr in createPost" });
  }
};

export const likeUnlike = async (req, res) => {};
export const commentpost = async (req, res) => {};
export const deletePost = async (req, res) => {};
