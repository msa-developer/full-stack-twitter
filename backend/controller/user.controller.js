import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "user not found" });
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in getUserProfile" });
  }
};

export const followUnfollow = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(req.params.id);

    if (!targetUser)
      return res.status(404).json({ message: "target user not found" });

    if (currentUser._id === targetUser._id)
      return res
        .status(400)
        .json({ message: "cannot follow or unfollow yourself" });

    const isFollowing = currentUser.following
      .map((id) => id.toString())
      .includes(targetUser._id.toString());

    if (isFollowing) {
      // un follow
      await User.updateOne(
        { _id: currentUser._id },
        {
          $pull: {
            following: targetUser._id,
          },
        },
      );
      await User.updateOne(
        { _id: targetUser._id },
        {
          $pull: {
            followers: currentUser._id,
          },
        },
      );

      return res.status(200).json({ message: "user unfollowed" });
    } else {
      // follow
      await User.updateOne(
        { _id: currentUser._id },
        {
          $push: {
            following: targetUser._id,
          },
        },
      );
      await User.updateOne(
        { _id: targetUser._id },
        {
          $push: {
            followers: currentUser._id,
          },
        },
      );

      const notify = new Notification({
        from: currentUser._id,
        to: targetUser._id,
        type: "follow",
      });

      await notify.save();
      return res.status(200).json(notify);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in followUnfollow" });
  }
};

export const updateprofile = async (req, res) => {
  const { fullname, currentPassowrd, newPassword, email, username } = req.body;
  let { profilePic, coverBg } = req.body;
  try {
    const user = await User.findById(req.user._id);

    if (profilePic) {
      if (user.profilePic)
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0],
        );

      const uploaded = await cloudinary.uploader.upload(profilePic);
      profilePic = uploaded.secure_url;
    }

    if (coverBg) {
      if (user.coverBg)
        await cloudinary.uploader.destroy(
          user.coverBg.split("/").pop().split(".")[0],
        );
      const uploaded = await cloudinary.uploader.upload(coverBg);
      coverBg = uploaded.secure_url;
    }

    const comparePass = await bcrypt.compare(currentPassowrd, newPassword);
    if (!comparePass)
      return res.status(400).json({ message: "currentPassowrd is incorrect" });

    if (email) {
      if (await User.findOne({ email }))
        return res.status(400).json({ message: "email is already taken" });
      user.email = email || user.email;
    }

    if (username) {
      if (await User.findOne({ username }))
        return res.status(400).json({ message: "username is already taken" });
      user.username = username || username;
    }

    user.password = newPassword || user.password;
    user.fullname = fullname || user.fullname;
    user.profilePic = profilePic || user.profilePic;
    user.coverBg = coverBg || user.coverBg;

    return res.status(200).json({ message: "user profile updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error updateprofile" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "user not found" });
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "erorr in getUserDetails" });
  }
};

export const getUserByUserName = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "user not found" });
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in getUserByUserName" });
  }
};
