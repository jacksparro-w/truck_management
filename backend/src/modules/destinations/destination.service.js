const prisma = require("../../config/prisma");

const createDestination = async (
  data
) => {
  return prisma.destination.create({
    data: {
      name: data.name,
      type: data.type,
      latitude: data.latitude,
      longitude: data.longitude,
      radius: data.radius,
    },
  });
};

const getDestinations = async (
  type
) => {
  return prisma.destination.findMany({
    where: type
      ? {
          type,
        }
      : {},
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getDestinationById = async (
  id
) => {
  return prisma.destination.findUnique({
    where: {
      id,
    },
  });
};

module.exports = {
  createDestination,
  getDestinations,
  getDestinationById,
};