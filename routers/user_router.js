const express = require("express");
const authControllers = require("./../controllers/auth_controllers");
const otpControllers = require("./../controllers/otp_controllers");
const userControllers = require("./../controllers/user_controllers");
const router = express.Router();

router.route("/get-otp").post(otpControllers.sendOtp);
router.route("/verify-otp").post(otpControllers.verifyOtp);
router.route("/signup").post(authControllers.signUp);
router.route("/login").post(authControllers.logIn);
router.get("/profile", authControllers.protect, userControllers.viewProfile);
router.get(
  "/notifications",
  authControllers.protect,
  userControllers.viewNotifications
);
module.exports = router;
