const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/studentController");

// Routes
router.post("/", studentController.createStudent);       // Create
router.get("/", studentController.getAllStudents);       // Read all
router.get("/:id", studentController.getStudentById);    // Read single
router.put("/:id", studentController.updateStudent);     // Update
router.delete("/:id", studentController.deleteStudent);  // Delete

module.exports = router;
