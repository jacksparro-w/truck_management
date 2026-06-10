const prisma = require("../../config/prisma");

const startTrip = async (
  driverId,
  payload
) => {

  const truck =
    await prisma.truck.findUnique({
      where: {
        id: payload.truckId,
      },
    });

  if (!truck) {
    throw new Error("Truck not found");
  }

  if (truck.status === "IN_TRANSIT") {
    throw new Error(
      "Truck already has an active trip"
    );
  }

  const activeTrip =
    await prisma.trip.findFirst({
      where: {
        truckId: payload.truckId,
        status: "ACTIVE",
      },
    });

  if (activeTrip) {
    throw new Error(
      "Active trip already exists"
    );
  }

  const trip =
    await prisma.trip.create({
      data: {
        truckId: payload.truckId,
        driverId,
        cargoStatus:
          payload.cargoStatus,
        cargoTypeId:
          payload.cargoStatus ===
          "LOADED"
            ? payload.cargoTypeId
            : null,
        destinationId:
          payload.destinationId,
        status: "ACTIVE",
        startedAt: new Date(),
      },
      include: {
        truck: true,
        destination: true,
        cargoType: true,
      },
    });

  await prisma.truck.update({
    where: {
      id: payload.truckId,
    },
    data: {
      status: "IN_TRANSIT",
    },
  });

  return trip;
};

const endTrip = async (tripId) => {

  const trip =
    await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
    });

  if (!trip) {
    throw new Error("Trip not found");
  }

  const updatedTrip =
    await prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

  await prisma.truck.update({
    where: {
      id: trip.truckId,
    },
    data: {
      status: "AVAILABLE",
    },
  });

  return updatedTrip;
};

const getActiveTrip = async (
  driverId
) => {

  return prisma.trip.findFirst({
    where: {
      driverId,
      status: "ACTIVE",
    },
    include: {
      truck: true,
      destination: true,
      cargoType: true,
    },
  });
};

const getTripHistory = async (
  page,
  limit
) => {

  const skip =
    (page - 1) * limit;

  const trips =
    await prisma.trip.findMany({
      skip,
      take: limit,

      include: {
        truck: true,
        destination: true,
        cargoType: true,
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

  const total =
    await prisma.trip.count();

  return {
    total,
    page,
    limit,
    trips,
  };
};

module.exports = {
  startTrip,
  endTrip,
  getActiveTrip,
  getTripHistory,
};