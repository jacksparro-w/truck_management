const prisma =
  require("../config/prisma");

const {
  getCurrentZone,
} = require("./geofence.service");

const {
  createAlert,
} = require("./alert.service");

const detectWrongRoute =
  async (
    tripId,
    latitude,
    longitude
  ) => {

    const trip =
      await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
        include: {
          destination: true,
        },
      });

    if (!trip) return;

    const currentZone =
      await getCurrentZone(
        latitude,
        longitude
      );

    if (!currentZone) {
      return;
    }

    if (
      currentZone.id !==
      trip.destination.id
    ) {

      const existingAlert =
        await prisma.alert.findFirst({
          where: {
            tripId,
            type:
              "WRONG_ROUTE",
            isResolved:
              false,
          },
        });

      if (existingAlert) {
        return;
      }

      await createAlert({
        tripId,

        type:
          "WRONG_ROUTE",

        severity:
          "HIGH",

        title:
          "Wrong Route Detected",

        message:
          `Truck entered ${currentZone.name} instead of ${trip.destination.name}`,
      });
    }
  };

module.exports = {
  detectWrongRoute,
};