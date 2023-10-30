const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  userID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password and confirm-password are not the same",
    },
  },
  tweetsIDs: { type: [String] },
  passwordChangedAt: Date,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
