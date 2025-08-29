const ClassModel = require('../Models/class');

// ✅ Create Class
const CreateClass = async (req, res) => {
  try {
    const { name, price, description, stockcount, image } = req.body;

    const newClass = new ClassModel({
      name,
      price,
      description,
      stockcount, // should be an array (e.g., ["10", "20"])
      image,
    });

    await newClass.save();

    res.status(201).json({
      message: "Class created successfully",
      data: newClass,
    });
  } catch (err) {
    console.error("CreateClass Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get All Classes (with Search + Price filter)
const getAllClasses = async (req, res) => {
  try {
    const { search, minPrice, maxPrice } = req.query;

    let filter = {};

    // 🔍 Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 💰 Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const allClasses = await ClassModel.find(filter);

    res.status(200).json({
      message: "All classes fetched successfully",
      data: allClasses,
    });
  } catch (err) {
    console.error("getAllClasses Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get Class by ID
const getClassById = async (req, res) => {
  try {
    const classData = await ClassModel.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json({
      message: "Class fetched successfully",
      data: classData,
    });
  } catch (err) {
    console.error("getClassById Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update Class
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, stockcount, image } = req.body;

    const updatedClass = await ClassModel.findByIdAndUpdate(
      id,
      { name, price, description, stockcount, image },
      { new: true }
    );

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

// ✅ Delete Class
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
  getClassById,
  updateClass,
  deleteClass,
};
