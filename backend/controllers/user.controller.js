import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";

export const suggestUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
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
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in suggestUsers" });
  }
};

export const followUnfollow = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id.toString())
      return res
        .status(400)
        .json({ message: "cannot follow or unfollow yourself" });

    //  map method
    const isFollowing = req.user.following
      .map((id) => id.toString())
      .includes(req.params.id.toString());

    // some method
    // const isFollowing = req.user.following.some(
    //   (id) => id.toString() === req.params.id.toString(),
    // );

    if (isFollowing) {
      // unfollow
      await User.updateOne(
        { _id: req.user._id },
        {
          $pull: {
            following: req.params.id,
          },
        },
      );

      await User.updateOne(
        { _id: req.params.id },
        {
          $pull: {
            followers: req.user._id,
          },
        },
      );
      res.status(200).json({ message: "Unfollowed" });
    } else {
      // follow
      await User.updateOne(
        {
          _id: req.user._id,
        },
        {
          $push: {
            following: req.params.id,
          },
        },
      );
      await User.updateOne(
        { _id: req.params.id },
        {
          $push: {
            followers: req.user._id,
          },
        },
      );

      const newNotification = new Notification({
        from: req.user._id.toString(),
        to: req.params.id.toString(),
        type: "follow",
      });
      res.status(200).json(newNotification);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erorr in followUnfollow" });
  }
};

export const updateprofile = async (req, res) => {
  const {
    email,
    fullName,
    currentPassword,
    newPassword,
    profilePic,
    coverbg,
    userName,
  } = req.body;

  try {
    let user = await User.findById(req.user._id);
    let profileUrl = null;
    let coverBgUrl = null;

    if (profilePic) {
      if (user.profilePic)
        await cloudinary.uploader
          .upload()
          .destroy(user.profilePic.split("/").pop().split(".")[0]);

      const uploadProfile = await cloudinary.uploader.upload(profilePic);
      profileUrl = uploadProfile.secure_url;
    }

    if (coverbg) {
      if (user.coverbg)
        await cloudinary.uploader
          .upload()
          .destroy(user.coverbg.split("/").pop().split(".")[0]);

      const uploadCoverBg = await cloudinary.uploader.upload(coverbg);
      coverBgUrl = uploadCoverBg.secure_url;
    }

    if (newPassword && currentPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "incorrect passwords" });

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);
    }

    user.profileUrl = profileUrl || user.profileUrl;
    user.coverbg = coverBgUrl || user.coverBgUrl;
    user.userName = userName || user.userName;
    user.email = email || user.email;
    user.fullName = fullName || user.fullName;
    user.password = hashPassword || user.password;

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erorr in updateProfile" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.params.userName }).select(
      "-password",
    );
    if (!user) return res.status(404).json({ message: "user not found" });
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erorr in getProfile function" });
  }
};
