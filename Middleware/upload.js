// // middleware/upload.js
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
// if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, UPLOAD_DIR);
//   },
//   filename: function (req, file, cb) {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
// });

// module.exports = upload;


const multer = require("multer");

// Memory storage, no local folder needed
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB
});

module.exports = upload;

