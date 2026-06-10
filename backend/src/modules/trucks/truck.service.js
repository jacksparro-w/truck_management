const prisma = require("../../config/prisma");

const createTruck = async (data) => {
  return prisma.truck.create({
    data: {
      truckNumber: data.truckNumber,
      truckType: data.truckType,
    },
  });
};

const getAllTrucks = async () => {
  return prisma.truck.findMany({
    include: {
      driver: {
        select: {
          id: true,
          name: true,
          mobile: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const assignDriver = async (
  truckId,
  driverId
) => {
  const driver = await prisma.user.findFirst({
    where: {
      id: driverId,
      role: "DRIVER",
    },
  });

  if (!driver) {
    throw new Error("Driver not found");
  }

  return prisma.truck.update({
    where: {
      id: truckId,
    },
    data: {
      driverId,
    },
  });
};

module.exports = {
  createTruck,
  getAllTrucks,
  assignDriver,
};