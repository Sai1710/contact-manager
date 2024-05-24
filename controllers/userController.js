const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//@desc Register User
//@route POST /api/user/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User Already Registered");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  if (newUser) {
    res.status(201);
    res.json({ _id: newUser.id, email: newUser.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});
//@desc Login User
//@route POST /api/user/login
//@access public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await User.findOne({ email });
  if (
    userAvailable &&
    (await bcrypt.compare(password, userAvailable.password))
  ) {
    const accessToken = jwt.sign(
      {
        user: {
          username: userAvailable.username,
          email: userAvailable.email,
          id: userAvailable.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "120m" }
    );
    res.status(200).json({
      accessToken,
    });
  } else {
    res.status(401).json("Invalid Credentials");
  }
});

//@desc Get Current User
//@route POST /api/user/current-user
//@access private
const getCurrentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});
module.exports = { registerUser, loginUser, getCurrentUser };
