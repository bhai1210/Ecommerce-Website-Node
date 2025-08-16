// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminAuth = require("../Middleware/adminAuth");
const User = require("../Models/user");

// GET all users (admin only)
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
