const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const UserController = require("../controllers/user");

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

module.exports = router;
