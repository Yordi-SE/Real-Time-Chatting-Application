const { model } = require("mongoose");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");

const accessChat = async (req, res) => {
  const userId = req.body.userId;

  if (!userId) {
    console.log("User id is not sent in the body");
    return res.sendStatus(400);
  }

  const theChat = await Chat.find({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
  }).populate("users");

  if (theChat.length > 0) {
    return res.status(200).json(theChat);
  } else {
    try {
      const newChat = new Chat({
        chatName: "sender",
        isGroupChat: false,
        users: [userId, req.user._id],
      });
      const savedNewChat = await newChat.save();
      const populatedChat = await savedNewChat.populate("users");
      res.status(200).json(populatedChat);
    } catch (error) {
      console.error(error);
    }
  }
};

const getMyChats = async (req, res) => {
  const myChats = await Chat.find({
    users: { $in: [req.user._id] },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        model: "User",
        select: "name pic email",
      },
    })
    .sort({ updatedAt: -1 });

  res.status(200).json(myChats);
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || req.body.users.length === 0 || !req.body.name) {
    return res.status(400).json({
      message: "Please fill all the fileds",
    });
  } else if (req.body.users.length < 2) {
    return res.status(400).json({
      message: "More than two users are required to from a group",
    });
  } else {
    const newGroupChat = {
      chatName: req.body.name,
      groupAdmin: req.user._id,
      users: [...req.body.users, req.user._id],
      isGroupChat: true,
    };

    try {
      const savedGroupChat = await Chat.create(newGroupChat);

      const groupChat = await Chat.findById({ _id: savedGroupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      res.status(200).json(groupChat);
    } catch (error) {
      res.status(500).json({ message: "This time it is not you it is us" });
    }
  }
};

const renameGroup = async (req, res) => {
  let groupOnChnage;
  if (!req.body.name || !req.body.groupId) {
    return res.status(400).json({
      message: "You have to provide the new name or the group id",
    });
  } else {
    try {
      groupOnChnage = await Chat.findById({ _id: req.body.groupId });
    } catch (error) {
      res.status(500).json({
        message: "Failed while fetching group",
      });
    }
    if (!groupOnChnage) {
      return res.status(400).json({
        message: "please give the valid group id",
      });
    } else {
      if (
        JSON.stringify(req.user._id) ===
        JSON.stringify(groupOnChnage.groupAdmin)
      ) {
        try {
          const updatedGroup = await Chat.findOneAndUpdate(
            { _id: req.body.groupId },
            {
              $set: {
                chatName: req.body.name,
              },
            },
            { new: true }
          )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

          res.status(200).json(updatedGroup);
        } catch (error) {
          return res.status(500).json({
            message: "Failed while Updating the name of the group ",
          });
        }
      } else {
        return res.status(403).json({
          message:
            "Only Group Admin can change or update the name of the group",
        });
      }
    }
  }
};

const addToGroup = async (req, res) => {
  let groupChat;
  // Checking if userId and groupId is provided
  if (!req.body.userId || !req.body.groupId) {
    return res.status(400).json({
      message: "either userId or groupId is not provided",
    });
  }

  try {
    groupChat = await Chat.findById({ _id: req.body.groupId });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch the group",
    });
  }

  // Checking if the group with the groupId is exist
  if (groupChat) {
    // Checking if a user is authorized to add someone to the group
    if (JSON.stringify(req.user._id) === JSON.stringify(groupChat.groupAdmin)) {
      // Checking if a user with a userId is already a memmber of the group
      if (groupChat.users.includes(req.body.userId)) {
        return res.status(400).json({
          message: "This user already exists in the group",
        });
      } else {
        try {
          const updatedGroup = await Chat.findOneAndUpdate(
            { _id: req.body.groupId },
            {
              $push: { users: req.body.userId },
            },
            { new: true }
          )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
          res.status(200).json(updatedGroup);
        } catch (error) {
          return res.status(500).json({
            message: "Failed while adding a user to the group",
          });
        }
      }
    } else {
      return res.status(403).json({
        message: "Only can Admin can add memmbers",
      });
    }
  } else {
    return res.status(404).json({
      message: "The Group is does not exist",
    });
  }
};

const removeFromGroup = async (req, res) => {
  let groupChat;
  // Checking if userId and groupId is provided
  if (!req.body.userId || !req.body.groupId) {
    return res.status(400).json({
      message: "either userId or groupId is not provided",
    });
  }

  try {
    groupChat = await Chat.findById({ _id: req.body.groupId });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch the group",
    });
  }

  // Checking if the group with the groupId is exist
  if (groupChat) {
    // Checking if a user is authorized to remove someone to the group
    if (JSON.stringify(req.user._id) === JSON.stringify(groupChat.groupAdmin)) {
      // Checking if a user with a userId is already a memmber of the group
      if (groupChat.users.includes(req.body.userId)) {
        try {
          const updatedGroup = await Chat.findOneAndUpdate(
            { _id: req.body.groupId },
            {
              $pull: { users: req.body.userId },
            },
            { new: true }
          )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
          res.status(200).json(updatedGroup);
        } catch (error) {
          return res.status(500).json({
            message: "Failed while adding a user to the group",
          });
        }
      } else {
        return res.status(400).json({
          message:
            "You can remove a user from a group which he does not belong to",
        });
      }
    } else {
      return res.status(403).json({
        message: "Only can Admin can remove memmbers",
      });
    }
  } else {
    return res.status(404).json({
      message: "The Group is does not exist",
    });
  }
};

module.exports.accessChat = accessChat;
module.exports.getMyChats = getMyChats;
module.exports.createGroupChat = createGroupChat;
module.exports.renameGroup = renameGroup;
module.exports.addToGroup = addToGroup;
module.exports.removeFromGroup = removeFromGroup;
