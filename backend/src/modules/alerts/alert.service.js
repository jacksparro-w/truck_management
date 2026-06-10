const prisma =
  require("../../config/prisma");

const getAlerts =
  async () => {

    return prisma.alert.findMany({
      include: {
        trip: {
          include: {
            truck: true,
          },
        },
      },

      orderBy: {
        createdAt:
          "desc",
      },
    });
  };

module.exports = {
  getAlerts,
};