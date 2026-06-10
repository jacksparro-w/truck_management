const prisma =
require("../../config/prisma");

exports.health =
async (req, res) => {

  await prisma.$queryRaw`
    SELECT 1
  `;

  res.json({

    status:
      "healthy",

    uptime:
      process.uptime(),

    timestamp:
      new Date(),
  });
};