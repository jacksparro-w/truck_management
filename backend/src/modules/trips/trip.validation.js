const { body, param } = require("express-validator");

exports.startTripValidation = [
  body("truckId")
    .notEmpty()
    .withMessage("Truck ID is required"),

  body("cargoStatus")
    .isIn(["LOADED", "EMPTY"])
    .withMessage("Invalid cargo status"),

  body("destinationId")
    .notEmpty()
    .withMessage("Destination is required"),

  body("cargoTypeId").custom((value, { req }) => {
    if (
      req.body.cargoStatus === "LOADED" &&
      !value
    ) {
      throw new Error(
        "Cargo Type is required when cargo is loaded"
      );
    }

    return true;
  }),
];

exports.endTripValidation = [
  param("tripId")
    .notEmpty()
    .withMessage("Trip ID is required"),
];