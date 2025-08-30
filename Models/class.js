const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true }, // Changed to Number
    description: { type: String, required: true },
    stockcount: [{ type: Number, required: true }], // Changed to Number
    image: { type: String, default: null },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Class", classSchema);
