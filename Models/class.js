const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stockcount: [{ type: Number, required: true }],
    image: { type: String, default: null },
    category: { type: Number, required: true }, // ✅ Must be a number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
