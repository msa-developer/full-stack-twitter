import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";

export const getAllPosts = async (_, res) => {
  try {
    const post = await Post.find().sort({ createdAt: -1 }).populate({
      path: "user",
      select: "-password",
    });
    return res.status(200).json(post);
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

export const likeUnlike = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id });
    if (!post) return res.status(404).json({ message: "post not found" });

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      // unlike
      await Post.updateOne(
        { _id: req.params.id },
        {
          $pull: {
            likes: req.user._id,
          },
        },
      );
      return res.status(200).json({ message: "user unliked your post" });
    } else {
      //like
      await Post.updateOne(
        { _id: req.params.id },
        {
          $push: {
            likes: req.user._id,
          },
        },
      );

      const notification = new Notification({
        from: req.user._id,
        to: req.params.id,
        type: "like",
      });
      await notification.save();

      return res.status(200).json(notification);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in likeUnlike func" });
  }
};

export const commentpost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "comment is empty" });

    const post = await Post.findById({ _id: req.params.id });
    if (!post) return res.status(404).json({ message: "post not found" });

    const comment = { user: req.user._id, text };
    post.comments.push(comment);

    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in commentpost" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id });
    if (!post) return res.status(404).json({ message: "post not found" });

    if (post.user.toString() !== req.user._id.toString())
      return res
        .status(400)
        .json({ message: "Unauthorized user cannot delete post" });

    if (post.image)
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0],
      );

    await Post.findByIdAndDelete({ _id: req.params.id });
    return res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "delete post" });
  }
};
