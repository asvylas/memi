const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now },
  profilePicturePath: {
    type: String,
    default:
      "http://memitest-env.bp7zpkxqzx.us-east-2.elasticbeanstalk.com/images/M-defaultprofile.png"
  },
  favorites: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Post" }],
  likes: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Post" }]
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
