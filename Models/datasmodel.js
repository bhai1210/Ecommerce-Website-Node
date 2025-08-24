const mongoose = require("mongoose");

// ✅ Define schema
const datasSchema = new mongoose.Schema({
  fees: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

// ✅ Create model
const DatasModel = mongoose.model("DatasModel", datasSchema);

// ✅ Export model
module.exports = DatasModel;
