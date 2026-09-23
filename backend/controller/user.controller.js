import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  const { userName } = req.params;
  try {
    const user = await User.findOne({ userName }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error getUserProfile" });
  }
};

export const getFollow = async (req, res) => {
  try {
    const { id } = req.params;

    const currentUser = await User.findById(req.user._id).select("-password");
    const targetUser = await User.findById(id).select("-password");

    const currentUserIsFollowing = currentUser.followers.includes(id);

    if (currentUserIsFollowing) {
      //unfollow user
      // targetUser -> followers -1
      // currentUser -> following -1 $pull
      await User.findByIdAndUpdate(targetUser._id, {
        $pull: { folowers: currentUser._id },
      });
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: currentUser._id },
      });
    } else {
      //follow user
      //currentUser -> followers +1 $push
      //targetUser  -> following +1 $push
      await User.findByIdAndUpdate(currentUser._id, {
        $push: { followers: targetUser._id },
      });
      await User.findByIdAndUpdate(targetUser._id, {
        $push: { following: currentUser._id },
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in getFollow" });
  }
};
