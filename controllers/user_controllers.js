const express = require("express");
const User = require("./../models/user_model");
const Buzz = require("./../models/buzz_model");

exports.viewProfile = async (req, res, next) => {
  try {
    const user = req.user;
    //{field:{$in:array}} -> we pick those documents whose 'field' matches any one value 'in' array
    const buzzes = await Buzz.find({ _id: { $in: user.buzzesID } }).sort({
      createdAt: -1,
    });
    res.status(200).json({ status: "success", data: { user, buzzes } });
  } catch (err) {
    res.status(500).json({ status: "failure", message: err.message });
  }
};

exports.viewNotifications = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({
      status: "success",
      data: user.notifications,
    });
  } catch (err) {
    res.status(500).json({ status: "failure", message: err.message });
  }
};
