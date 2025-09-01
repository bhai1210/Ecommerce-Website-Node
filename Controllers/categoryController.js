const Category = require("../Models/categoryModel");

// ✅ Get all categories with search, sort, and pagination
const getCategories = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    // 🔍 Search by category name
    const searchQuery = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    // ↕️ Sorting
    const sortOrder = order === "asc" ? 1 : -1;
    const sortQuery = { [sortBy]: sortOrder };

    // 📄 Pagination + Query
    const categories = await Category.find(searchQuery)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCategories = await Category.countDocuments(searchQuery);

    res.json({
      data: categories,
      currentPage: page,
      totalPages: Math.ceil(totalCategories / limit),
      totalCategories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add a new category
const addCategory = async (req, res) => {
  try {
    const category = new Category({ name: req.body.name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update category
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  const categories = await CategoryModel.find();
  res.status(200).json(
    categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
    }))
  );
};


module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategories
};
