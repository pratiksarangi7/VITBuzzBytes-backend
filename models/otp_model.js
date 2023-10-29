const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: [true, "Email required for sending otp"] },
  otp: { type: String, required: [true, "An otp must be given"], unique: true },
  createdAt: { type: Date, default: Date.now(), expires: 300 },
});

const Otp = mongoose.model("OTP", otpSchema);
module.exports = Otp;
