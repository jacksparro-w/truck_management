const express =
  require("express");

const router =
  express.Router();

const authMiddleware =
  require("../../middleware/auth.middleware");

const roleMiddleware =
  require("../../middleware/role.middleware");

const controller =
  require("./driver.controller");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.getDrivers
);

router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.updateDriverStatus
);

module.exports = router;