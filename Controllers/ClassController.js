const ClassModel = require("../Models/class");
const CategoryModel = require("../Models/categoryModel");

// ============================
// Create Class
// ============================
const CreateClass = async (req, res) => {
  try {
    const { name, price, description, stock, category, image } = req.body;

    // ✅ Validate categoryId as ObjectId
    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const product = new ClassModel({
      name,
      price,
      description,
      stock: stock || 0,
      category, // ✅ store ObjectId
      image,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("CreateClass Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ============================
// Get All Classes (with filters)
// ============================
const getAllClasses = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category; // ✅ ObjectId, not number
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // ✅ populate category to return category name also
    const allClasses = await ClassModel.find(filter).populate("category", "name");

    res.status(200).json({
      message: "All classes fetched successfully",
      data: allClasses,
    });
  } catch (err) {
    console.error("getAllClasses Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ============================
// Get All Categories
// ============================
const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json(
      categories.map((cat) => ({
        _id: cat._id, // ✅ keep ObjectId for frontend
        name: cat.name,
      }))
    );
  } catch (err) {
    console.error("getAllCategories Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ============================
// Update Class
// ============================
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, stock, image, category } = req.body;

    // ✅ Validate categoryId
    if (category) {
      const categoryExists = await CategoryModel.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
    }

    const updatedClass = await ClassModel.findByIdAndUpdate(
      id,
      {
        name,
        price,
        description,
        stock,
        image,
        category,
      },
      { new: true }
    ).populate("category", "name");

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({
      message: "Class updated successfully",
      data: updatedClass,
    });
  } catch (err) {
    console.error("updateClass Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ============================
// Delete Class
// ============================
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClass = await ClassModel.findByIdAndDelete(id);

    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({ message: "Class deleted successfully" });
  } catch (err) {
    console.error("deleteClass Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  CreateClass,
  getAllClasses,
  getAllCategories,
  updateClass,
  deleteClass,
};
