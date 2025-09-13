// Validators/recordValidator.js
const { body } = require("express-validator");

const createRecordValidator = [
  body("firstname").notEmpty().withMessage("First name is required"),
  body("lastname").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("age").optional().isNumeric().withMessage("Age must be a number"),
  body("gender").notEmpty().withMessage("Gender is required"),

  // ✅ Fix: hobbies should be array, not string
  body("hobbies")
    .custom((value) => {
      if (Array.isArray(value)) return true;
      throw new Error("Hobbies must be an array");
    }),

  body("country").notEmpty().withMessage("Country is required"),
  body("about").notEmpty().withMessage("About is required"),
  body("dob").notEmpty().withMessage("Date of birth is required"),
  body("satisfaction")
    .isInt({ min: 0, max: 100 })
    .withMessage("Satisfaction must be between 0 and 100"),
];

const updateRecordValidator = [
  body("firstname").optional().notEmpty(),
  body("lastname").optional().notEmpty(),
  body("email").optional().isEmail(),
  body("password").optional().isLength({ min: 6 }),
  body("age").optional().isNumeric(),
  body("gender").optional(),
  body("hobbies")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return true;
      throw new Error("Hobbies must be an array");
    }),
  body("country").optional(),
  body("about").optional(),
  body("dob").optional(),
  body("satisfaction").optional().isInt({ min: 0, max: 100 }),
];

module.exports = { createRecordValidator, updateRecordValidator };
