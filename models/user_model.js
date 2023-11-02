const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
  buzzesID: { type: [String] },
  passwordChangedAt: Date,
});
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  // saving to database may occur after jwt is sent(due to internet issues),
  // so jwt may become invalid, since it's time of creation is before the recent change in pass
  this.passwordChangedAt = Date.now() - 2000;
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
