import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    type: {
      type: String,
      enum: ["like", "follow"],
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("notification", notificationSchema);

export default Notification;
