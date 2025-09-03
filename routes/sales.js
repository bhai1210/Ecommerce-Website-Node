const express = require("express");
const router = express.Router();

// Example static data — replace with DB query if needed
const salesData = [
  { name: "Tv", value: 120 },
  { name: "Mobile", value: 90 },
  { name: "Speakers", value: 70 },
  { name: "Covers", value: 50 },
  { name: "Chargeres", value: 40 },
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
