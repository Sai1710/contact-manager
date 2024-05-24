const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add user name"],
    },
    email: {
      type: String,
      required: [true, "Please add email"],
      unique: [true, "Email already taken"],
    },
    password: {
      type: "String",
      required: [true, "Please add your password"],
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("User", userSchema);
