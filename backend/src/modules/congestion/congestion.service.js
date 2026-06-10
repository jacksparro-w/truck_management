const prisma =
  require("../../config/prisma");

const getEvents =
  async () => {

    return prisma.congestionEvent.findMany({
      orderBy: {
        createdAt:
          "desc",
      },
    });
  };

module.exports = {
  getEvents,
};
