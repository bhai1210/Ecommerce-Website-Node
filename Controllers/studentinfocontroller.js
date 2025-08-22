const fs = require("fs");
const path = require("path");
const StudentInfo = require("../models/studentInfoModel");

// CREATE student
const createStudent = async (req, res) => {
  try {
    const { firstname, lastname, gender } = req.body;

    if (!firstname) {
      return res.status(400).json({ message: "Firstname is required" });
    }

    const student = new StudentInfo({
      firstname,
      lastname,
      gender,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await student.save();
    res.status(201).json({ data: student, message: "Student created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all students
const getAllStudents = async (req, res) => {
  try {
    const students = await StudentInfo.find({});
    res.status(200).json({ data: students, message: "All students fetched successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await StudentInfo.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json({ data: student, message: "Student fetched successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE student
const updateStudent = async (req, res) => {
  try {
    const { firstname, lastname, gender } = req.body;
    const student = await StudentInfo.findById(req.params.id);

    if (!student) return res.status(404).json({ message: "Student not found" });

    // If new image uploaded, delete old one
    if (req.file && student.image) {
      const oldPath = path.join(__dirname, "..", student.image.replace(/^\//, ""));
      fs.unlink(oldPath, (err) => {
        if (err) console.warn("Failed to delete old image:", err.message);
      });
    }

    Object.assign(student, {
      firstname: firstname || student.firstname,
      lastname: lastname || student.lastname,
      gender: gender || student.gender,
      image: req.file ? `/uploads/${req.file.filename}` : student.image,
    });

    await student.save();
    res.status(200).json({ data: student, message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE student
const deleteStudent = async (req, res) => {
  try {
    const student = await StudentInfo.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // delete file if exists
    if (student.image) {
      const filePath = path.join(__dirname, "..", student.image.replace(/^\//, ""));
      fs.unlink(filePath, (err) => {
        if (err) console.warn("Failed to delete image:", err.message);
      });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
