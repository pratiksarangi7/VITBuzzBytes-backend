const mongoose = require("mongoose");

const buzzSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: String,
  category: { type: String, required: true, default: "general" },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: { type: [String] },
  createdAt: { type: Date, default: Date.now, expires: "15d" },
});

const Buzz = mongoose.model("Buzz", buzzSchema);
module.exports = Buzz;
