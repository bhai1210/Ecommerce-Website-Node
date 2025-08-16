const Student = require("../Models/student");

// CREATE student
exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all students
// GET all students with search & class filter
exports.getAllStudents = async (req, res) => {
  try {
    const { search, classFilter, page = 1, limit = 5, sortField = "name", sortOrder = "asc" } = req.query;

    const query = {};

    if (search) {
      const searchRegex = new RegExp(search, "i"); 
      query.$or = [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { course: { $regex: searchRegex } },
        { class: { $regex: searchRegex } },
        { school: { $regex: searchRegex } },
        { address: { $regex: searchRegex } },
        { phoneNumber: { $regex: searchRegex } },
        ...(isNaN(search) ? [] : [
          { fees: Number(search) },
          { age: Number(search) }
        ])
      ];
    }

    if (classFilter) query.class = classFilter;

    const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ students, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// GET single student
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
