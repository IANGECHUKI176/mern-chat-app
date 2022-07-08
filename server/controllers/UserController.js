const expressAsyncHandler = require("express-async-handler");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/generateToken");
const User = require("../models/UserModel");
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.sendStatus(400);
    throw new Error("Please enter all fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.sendStatus(400);
    throw new Error("User already exists");
  }
  const user = await User.create({ name, email, password, pic });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.send(400);
    throw new Error("Failed to create user");
  }
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    res.sendStatus(400);
    throw new Error("Please enter all fields");
  }
  const user = await User.findOne({ email });
  const isPasswordCorrect = await user.matchPasswords(password);

  if (user && isPasswordCorrect) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.sendStatus(400);
    throw new Error("Invalid email or password");
  }
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  //  const query=new RegExp(req.query.search,"i")
  // const users=await User.find({$or:[{name:query},{email:query}]})
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          {
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
      }
    : {};
  try {
    const users = await User.find(keyword).find({
      _id: { $ne: req.user._id },
    });
    if (!users) {
      return res.status(500).json({ message: "no users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
