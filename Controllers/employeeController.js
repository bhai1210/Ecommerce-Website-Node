const Employee = require("../Models/employeeModel");

// ✅ Create Employee
const createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get All Employees with Sorting, Searching, Pagination
const getEmployees = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", sortBy = "createdAt", order = "desc" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    // 🔍 Search filter (example: name, email, position fields)
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { position: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // ↕️ Sorting
    const sortOrder = order === "asc" ? 1 : -1;
    const sortQuery = { [sortBy]: sortOrder };

    // 📄 Pagination + Query
    const employees = await Employee.find(searchQuery)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    // ✅ Get total count for pagination
    const totalEmployees = await Employee.countDocuments(searchQuery);

    res.json({
      data: employees,
      currentPage: page,
      totalPages: Math.ceil(totalEmployees / limit),
      totalEmployees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Employee
const updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Employee not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete Employee
const deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
};
