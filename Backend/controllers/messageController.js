const Message = require("../Models/messagesModel");
const Chat = require("../Models/chatModel");

const createMessage = async (req, res) => {
  if (!req.body.senderId || !req.body.content) {
    return res.status(400).json({
      message: "Please Provide both senderId and content",
    });
  }
  const newMessage = new Message({
    sender: req.body.senderId,
    chat: req.body.chatId,
    content: req.body.content,
  });
  try {
    const savedMessage = await newMessage.save();
    const chatChat = await Chat.findById({ _id: req.body.chatId });
    chatChat.latestMessage = savedMessage;
    await chatChat.save();
    const populatedMessage = await Message.populate(savedMessage, [
      "sender",
      "chat",
    ]);
    res.json(populatedMessage);
  } catch (err) {
    res.status(500).send("Internal server Error");
  }
};

const getAllMessage = async (req, res) => {
  const allMessages = await Message.find({ chat: req.params.chatId })
    .sort({ createdAt: 1 }) // Sort from oldest to newest
    .populate("sender", "-password") // Populate sender excluding password
    .populate("chat"); // Populate chat information

  res.send(allMessages);
};

module.exports.createMessage = createMessage;
module.exports.getAllMessage = getAllMessage;
