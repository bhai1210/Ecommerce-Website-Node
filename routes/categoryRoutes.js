// routes/categoryRoutes.js
const express = require("express");
const {
  getAllCategories,
  createCategory,
  editCategory,
  removeCategory,
} = require("../Controllers/categoryController");

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", createCategory);
router.put("/:id", editCategory);
router.delete("/:id", removeCategory);

module.exports = router;
