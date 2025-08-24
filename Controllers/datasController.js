const datasmodel = require("../Models/datasmodel");

// ✅ Create data
const createdatas = async (req, res) => {
  try {
    const newData = await datasmodel.create(req.body);
    res.status(200).send({ message: "Data created successfully", data: newData });
  } catch (err) {
    res.status(500).send({ error: "Error creating data", details: err.message });
  }
};

// ✅ Get all data
const getalldatas = async (req, res) => {
  try {
    const allData = await datasmodel.find();
    res.status(200).send({ data: allData, message: "All data fetched successfully" });
  } catch (err) {
    res.status(500).send({ error: "Error fetching data", details: err.message });
  }
};

// ✅ Get data by ID
const getdatasbyid = async (req, res) => {
  try {
    const data = await datasmodel.findById(req.params.id);
    if (!data) {
      return res.status(404).send({ error: "ID not found in database" });
    }
    res.status(200).send({ data, message: "Data found by ID" });
  } catch (err) {
    res.status(500).send({ error: "Error fetching data by ID", details: err.message });
  }
};

// ✅ Update data
const updatedatas = async (req, res) => {
  try {
    const updatedData = await datasmodel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // returns updated document
    );

    if (!updatedData) {
      return res.status(404).send({ error: "ID not found in database" });
    }

    res.status(200).send({ data: updatedData, message: "Data updated successfully" });
  } catch (err) {
    res.status(500).send({ error: "Error updating data", details: err.message });
  }
};

// ✅ Delete data
const deletedatas = async (req, res) => {
  try {
    const deletedData = await datasmodel.findByIdAndDelete(req.params.id);
    if (!deletedData) {
      return res.status(404).send({ error: "Data not found with this ID" });
    }

    res.status(200).send({ message: "Data deleted successfully", data: deletedData });
  } catch (err) {
    res.status(500).send({ error: "Error deleting data", details: err.message });
  }
};

module.exports = {
  createdatas,
  deletedatas,
  getdatasbyid,
  updatedatas,
  getalldatas,
};
