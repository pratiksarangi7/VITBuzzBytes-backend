const express = require("express");
const User = require("./../models/user_model");
const Buzz = require("./../models/buzz_model");
const { signToken } = require("./auth_controllers");
// user is put into req by the protect middleware(req.user), which runs before post
exports.postBuzz = async (req, res, next) => {
  try {
    // 1) create new buzz
    const newBuzz = await Buzz.create({
      text: req.body.text,
      image: req.body.image,
      category: req.body.category,
    });
    // 3) add buzz ID to user's list of buzzesIDs
    const user = req.user;
    await User.updateOne(
      { _id: user._id },
      { $push: { buzzesID: newBuzz._id } }
    );
    res
      .status(201)
      .json({ status: "success", message: "Buzz added successfully" });
  } catch (err) {
    res.status(500).json({
      status: "failure",
      message: err.message,
    });
  }
};
