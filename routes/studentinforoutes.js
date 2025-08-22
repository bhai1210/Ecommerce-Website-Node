const express = require("express");
const multer = require("multer");
const path = require("path");
const studentController = require("../controllers/studentInfoController");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes
router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.post("/", upload.single("image"), studentController.createStudent);
router.put("/:id", upload.single("image"), studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
