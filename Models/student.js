const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  course: { type: String },
  class: { type: String, required: true },
  school: { type: String, required: true },
  address: { type: String, required: true },
  fees: { type: Number, required: true },
  phoneNumber: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
