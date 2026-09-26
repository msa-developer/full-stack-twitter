import User from "../models/user.model.js";

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in getUserDetails" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const randomUsers = await User.aggregate([
      {
        $match: {
          $ne: req.user._id,
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);

    const followingUsers = await User.findById(req.user._id).select(
      "following",
    );
    const filteredUsers = randomUsers.filter(
      (user) => !followingUsers.following.includes(user._id),
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));
    return res.status(200).json(suggestedUsers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in getSuggestedUsers" });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (currentUser._id === req.params.id.toString())
      return res
        .status(400)
        .json({ message: "cannot follow or unfollow yourself" });

    if (currentUser.following.includes(req.params.id)) {
      // unfollow
      await User.findByIdAndUpdate(req.user._id, {
        $pull: {
          following: req.params.id,
        },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $pull: {
          followers: req.user._id,
        },
      });
      return res.status(200).json({ message: "unfollowed User" });
    } else {
      // follow
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          following: req.params.id,
        },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $push: {
          followers: req.user._id,
        },
      });

      const newNotification = new Notification({
        from: req.user._id,
        to: req.params.id,
        type: "follow",
      });
      await newNotification.save();
      return res.status(200).json({ message: "followed" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in followUnfollowUser" });
  }
};
