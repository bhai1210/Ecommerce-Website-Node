const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g., "10th Grade - Section A"
      trim: true,
    },
    subject: {
      type: String,
      required: true, // e.g., "Mathematics"
    },
    teacher: {
      type: String,
      ref: "Teacher", // Reference to Teacher model
      required: true,
    },
    students: [
      {
        type: String,
        ref: "Student", // Optional: list of students in this class
      },
    ],
    image: {
      type: String, // store image URL or file path
      default: null, // optional
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);
