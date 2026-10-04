import Post from "../models/post.model.js";

export const createPost = async (req, res) => {
  const { text, image } = req.body;
  try {
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in createPost func" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userPosts = await User.findById({ _id: req.params.id }).posts;
    return res.status(200).json(userPosts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in createPost func" });
  }
};
