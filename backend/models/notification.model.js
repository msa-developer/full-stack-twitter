import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    from: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    to: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    type: {
      type: String,
      enum: ["follow", "reply", "comment", "like"],
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("notification", notificationSchema);

export default Notification;
