const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const ProfileController = require("../controllers/profile");

router.get("/:id", ProfileController.profileInfo);
router.post("/like", checkAuth, ProfileController.userLikePost);

router.post("/favorite", checkAuth, ProfileController.userFavoritePost);

module.exports = router;
