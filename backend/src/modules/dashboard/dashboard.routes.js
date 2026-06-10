const router =
require("express").Router();

const authMiddleware =
require("../../middleware/auth.middleware");

const roleMiddleware =
require("../../middleware/role.middleware");

const controller =
require("./dashboard.controller");

router.get(
  "/summary",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "SUPERVISOR"
  ),
  controller.getSummary
);

router.get(
  "/live-map",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "SUPERVISOR"
  ),
  controller.getLiveMap
);

router.get(
  "/truck-monitoring",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "SUPERVISOR"
  ),
  controller.getTruckMonitoring
);

router.get(
  "/analytics/alerts",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "SUPERVISOR"
  ),
  controller.getAlertAnalytics
);

router.get(
  "/analytics/cargo",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "SUPERVISOR"
  ),
  controller.getCargoDistribution
);

router.get(
  "/analytics/violations",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "SUPERVISOR"
  ),
  controller.getRouteViolations
);

router.get(
  "/analytics/congestion",
  authMiddleware,
  roleMiddleware(
    "ADMIN",
    "SUPERVISOR"
  ),
  controller.getCongestionHotspots
);

module.exports = router;