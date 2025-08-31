const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../Controllers/employeeController");

router.post("/", createEmployee);   // Create
router.get("/", getEmployees);      // Read
router.put("/:id", updateEmployee); // Update
router.delete("/:id", deleteEmployee); // Delete

module.exports = router;
