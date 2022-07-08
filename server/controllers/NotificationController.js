const Notification = require("../models/NotifcationModel");
const asyncHandler = require("express-async-handler");
exports.createNewNotification = asyncHandler(async (req, res) => {
  const { messageId } = req.body;
  if (!messageId) {
    return res.status(400).json({ message: "Please enter all fields" });
  }
  try {
    const newNotification = await Notification.create({
      user: req.user._id,
      message: messageId,
    });
    const fullNotification = await newNotification.populate([
      { path: "user", select: "name email pic" },
      {
        path: "message",
        populate: [
          { path: "sender", select: "name email pic" },
          { path: "chat" },
        ],
      },
    ]);
    res.send(fullNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.getAllNotifications = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.find({
      user: req.user._id,
    }).populate([
      { path: "user", select: "name email pic" },
      {
        path: "message",
        populate: [
          { path: "sender", select: "name email pic" },
          {
            path: "chat",
            populate: [
              { path: "users", select: "-password" },
              { path: "groupAdmin", select: "-password" },
              {
                path: "latestMessage",
                populate: { path: "sender", select: "name email pic" },
              },
            ],
          },
        ],
      },
    ]);
    res.send(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.deleteNotification = asyncHandler(async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json("Notification deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
