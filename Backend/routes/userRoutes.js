const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  allUser,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");

router.route("/").post(registerUser).get(protect, allUser);
router.route("/login").post(authUser);

module.exports = router;
