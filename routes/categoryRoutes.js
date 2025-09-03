const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// ✅ Routes must receive functions as handlerss
router.get("/", categoryController.getCategories);
router.get('/cat',categoryController.getAllCategories)
router.post("/", categoryController.addCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);


module.exports = router;
