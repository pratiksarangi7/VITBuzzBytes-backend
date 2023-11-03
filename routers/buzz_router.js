const express = require("express");
const authControllers = require("./../controllers/auth_controllers");
const buzzControllers = require("./../controllers/buzz_controllers");
const router = express.Router();

// first protect, then post buzz
router.post("/post-buzz", authControllers.protect, buzzControllers.postBuzz);
router.get("/view-buzzes", authControllers.protect, buzzControllers.viewBuzzes);
router.post("/:id/like", authControllers.protect, buzzControllers.likeBuzz);
router.post(
  "/:id/dislike",
  authControllers.protect,
  buzzControllers.dislikeBuzz
);
// delete buzz:
router.delete("/:id", authControllers.protect, buzzControllers.deleteBuzz);
router.post(
  "/:id/comment",
  authControllers.protect,
  buzzControllers.addComment
);

// delete comment:
router.delete(
  "/:id/delete-comment/:commentid",
  authControllers.protect,
  buzzControllers.deleteComment
);
module.exports = router;
