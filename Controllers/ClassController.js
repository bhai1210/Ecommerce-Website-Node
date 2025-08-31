const ClassModel = require("../Models/class");
const CategoryModel = require("../Models/categoryModel");

// Create Class
const CreateClass = async (req, res) => {
  try {
    const { name, price, description, stockcount, image, category } = req.body;

    if (!category || isNaN(Number(category))) {
      return res.status(400).json({ message: "Category must be a number" });
    }

    const newClass = new ClassModel({
      name,
      price: Number(price),
      description,
      stockcount: Array.isArray(stockcount)
        ? stockcount.map(Number)
        : [Number(stockcount)],
      image,
      category: Number(category),
    });

    await newClass.save();
    res
      .status(201)
      .json({ message: "Class created successfully", data: newClass });
  } catch (err) {
    console.error("CreateClass Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Classes with search & category filter
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
      filter.category = Number(category);
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const allClasses = await ClassModel.find(filter);
    res
      .status(200)
      .json({ message: "All classes fetched successfully", data: allClasses });
  } catch (err) {
    console.error("getAllClasses Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json(
      categories.map((cat) => ({
        id: cat._id,
        name: cat.name,
      }))
    );
  } catch (err) {
    console.error("getAllCategories Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Class
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, stockcount, image, category } = req.body;

    if (!category || isNaN(Number(category))) {
      return res.status(400).json({ message: "Category must be a number" });
    }

    const updatedClass = await ClassModel.findByIdAndUpdate(
      id,
      {
        name,
        price: Number(price),
        description,
        stockcount: Array.isArray(stockcount)
          ? stockcount.map(Number)
          : [Number(stockcount)],
        image,
        category: Number(category),
      },
      { new: true }
    );

    if (!updatedClass) return res.status(404).json({ message: "Class not found" });

    res
      .status(200)
      .json({ message: "Class updated successfully", data: updatedClass });
  } catch (err) {
    console.error("updateClass Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Class
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClass = await ClassModel.findByIdAndDelete(id);

    if (!deletedClass) return res.status(404).json({ message: "Class not found" });

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
