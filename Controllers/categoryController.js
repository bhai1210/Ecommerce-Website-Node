// controllers/categoryController.js
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../Models/categoryModel");

// Get all categories
function getAllCategories(req, res) {
  res.json(getCategories());
}

// Add new category
function createCategory(req, res) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  const newCategory = addCategory(name);
  res.status(201).json(newCategory);
}

// Update category
function editCategory(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  const updated = updateCategory(id, name);
  res.json(updated);
}

// Delete category
function removeCategory(req, res) {
  const { id } = req.params;
  deleteCategory(id);
  res.json({ success: true });
}

module.exports = {
  getAllCategories,
  createCategory,
  editCategory,
  removeCategory,
};
