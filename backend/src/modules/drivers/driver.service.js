const prisma = require("../../config/prisma");

exports.getDrivers = async () => {
  return await prisma.user.findMany({
    where: {
      role: "DRIVER",
    },
    select: {
      id: true,
      name: true,
      mobile: true,
      isActive: true,

      trucks: {
        select: {
          id: true,
          truckNumber: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

exports.updateDriverStatus = async (
  driverId,
  isActive
) => {
  const driver =
    await prisma.user.findFirst({
      where: {
        id: driverId,
        role: "DRIVER",
      },
    });

  if (!driver) {
    const error = new Error(
      "Driver not found"
    );
    error.statusCode = 404;
    throw error;
  }

  return await prisma.user.update({
    where: {
      id: driverId,
    },
    data: {
      isActive,
    },
  });
};
