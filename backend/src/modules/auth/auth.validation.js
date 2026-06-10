const { body } = require("express-validator");

exports.loginValidation = [
  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile is required")
    .isString()
    .withMessage("Mobile must be a string")
    .isLength({ min: 10 }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 }),
];

exports.createUserValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile must be 10 digits"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn([
      "ADMIN",
      "DRIVER",
      "SUPERVISOR",
    ])
    .withMessage("Role must be ADMIN, DRIVER, or SUPERVISOR"),
];
