const express = require("express");
const {
  CreateClass,
  getAllClasses,
  getAllCategories,
  updateClass,
  deleteClass,
} = require("../Controllers/ClassController");

const router = express.Router();

// Routes
router.post("/", CreateClass);          // ✅ Create
router.get("/", getAllClasses);         // ✅ Get all with search & category filter
router.get("/categories", getAllCategories); // ✅ Get all categories
router.put("/:id", updateClass);        // ✅ Update
router.delete("/:id", deleteClass);     // ✅ Delete

module.exports = router;
