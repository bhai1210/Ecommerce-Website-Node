// models/Record.js
const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, index: true, unique: true },
  passwordHash: { type: String, required: true }, // store hashed password
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
  hobbies: { type: [String], default: [] },
  country: { type: String },
  about: { type: String },
  dob: { type: Date },
  file: {
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number,
    path: String
  },
  satisfaction: { type: Number, min: 0, max: 100, default: 50 },

}, { timestamps: true });

module.exports = mongoose.model("Record", recordSchema);
