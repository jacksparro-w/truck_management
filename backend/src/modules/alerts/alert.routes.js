const router =
  require("express").Router();

const authMiddleware =
  require("../../middleware/auth.middleware");

const roleMiddleware =
  require("../../middleware/role.middleware");

const controller =
  require("./alert.controller");

router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "SUPERVISOR"
  ),
  controller.getAlerts
);

module.exports = router;