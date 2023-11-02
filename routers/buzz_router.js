const express = require("express");
const authControllers = require("./../controllers/auth_controllers");
const buzzControllers = require("./../controllers/buzz_controllers");
const router = express.Router();

// first protect, then post buzz
router.post("/post-buzz", authControllers.protect, buzzControllers.postBuzz);
// first protect, then view buzz
module.exports = router;
