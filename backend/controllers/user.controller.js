import User from "../models/user.model.js";
import Notification from "../models/notificatoin.model.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

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
    const suggestedUsers = await User.aggregate([
      {
        $match: {
          _id: {
            $nin: [req.user._id, ...req.user.following],
          },
        },
      },
      {
        $sample: {
          size: 4,
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);
    return res.status(200).json(suggestedUsers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in getSuggestedUsers" });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (currentUser._id.toString() === req.params.id.toString())
      return res
        .status(400)
        .json({ message: "cannot follow or unfollow yourself" });

    if (currentUser.following.includes(req.params.id.toString())) {
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

export const updateUserProfile = async (req, res) => {
  const { fullName, email, userName, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if ((!newPassword && currentPassword) || (!currentPassword && newPassword))
      return res
        .status(400)
        .json({ message: "Please provide both current and new password" });

    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ message: "current password is incorrect" });

      if (password.length < 6)
        return res
          .status(400)
          .json({ message: "password should be min 6 characters" });

      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(newPassword, salt);

      if (profileImg) {
        if (user.profileImg) {
          await cloudinary.uploader.destroy(
            user.profileImg.split("/").pop().split(".")[0],
          );
        }

        const res = await cloudinary.uploader.upload(profileImg);
        profileImg = res.secure_url;
      }

      if (coverImg) {
        if (user.coverImg)
          await cloudinary.uploader.destroy(
            user.coverImg.split("/").pop().split(".")[0],
          );

        const res = await cloudinary.uploader.upload(coverImg);
        coverImg = res.secure_url;
      }

      user.fullName = fullName || user.fullName;
      user.userName = userName || user.userName;
      user.email = email || user.email;
      user.bio = bio || user.bio;
      user.link = link || user.link;
      user.profileImg = profileImg || user.profileImg;
      user.coverImg = coverImg || user.coverImg;

      user = await user.save();
      user.password = null;
      return res.status(200).json(user);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error in updateUserProfile" });
  }
};
