const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/ChatModel");
const Message = require("../models/MessageModel");
exports.sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400).json({ message: "Invalid data request" });
  }
  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    let message = await (
      await Message.create(newMessage)
    ).populate([
      { path: "sender", select: "name pic" },
      { path: "chat", populate: { path: "users", select: "name email pic" } },
    ]);

    res.status(201).json(message);
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
  } catch (error) {
    res.send({ message: error.message });
  }
});

exports.getAllMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate([
      {
        path: "sender",
        select: "name email pic",
      },
      {
        path: "chat",
      },
    ]);
    res.send(messages);
  } catch (error) {
    res.send({ message: error.message });
  }
});
