// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const authMiddleware = require("../Middleware/authMiddleware"); // simple auth middleware

router.post("/", userController.createUser);
router.get("/",authMiddleware, userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
