const express = require("express");
const router = express.Router();

// Example heatmap data
const heatmapData = {
  data: [
    [78, 21, 24, 88, 78, 84, 92], // 8AM–12PM
    [21, 57, 12, 21, 87, 78, 84], // 12PM–4PM
    [22, 44, 57, 93, 92, 44, 64], // 4PM–8PM
    [67, 24, 85, 0, 66, 92, 12],  // 8PM–12AM
    [24, 0, 56, 65, 12, 64, 92],  // 12AM–4AM
    [24, 67, 53, 44, 85, 66, 90], // 4AM–8AM
  ],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  timeSlots: [
    "8AM – 12PM",
    "12PM – 4PM",
    "4PM – 8PM",
    "8PM – 12AM",
    "12AM – 4AM",
    "4AM – 8AM",
  ],
};

// GET /api/heatmap
router.get("/", (req, res) => {
  try {
    res.json(heatmapData);
  } catch (err) {
    console.error("Error fetching heatmap data:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
