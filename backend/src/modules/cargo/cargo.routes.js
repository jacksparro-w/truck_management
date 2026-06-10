const router = require("express").Router();

const authMiddleware =
  require("../../middleware/auth.middleware");

const roleMiddleware =
  require("../../middleware/role.middleware");

const controller =
  require("./cargo.controller");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.createCargoType
);

router.get(
  "/",
  authMiddleware,
  controller.getCargoTypes
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.deleteCargoType
);

module.exports = router;