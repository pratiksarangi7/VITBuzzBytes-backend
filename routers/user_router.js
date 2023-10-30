const express = require("express");
const authControllers = require("./../controllers/auth_controllers");
const router = express.Router();

router.route("/get-otp").post(authControllers.sendOtp);
router.route("/verify-otp").post(authControllers.verifyOtp);
router.route("/signup").post(authControllers.signUp);
module.exports = router;
