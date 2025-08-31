const express = require("express");
const router = express.Router();

// Example static data — replace with DB query if needed
const salesData = [
  { name: "Item A", value: 120 },
  { name: "Item B", value: 90 },
  { name: "Item C", value: 70 },
  { name: "Item D", value: 50 },
  { name: "Item E", value: 40 },
];

// GET /api/sales/top-items
router.get("/top-items", (req, res) => {
  try {
    res.json(salesData);
  } catch (err) {
    console.error("Error fetching sales data:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
