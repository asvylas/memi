const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      username: req.body.username
    });
    user
      .save()
      .then(() => {
        res.status(201).json({
          message: "User created"
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Email already in use."
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      fetchedUser = user;
      if (!user) {
        return res.status(401).json({ message: "Authentication failed." });
      } else {
        return bcrypt.compare(req.body.password, user.password);
      }
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({ message: "Authentication failed." });
      } else {
        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({
          message: "Authenticated succesfully",
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
          username: fetchedUser.username,
          created: fetchedUser.timeStamp,
          profilePicturePath: fetchedUser.profilePicturePath,
          favorites: fetchedUser.favorites,
          likes: fetchedUser.likes
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Invalid credentials."
      });
    });
};
