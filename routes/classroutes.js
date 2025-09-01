const express = require("express");
const router = express.Router();

const {
  createClass,
  getAllClasses,
  getAllCategories,
  updateClass,
  deleteClass,
  getAllClassesmaramate,
} = require("../Controllers/ClassController");

// Routes
router.post("/create", createClass);
router.get("/", getAllClasses);
router.get("/categories", getAllCategories);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);
router.get('/mara',getAllClassesmaramate)

module.exports = router;
