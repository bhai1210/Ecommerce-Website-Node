// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const authMiddleware = require("../Middleware/authMiddleware"); // simple auth middleware

// CRUD
router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);    // full update
router.patch("/:id", userController.updateUser);  // or partial, same handler is fine
router.delete("/:id", userController.deleteUser);

module.exports = router;
