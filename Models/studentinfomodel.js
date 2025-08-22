const mongoose = require("mongoose");

const studentInfoSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Firstname is required"],
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // file path
      default: null,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentInfo", studentInfoSchema);
