const prisma =
  require("../config/prisma");

const {
  isPointWithinRadius,
} = require("geolib");

const getCurrentZone =
  async (latitude, longitude) => {

    const destinations =
      await prisma.destination.findMany();

    for (const zone of destinations) {

      const inside =
        isPointWithinRadius(
          {
            latitude:
              Number(latitude),
            longitude:
              Number(longitude),
          },
          {
            latitude:
              Number(zone.latitude),
            longitude:
              Number(zone.longitude),
          },
          zone.radius
        );

      if (inside) {
        return zone;
      }
    }

    return null;
  };

module.exports = {
  getCurrentZone,
};