import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erorr in getUserDetails" });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const authUser = await User.findById(req.user._id);

    if (authUser.following.includes(req.params.id)) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $pull: { followers: req.user._id },
      });

      return res.status(200).json({ message: "User unFolowed" });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $push: { followers: req.user._id },
      });

      const newNotification = new Notification({
        from: req.user._id,
        to: req.params.id,
        type: "follow",
      });
      await newNotification.save();

      return res.status(200).json({ message: "User followed" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erorr in followUnfollowUser" });
  }
};
