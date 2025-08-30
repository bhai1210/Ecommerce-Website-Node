const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String, // just store text
      required: true,
    },
    stockcount: [
      {
        type: String, // just store text
        required: true,
      },
    ],
    image: {
      type: String, // store image URL or file path
      default: null,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference to Category model
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
