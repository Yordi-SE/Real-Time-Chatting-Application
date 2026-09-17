const User = require("../Models/userModel");
const generateToken = require("../Config/generateToken");

const registerUser = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ message: "You need to fill all of the fields" });
  }

  const userExist = await User.findOne({ email: req.body.email });

  if (userExist) {
    return res.status(400).send({ message: "The User already exist" });
  } else {
    try {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        pic: req.body.pic.length > 0 ? req.body.pic : undefined,
      });

      const savedUser = await user.save();
      res.status(200).json({
        name: savedUser.name,
        email: savedUser.email,
        pic: savedUser.pic,
        _id: savedUser._id,
        token: generateToken(savedUser._id),
      });
    } catch (error) {
      console.error("Error saving user:", error);
    }
  }
};

const authUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user && (await user.matchPassword(req.body.password))) {
    res.status(200).json({
      name: user.name,
      email: user.email,
      _id: user._id,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "email or password incorrect" });
  }
};

// Use Query Prams for this endpoint

const allUser = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { name: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.status(200).json(users);
};

module.exports.registerUser = registerUser;
module.exports.authUser = authUser;
module.exports.allUser = allUser;
