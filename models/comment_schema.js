const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userid: String,
  text: String,
});
module.exports = commentSchema;
