const express = require("express");
const {
  CreateClass,
  getAllClasses,
  // getClassById,
  updateClass,
  deleteClass,
} = require("../Controllers/ClassController"); // ✅ make sure the path is correct

const router = express.Router();

// Routes
router.post("/", CreateClass);         // ✅ Create
router.get("/", getAllClasses);        // ✅ Get all
// router.get("/:id", getClassById);      // ✅ Get by ID
router.put("/:id", updateClass);       // ✅ Update
router.delete("/:id", deleteClass);    // ✅ Delete

module.exports = router;
