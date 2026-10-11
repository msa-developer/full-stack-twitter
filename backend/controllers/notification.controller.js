import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    await Notification.updateMany({ to: req.user._id }, { read: true });

    return res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications function", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const notifications = await Notification.deleteMany({ to: req.user._id });
    return res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in deleteNotifications function", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotifcationById = async (req, res) => {
  try {
    if (req.params.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ message: "unauthorized user cannot delete notification" });

    const notification = await Notification.findByIdAndDelete(req.params.id);

    return res.status(200).json(notification);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "error in deleteNotifcationById func" });
  }
};
