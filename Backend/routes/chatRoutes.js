const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  accessChat,
  getMyChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");
const router = express.Router();

// Creation new one to one chat or getting one to one chat
router.route("/").post(protect, accessChat);

// Get All Chats
router.route("/mychat").get(protect, getMyChats);

// Create new Group
router.route("/group").post(protect, createGroupChat);

// Change or update the name of the group chat
router.route("/rename").put(protect, renameGroup);

// Add to group
router.route("/groupadd").put(protect, addToGroup);

// Remove from group
router.route("/groupremove").put(protect, removeFromGroup);

module.exports = router;
