import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";

export const getAllPosts = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in getAllPosts" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;
    let img_url = null;

    if (!text && !image)
      return res
        .status(400)
        .json({ message: "post must contains a text or an image" });

    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      img_url = upload.secure_url;
    }

    const newPost = new Post({
      user: req.user._id,
      text,
      image: img_url,
    });
    await newPost.save();

    return res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ messsage: "error in createPost" });
  }
};
