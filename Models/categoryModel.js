// models/categoryModel.js

// Temporary in-memory DB
let categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
];

function getCategories() {
  return categories;
}

function addCategory(name) {
  const newCategory = { id: Date.now(), name };
  categories.push(newCategory);
  return newCategory;
}

function updateCategory(id, name) {
  categories = categories.map((cat) =>
    cat.id == id ? { ...cat, name } : cat
  );
  return categories.find((cat) => cat.id == id);
}

function deleteCategory(id) {
  categories = categories.filter((cat) => cat.id != id);
  return true;
}

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
