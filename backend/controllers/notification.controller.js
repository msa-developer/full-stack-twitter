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
