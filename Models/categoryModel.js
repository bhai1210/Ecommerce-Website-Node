const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

// Get all categories
async function getCategories() {
  return await Category.find().sort({ createdAt: -1 });
}

// Add a new category
async function addCategory(name) {
  const category = new Category({ name });
  await category.save();
  return category;
}

// Update a category
async function updateCategory(id, name) {
  const category = await Category.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
  return category;
}

// Delete a category
async function deleteCategory(id) {
  await Category.findByIdAndDelete(id);
  return true;
}

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
