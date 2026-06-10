const router = require("express").Router();

const authMiddleware =
  require("../../middleware/auth.middleware");

const roleMiddleware =
  require("../../middleware/role.middleware");

const controller =
  require("./destination.controller");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.createDestination
);

router.get(
  "/",
  authMiddleware,
  controller.getDestinations
);

router.get(
  "/:id",
  authMiddleware,
  controller.getDestination
);

module.exports = router;