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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
