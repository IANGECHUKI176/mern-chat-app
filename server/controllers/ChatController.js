const asyncHandler = require("express-async-handler");
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");
exports.accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "no user id" });
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  }).populate([
    { path: "users" ,select:"-password"},
    {
      path: "latestMessage",
      populate: { path: "sender", select: "name email pic" },
    },
  ]);

  // isChat = await User.populate(isChat, {
  //   path: "latestMessage.sender",
  //   select: "name email pic",
  // });

  if (Array.isArray(isChat) && isChat.length > 0) {
    res.send(isChat[0]);
    return;
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      // const createdChat = await Chat.create(chatData);
      // const fullChat = await Chat.find({ _id: createdChat._id }).populate(
      //   "users",
      //   "-password"
      // );
      const fullChat=await (await Chat.create(chatData)).populate("users",'-password')
      res.status(200).send(fullChat);
    } catch (error) {
      res.send(500).json({ message: error.message });
    }
  }
});

exports.fetchChats = asyncHandler(async (req, res) => {
  try {
    // await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
    //   .populate("users", "-password")
    //   .populate("groupAdmin", "-password")
    //   .populate("latestMessage")
    //   .sort({ updatedAt: -1 })
    //   .then(async (results) => {
    //     await User.populate(results, {
    //       path: "latestMessage.sender",
    //       select: "name email pic",
    //     });
    //     res.send(results);
    //   });
    const results = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .sort({ updatedAt: -1 })
      .populate([
        { path: "users", select: "-password" },
        { path: "groupAdmin", select: "-password" },
        {
          path: "latestMessage",
          populate: { path: "sender", select: "name email pic" },
        },
      ]);
    res.send(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

exports.createGroup = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.users) {
    return res.status(400).json({ message: "Please fill in all the fields" });
  }
  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "More than two users are required to form a group" });
  }
  users.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });
    const fullChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

exports.renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  ).populate([{ path: "users" }, { path: "groupAdmin" }]);
  if (!updatedChat) {
    return res.status(404).json({ message: "Chat not found" });
  } else {
    res.status(200).json(updatedChat);
  }
});

exports.removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const chat = await Chat.find({ _id: chatId });
  if (!chat) {
    return res.status(404).json({ message: "chat not found" });
  }
  if (chat[0].users.includes(userId)) {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    ).populate([{ path: "users" }, { path: "groupAdmin" }]);
    res.status(200).json(updatedChat);
  } else {
    res.status(500).json({ message: "user does not exists in group" });
  }
});

exports.addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const chat = await Chat.find({ _id: chatId });
  if (!chat) {
    return res.status(404).json({ message: "chat not found" });
  }
  if (!chat[0].users.includes(userId)) {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    ).populate([{ path: "users" }, { path: "groupAdmin" }]);
    res.status(200).json(updatedChat);
  } else {
    res.status(500).json({ message: "user already exists in group" });
  }
});
