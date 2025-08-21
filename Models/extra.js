const mongoose = require("mongoose");

const extraSchema = new mongoose.Schema({
  first: {
    type: String,
    required: true, // e.g., "10th Grade - Section A"
  },
  second: {
    type: String,
    required: true, // e.g., "10th Grade - Section A"
  },
  third: {
    type: String,
    required: true, // e.g., "10th Grade - Section A"
  },
  forth: {
    type: String,
    required: true, // e.g., "10th Grade - Section A"
  },
  five: {
    type: String,
    required: true, // e.g., "10th Grade - Section A"
  },
});

module.exports = mongoose.model("Extra", extraSchema);
