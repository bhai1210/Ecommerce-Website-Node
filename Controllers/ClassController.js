const mongoose = require("mongoose");
const ClassModel = require("../Models/class");
const CategoryModel = require("../Models/categoryModel");

// ============================
// Create a Class
// ============================
const createClass = async (req, res) => {
  try {
    const { name, price, description, stockcount = 0, category, image } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }

    // ✅ Validate category ID
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID format" });
    }

    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }

    const newClass = new ClassModel({
      name,
      price,
      description,
      stockcount: Array.isArray(stockcount) ? stockcount : [Number(stockcount)],
      category,
      image,
    });

    await newClass.save();

    res.status(201).json({
      message: "Class created successfully",
      data: newClass,
    });
  } catch (error) {
    console.error("createClass Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ============================
// Get All Classes (with search, filter, pagination)
// ============================
const getAllClasses = async (req, res) => {
  try {
    let { search = "", category, page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }

    const totalClasses = await ClassModel.countDocuments(filter);
    const classes = await ClassModel.find(filter)
      .populate("category", "name")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      message: "Classes fetched successfully",
      data: classes,
      totalClasses,
      currentPage: page,
      totalPages: Math.ceil(totalClasses / limit),
    });
  } catch (err) {
    console.error("getAllClasses Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ============================
// Get All Classes (without filters, raw fetch)
// ============================
const getAllClassesmaramate = async (req, res) => {
  try {
    const classes = await ClassModel.find().populate("category", "name");

    res.status(200).json({
      message: "Classes fetched successfully",
      data: classes,
    });
  } catch (err) {
    console.error("getAllClassesmaramate Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ============================
// Get All Categories
// ============================
const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories.map((cat) => ({ _id: cat._id, name: cat.name })),
    });
  } catch (err) {
    console.error("getAllCategories Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ============================
// Update a Class
// ============================
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, stockcount, image, category } = req.body;

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID format" });
    }

    if (category) {
      const categoryExists = await CategoryModel.findById(category);
      if (!categoryExists) return res.status(400).json({ message: "Category not found" });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (price !== undefined) updateFields.price = price;
    if (description !== undefined) updateFields.description = description;
    if (stockcount !== undefined)
      updateFields.stockcount = Array.isArray(stockcount) ? stockcount : [Number(stockcount)];
    if (image !== undefined) updateFields.image = image;
    if (category !== undefined) updateFields.category = category;

    const updatedClass = await ClassModel.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).populate("category", "name");

    if (!updatedClass) return res.status(404).json({ message: "Class not found" });

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
// Delete a Class
// ============================
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid class ID format" });
    }

    const deletedClass = await ClassModel.findByIdAndDelete(id);

    if (!deletedClass) return res.status(404).json({ message: "Class not found" });

    res.status(200).json({ message: "Class deleted successfully" });
  } catch (err) {
    console.error("deleteClass Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getAllClassesmaramate,
  getAllCategories,
  updateClass,
  deleteClass,
};
