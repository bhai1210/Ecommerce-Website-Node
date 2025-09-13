// routes/recordRoutes.js
const express = require("express");
const router = express.Router();
const recordController = require("../Controllers/recordController");
const upload = require("../Middleware/upload");
const { createRecordValidator, updateRecordValidator } = require("../Validators/recordValidator");
const { validationResult } = require("express-validator");

// Helper to run validators and return errors (useful for file + validators)
const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get("/", recordController.getRecords);
router.get("/:id", recordController.getRecord);

// create: use multipart/form-data with optional file field named "file"
router.post("/", upload.single("file"), createRecordValidator, runValidation, recordController.createRecord);

// update: multipart allowed
router.put("/:id", upload.single("file"), updateRecordValidator, runValidation, recordController.updateRecord);

router.delete("/:id", recordController.deleteRecord);

module.exports = router;
