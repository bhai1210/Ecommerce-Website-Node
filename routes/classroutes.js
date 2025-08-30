const express = require("express");
const {
  CreateClass,
  getAllClasses,
  updateClass,
  deleteClass,
} = require("../Controllers/ClassController");

const router = express.Router();

// Routes
router.post("/", CreateClass);         // ✅ Create
router.get("/", getAllClasses);        // ✅ Get all
router.put("/:id", updateClass);       // ✅ Update
router.delete("/:id", deleteClass);    // ✅ Delete

module.exports = router;
