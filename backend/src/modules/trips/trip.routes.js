const router = require("express").Router();

const authMiddleware =
  require("../../middleware/auth.middleware");

const roleMiddleware =
  require("../../middleware/role.middleware");

const controller =
  require("./trip.controller");

const {
  startTripValidation,
  endTripValidation,
} = require("./trip.validation");

router.post(
  "/start",
  authMiddleware,
  roleMiddleware("DRIVER"),
  startTripValidation,
  controller.startTrip
);

router.post(
  "/:tripId/end",
  authMiddleware,
  roleMiddleware("DRIVER"),
  endTripValidation,
  controller.endTrip
);

router.get(
  "/active",
  authMiddleware,
  roleMiddleware("DRIVER"),
  controller.getActiveTrip
);

router.get(
  "/history",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "SUPERVISOR"
  ),
  controller.getTripHistory
);

module.exports = router;