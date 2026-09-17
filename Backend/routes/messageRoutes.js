const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  createMessage,
  getAllMessage,
} = require("../controllers/messageController");
const router = express.Router();

router.route("/").post(protect, createMessage);
router.route("/:chatId").get(protect, getAllMessage);
module.exports = router;
