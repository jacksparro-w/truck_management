const router =
  require("express").Router();

const authMiddleware =
  require("../../middleware/auth.middleware");

const controller =
  require("./tracking.controller");

const {
  locationValidation,
} = require("./tracking.validation");

router.post(
  "/location",
  authMiddleware,
  locationValidation,
  controller.updateLocation
);

router.get(
  "/history/:tripId",
  authMiddleware,
  controller.getHistory
);

module.exports = router;