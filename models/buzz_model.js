const mongoose = require("mongoose");
const commentSchema = require("./comment_schema");
const buzzSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: String,
  category: { type: String, required: true, default: "general" },
  likes: { type: [String], default: [] },
  dislikes: { type: [String], default: [] },
  comments: { type: [commentSchema], default: [] },
  anonymous: { type: Boolean, default: false },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "15d" },
});

const Buzz = mongoose.model("Buzz", buzzSchema);
module.exports = Buzz;
