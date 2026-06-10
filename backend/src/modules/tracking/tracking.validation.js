const { body } =
  require("express-validator");

exports.locationValidation = [
  body("tripId")
    .notEmpty()
    .withMessage("Trip ID required"),

  body("latitude")
    .isFloat()
    .withMessage(
      "Latitude must be valid"
    ),

  body("longitude")
    .isFloat()
    .withMessage(
      "Longitude must be valid"
    ),

  body("speed")
    .optional()
    .isFloat(),

  body("heading")
    .optional()
    .isFloat(),
];