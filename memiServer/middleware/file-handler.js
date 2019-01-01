const multer = require("multer");

const path = require("path");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

var serverDir = path.dirname(require.main.filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, serverDir + "/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLocaleLowerCase()
      .split(" ")
      .join("-");
    const extension = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extension);
  }
});

module.exports = multer({ storage: storage }).single("image");
