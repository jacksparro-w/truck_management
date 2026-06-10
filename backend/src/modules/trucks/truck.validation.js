const { body, param } = require("express-validator");

exports.createTruckValidation = [
  body("truckNumber")
    .notEmpty()
    .withMessage("Truck number is required"),

  body("truckType")
    .notEmpty()
    .withMessage("Truck type is required"),
];

exports.assignDriverValidation = [
  param("truckId")
    .notEmpty()
    .withMessage("Truck ID is required"),

  body("driverId")
    .notEmpty()
    .withMessage("Driver ID is required"),
];