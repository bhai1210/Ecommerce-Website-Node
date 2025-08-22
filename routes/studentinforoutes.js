const express = require("express");
const multer = require("multer");
const path = require("path");
const studentController = require("../controllers/studentInfoController");
const crypto = require("crypto");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  }
});

// Routes
router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.post("/", upload.single("image"), studentController.createStudent);
router.put("/:id", upload.single("image"), studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
