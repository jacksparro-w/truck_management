const prisma =
  require("../../config/prisma");
const {
  toJsonSafe,
} = require("../../utils/json");

const {
  updateLocation,
} = require("../../services/liveLocation.service");

const {
  hasIO,
  getIO,
} = require("../../config/socket");

const {
  detectWrongRoute,
} = require("../../services/routeViolation.service");

const saveLocation =
  async (payload) => {

    const trip =
      await prisma.trip.findUnique({
        where: {
          id: payload.tripId,
        },
        include: {
          truck: true,
        },
      });

    if (!trip) {
      throw new Error(
        "Trip not found"
      );
    }

    const gps =
      await prisma.gPSLocation.create({
        data: {
          tripId:
            payload.tripId,

          latitude:
            payload.latitude,

          longitude:
            payload.longitude,

          speed:
            payload.speed,

          heading:
            payload.heading,
        },
      });

    await detectWrongRoute(
      payload.tripId,
      payload.latitude,
      payload.longitude
    );

    updateLocation(
      trip.truck.id,
      {
        truckId:
          trip.truck.id,

        tripId:
          payload.tripId,

        latitude:
          payload.latitude,

        longitude:
          payload.longitude,

        speed:
          payload.speed,
      }
    );

    if (hasIO()) {
      getIO().emit(
        "truck:update",
        {
          truckId:
            trip.truck.id,

          latitude:
            payload.latitude,

          longitude:
            payload.longitude,

          speed:
            payload.speed,

          timestamp:
            new Date(),
        }
      );
    }

    return toJsonSafe(gps);
  };

const getLocationHistory =
  async (
    tripId,
    page,
    limit
  ) => {

    const skip =
      (page - 1) * limit;

    const data =
      await prisma.gPSLocation.findMany({
        where: {
          tripId,
        },

        skip,

        take: limit,

        orderBy: {
          createdAt:
            "desc",
        },
      });

    return toJsonSafe(data);
  };
module.exports = {
  saveLocation,
  getLocationHistory,
};
