const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  department: { type: String, required: true },
});

module.exports = mongoose.model("Employee", employeeSchema);
