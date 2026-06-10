const router = require("express").Router();

const authMiddleware =
  require("../../middleware/auth.middleware");

const roleMiddleware =
  require("../../middleware/role.middleware");

const controller =
  require("./truck.controller");

const {
  createTruckValidation,
  assignDriverValidation,
} = require("./truck.validation");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createTruckValidation,
  controller.createTruck
);

router.get(
  "/",
  authMiddleware,
  controller.getTrucks
);

router.post(
  "/:truckId/assign-driver",
  authMiddleware,
  roleMiddleware("ADMIN"),
  assignDriverValidation,
  controller.assignDriver
);

module.exports = router;