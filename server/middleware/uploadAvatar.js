const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatars");
  },
  filename: function (req, file, cb) {
    if (req.file || req.files) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      let ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
