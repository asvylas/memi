const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.profileInfo = (req, res, next) => {
  console.log(`/user/profile/${req.params.id} hit.`);
  User.findOne({
    _id: req.params.id
  })
    .then(user => {
      let fetchedUser = {
        username: user.username,
        profilePicturePath: user.profilePicturePath,
        userId: user._id,
        created: user.timeStamp,
        favorites: user.favorites,
        likes: user.likes
      };
      if (user) {
        res.status(200).json({
          userProfile: fetchedUser
        });
      } else {
        res.status(404).json({
          message: `No user with id: ${req.params.id} found.`
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Internal server error, please try again."
      });
    });
};

exports.userLikePost = (req, res, next) => {
  if (req.body.userId == req.userData.id) {
    User.findById({ _id: req.body.userId }).then(result => {
      if (isInArray(req.body.postId, result.likes)) {
        const newArray = result.likes.filter(item => {
          if (item != req.body.postId) {
            return item;
          }
        });
        result.set({ likes: newArray });
        result
          .save()
          .then(result => {
            let fetchedUser = {
              username: result.username,
              profilePicturePath: result.profilePicturePath,
              userId: result._id,
              created: result.timeStamp,
              favorites: result.favorites,
              likes: result.likes
            };
            res.status(201).json({
              message: "Removed like",
              userProfile: fetchedUser
            });
          })
          .catch(err => {
            res.status(500).json({ message: "Unexpected error occured." });
          });
      } else {
        result.likes.push(req.body.postId);
        result.set({ likes: result.likes });
        result
          .save()
          .then(result => {
            let fetchedUser = {
              username: result.username,
              profilePicturePath: result.profilePicturePath,
              userId: result._id,
              created: result.timeStamp,
              favorites: result.favorites,
              likes: result.likes
            };
            res.status(201).json({
              message: "Added like",
              userProfile: fetchedUser
            });
          })
          .catch(err => {
            res.status(500).json({ message: "Unexpected error occured." });
          });
      }
    });
  } else {
    res.status(401).json({
      message: "Unauthorized access detected, request denied."
    });
  }
};

exports.userFavoritePost = (req, res, next) => {
  if (req.body.userId == req.userData.id) {
    User.findById({ _id: req.body.userId }).then(result => {
      if (isInArray(req.body.postId, result.favorites)) {
        const newArray = result.favorites.filter(item => {
          if (item != req.body.postId) {
            return item;
          }
        });
        result.set({ favorites: newArray });
        result
          .save()
          .then(result => {
            let fetchedUser = {
              username: result.username,
              profilePicturePath: result.profilePicturePath,
              userId: result._id,
              created: result.timeStamp,
              favorites: result.favorites,
              likes: result.likes
            };
            res.status(201).json({
              message: "Removed like",
              userProfile: fetchedUser
            });
          })
          .catch(err => {
            res.status(500).json({ message: "Unexpected error occured." });
          });
      } else {
        result.favorites.push(req.body.postId);
        result.set({ favorites: result.favorites });
        result
          .save()
          .then(result => {
            let fetchedUser = {
              username: result.username,
              profilePicturePath: result.profilePicturePath,
              userId: result._id,
              created: result.timeStamp,
              favorites: result.favorites,
              likes: result.likes
            };
            res.status(201).json({
              message: "Added like",
              userProfile: fetchedUser
            });
          })
          .catch(err => {
            res.status(500).json({ message: "Unexpected error occured." });
          });
      }
    });
  } else {
    res.status(401).json({
      message: "Unauthorized access detected, request denied."
    });
  }
};

function isInArray(value, array) {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (element == value) {
      return true;
    }
  }
}
