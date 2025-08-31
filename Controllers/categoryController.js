

const Category = require('../Models/categoryModel')
// Get all categories
async function getCategories() {
  try {
    return await Category.find().sort({ createdAt: -1 });
  } catch (error) {
    throw new Error('Error fetching categories: ' + error.message);
  }
}

// Add a new category
async function addCategory(name) {
  try {
    const category = new Category({ name });
    await category.save();
    return category;
  } catch (error) {
    throw new Error('Error adding category: ' + error.message);
  }
}

// Update a category
async function updateCategory(id, name) {
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!category) throw new Error('Category not found');
    return category;
  } catch (error) {
    throw new Error('Error updating category: ' + error.message);
  }
}

// Delete a category
async function deleteCategory(id) {
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new Error('Category not found');
    return true;
  } catch (error) {
    throw new Error('Error deleting category: ' + error.message);
  }
}

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
