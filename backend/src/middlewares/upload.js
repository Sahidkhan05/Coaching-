const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Absolute path
const uploadPath = path.join(__dirname, "../../uploads/students");

// Create folder automatically if not exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;