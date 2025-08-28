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

// ✅ Get All Classes
// ✅ Get All Classes with Search, Filter, Sort, Pagination
const getAllClasses = async (req, res) => {
  try {
    const {
      search,         // full text search
      category,       // category filter
      minPrice,       // price >= min
      maxPrice,       // price <= max
      rating,         // filter by rating
      sort,           // sorting (e.g., price:asc or rating:desc)
      page = 1,       // pagination (default page 1)
      limit = 10,     // items per page
    } = req.query;

    let query = {};

    // 🔍 Full-text search (on name & description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 📂 Category filter
    if (category) {
      query.category = category;
    }

    // 💰 Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // ⭐ Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // 🔽 Sorting
    let sortOptions = {};
    if (sort) {
      const [field, order] = sort.split(":");
      sortOptions[field] = order === "desc" ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // default: latest first
    }

    // 📄 Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // ✅ Query DB
    const [allClasses, total] = await Promise.all([
      ClassModel.find(query).sort(sortOptions).skip(skip).limit(Number(limit)),
      ClassModel.countDocuments(query),
    ]);

    res.status(200).json({
      message: "Classes fetched successfully",
      data: allClasses,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
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
