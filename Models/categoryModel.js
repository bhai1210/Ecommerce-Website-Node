const mongoose = require("mongoose");

// Define schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

// Create model
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
