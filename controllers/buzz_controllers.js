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
      createdBy: req.user.userID,
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

exports.viewBuzzes = async (req, res, next) => {
  try {
    const buzzes = await Buzz.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: buzzes });
  } catch (err) {
    res.status(500).json({ status: "failure", message: err.message });
  }
};

exports.likeBuzz = async (req, res, next) => {
  try {
    const buzzID = req.params.id;
    // if user likes:
    if (req.body.like) {
      const buzz = await Buzz.findByIdAndUpdate(buzzID, {
        $push: { likes: req.user.userID },
      }); // in next version, send notification to user when like happens
    }
    // if user removes like:
    else {
      const buzz = await Buzz.findByIdAndUpdate(buzzID, {
        $pull: { likes: req.user.userID },
      });
    }
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).json({ status: "failure", message: err.message });
  }
};

exports.dislikeBuzz = async (req, res, next) => {
  try {
    const buzzID = req.params.id;
    // if user dislikes:
    if (req.body.dislike) {
      const buzz = await Buzz.findByIdAndUpdate(buzzID, {
        $push: { dislikes: req.user.userID },
      }); // in next version, send notification to user when dislike happens
    }
    // if user removes dislike:
    else {
      const buzz = await Buzz.findByIdAndUpdate(buzzID, {
        $pull: { dislikes: req.user.userID },
      });
    }
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).json({ status: "failure", message: err.message });
  }
};
