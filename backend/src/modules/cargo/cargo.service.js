const prisma = require("../../config/prisma");

const createCargoType = async (data) => {
  return prisma.cargoType.create({
    data: {
      name: data.name,
    },
  });
};

const getCargoTypes = async () => {
  return prisma.cargoType.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};

const deactivateCargoType = async (id) => {
  return prisma.cargoType.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
};

module.exports = {
  createCargoType,
  getCargoTypes,
  deactivateCargoType,
};