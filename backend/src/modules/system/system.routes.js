const router = require("express").Router();

const prisma = require("../../config/prisma");

// Health check endpoint
router.get("/health", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "System is healthy",
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "System health check failed",
    });
  }
});

router.get("/db-health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      database: "disconnected",
    });
  }
});

module.exports = router;