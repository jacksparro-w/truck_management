const prisma = require("../config/prisma");

const {
  getAllLocations,
} = require("./liveLocation.service");

const {
  getDistance,
} = require("geolib");

const {
  createAlert,
} = require("./alert.service");

const CONGESTION_RADIUS = 200;

const TRUCK_LIMIT = 20;

const detectCongestion =
  async () => {

    const locations =
      getAllLocations();

    if (
      locations.length <
      TRUCK_LIMIT
    ) {
      return;
    }

    for (const center of locations) {

      const nearby =
        locations.filter(
          (truck) => {

            const distance =
              getDistance(
                {
                  latitude:
                    center.latitude,
                  longitude:
                    center.longitude,
                },
                {
                  latitude:
                    truck.latitude,
                  longitude:
                    truck.longitude,
                }
              );

            return (
              distance <=
              CONGESTION_RADIUS
            );
          }
        );

      if (
        nearby.length >=
        TRUCK_LIMIT
      ) {

        const existing =
          await prisma.congestionEvent.findFirst({
            where: {
              createdAt: {
                gte: new Date(
                  Date.now() -
                    5 *
                      60 *
                      1000
                ),
              },
            },
          });

        if (existing) {
          continue;
        }

        const event =
          await prisma.congestionEvent.create({
            data: {
              latitude:
                center.latitude,

              longitude:
                center.longitude,

              radius:
                CONGESTION_RADIUS,

              truckCount:
                nearby.length,
            },
          });

        await generateCongestionAlert(
          event
        );
      }
    }
  };

module.exports = {
  detectCongestion,
};

const generateCongestionAlert =
  async (
    congestionEvent
  ) => {

    const activeTrips =
      await prisma.trip.findMany({
        where: {
          status:
            "ACTIVE",
        },
      });

    for (const trip of activeTrips) {

      await createAlert({
        tripId: trip.id,

        type:
          "CONGESTION",

        severity:
          "CRITICAL",

        title:
          "High Congestion Detected",

        message:
          `${congestionEvent.truckCount} trucks detected within ${congestionEvent.radius} meters`,
      });
    }
  };