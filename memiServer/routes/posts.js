const express = require("express");
const Post = require("../models/post");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const postsController = require("../controllers/posts");
const fileHandler = require("../middleware/file-handler");

router.post("", checkAuth, fileHandler, postsController.createPost);

router.put("/:id", checkAuth, fileHandler, postsController.updatePost);

router.get("", postsController.getAllPosts);

router.get("/:id", postsController.getPostById);

router.delete("/:id", checkAuth, postsController.deletePost);

module.exports = router;
