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

export const likeUnlike = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params.id;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "post not found" });

    const userLikedThisPost = post.likes.includes(userId);

    if (userLikedThisPost) {
      // unlike
      await Post.updateOne(
        { _id: postId },
        {
          $pull: {
            likes: userId,
          },
        },
      );
      return res.status(200).json({ message: "User disliked your post" });
    } else {
      //like
      post.likes.push(userId);

      const newNotification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await newNotification.save();

      return res.status(200).json(newNotification);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in likeUnlike" });
  }
};

export const commentpost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "post not found" });
    if (!text)
      return res.status(400).json({ message: "text field is required" });

    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    return res.status(201).json(comment);
  } catch (err) {
    console.error(err);
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "post not found" });

    const user = await User.findById(post.user);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0],
      );
    }

    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "post deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "post deleted" });
  }
};

export const getAllPosts = async (_, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate({
      path: "user",
      select: "-password",
    });

    if (posts.length === 0) return res.status(400).json([]);

    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error in getAllPosts" });
  }
};
