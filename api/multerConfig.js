const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/avatars"));
  },
  filename: function (req, file, cb) {
    cb(null, req.user._id + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
