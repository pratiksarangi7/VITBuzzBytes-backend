const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  userID: { type: String, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  tweetsIDs: { type: [String] },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
