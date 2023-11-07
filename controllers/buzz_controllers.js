const express = require("express");
const User = require("./../models/user_model");
const Buzz = require("./../models/buzz_model");
const { signToken } = require("./auth_controllers");
// user is put into req by the protect middleware(req.user), which runs before post

addNotificationToUser = async (userID, action, actionBy) => {
  const message = `${actionBy} ${action} your buzz`;
  await User.findOneAndUpdate(
    { userID },
    { $push: { notifications: message } }
  );
};

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
    // req.query is an obj that contains all queries:
    // eg, if in url the query is: ?category=ffcs, req.query will be: {category: ffcs}
    const buzzes = await Buzz.find(req.query).sort({ createdAt: -1 });
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
      await addNotificationToUser(buzz.createdBy, "like", req.user.userID);
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
      await addNotificationToUser(buzz.createdBy, "disliked", req.user.userID);
    }
    // if user removes dislike:
    else {
      await Buzz.findByIdAndUpdate(buzzID, {
        $pull: { dislikes: req.user.userID },
      });
    }
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).json({ status: "failure", message: err.message });
  }
};
exports.addComment = async (req, res, next) => {
  try {
    const comment = {
      text: req.body.text,
      userID: req.user.userID,
      createdAt: Date.now(),
    };
    const buzz = await Buzz.findByIdAndUpdate(req.params.id, {
      $push: { comments: comment },
    });
    console.log("reached here");
    await addNotificationToUser(buzz.createdBy, "commented", req.user.userID);

    res
      .status(201)
      .json({ status: "success", message: "comment added successfully" });
  } catch (e) {
    res.status(500).json({ status: "failure", message: e.message });
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const buzz = await Buzz.findById(req.params.id);
    if (!buzz) {
      res.status(404).json({ status: "failure", message: "not found" });
      return;
    }
    //find the target comment(to be deleted)
    const targetComment = buzz.comments.id(req.params.commentid);
    // if the target comment is not created by the user trying to delete it, return unauthorized access
    if (targetComment.userID != req.user.userID) {
      res
        .status(401)
        .json({ status: "failure", message: "Unauthorized access" });
      return;
    }
    targetComment.deleteOne();
    await buzz.save();
    res.status(204).json({ status: "success" });
  } catch (err) {
    res.status(500).json({ status: "failure", message: err.message });
  }
};

exports.deleteBuzz = async (req, res, next) => {
  let statusCode;
  try {
    const buzz = await Buzz.findById(req.params.id);
    if (!buzz) {
      statusCode = 404;
      throw new Error("No buzz found");
    }
    if (buzz.createdBy != req.user.userID) {
      statusCode = 401;
      throw new Error("unauthorized access");
    }
    await User.findByIdAndUpdate(req.user._id, {
      // pull operator removes all the instances in an array matching a particular condition
      // $pull: {array: condition}
      $pull: { buzzesID: req.params.id },
    });
    buzz.deleteOne();
    res.status(204).json({ status: "success" });
  } catch (err) {
    res.status(statusCode).json({ message: err.message });
  }
};
