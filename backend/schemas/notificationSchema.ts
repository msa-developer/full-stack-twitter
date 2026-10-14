import mongoose, { Types } from "mongoose";

interface INotification {
  from: Types.ObjectId;
  to: Types.ObjectId;
  read: boolean;
  type: "follow" | "like";
}

const notificationSchema = new mongoose.Schema<INotification>(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["follow", "like"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model<INotification>(
  "notifications",
  notificationSchema,
);

export default Notification;
