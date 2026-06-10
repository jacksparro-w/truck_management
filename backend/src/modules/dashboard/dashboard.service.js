const prisma = require("../../config/prisma");

const getDashboardSummary = async () => {

  const [
    totalTrucks,
    activeTrips,
    totalAlerts,
    activeCongestions,
  ] = await Promise.all([
    prisma.truck.count(),

    prisma.trip.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.alert.count(),

    prisma.congestionEvent.count({
      where: {
        createdAt: {
          gte: new Date(
            Date.now() -
            24 * 60 * 60 * 1000
          ),
        },
      },
    }),
  ]);

  return {
    totalTrucks,
    activeTrips,
    totalAlerts,
    activeCongestions,
  };
};


const {
    getAllLocations,
} = require(
    "../../services/liveLocation.service"
);

const getLiveMapData =
async () => {
    
    return getAllLocations();
};

const getTruckMonitoring =
async () => {

  return prisma.trip.findMany({
    where: {
      status: "ACTIVE",
    },

    include: {
      truck: true,

      driver: {
        select: {
          id: true,
          name: true,
          mobile: true,
        },
      },

      cargoType: true,

      destination: true,
    },
  });
};

const getAlertAnalytics =
async () => {

  const wrongRoute =
    await prisma.alert.count({
      where: {
        type:
          "WRONG_ROUTE",
      },
    });

  const congestion =
    await prisma.alert.count({
      where: {
        type:
          "CONGESTION",
      },
    });

  return {
    wrongRoute,
    congestion,
  };
};

const getCargoDistribution =
async () => {

  const data =
    await prisma.trip.groupBy({
      by: ["cargoTypeId"],

      _count: true,
    });

  return data;
};

const getRouteViolations =
async () => {

  return prisma.alert.groupBy({
    by: ["tripId"],

    where: {
      type:
        "WRONG_ROUTE",
    },

    _count: true,
  });
};

const getCongestionHotspots =
async () => {

  return prisma.congestionEvent.findMany({
    orderBy: {
      truckCount:
        "desc",
    },

    take: 10,
  });
};



module.exports = {
  getDashboardSummary,
    getLiveMapData,
    getTruckMonitoring,
    getAlertAnalytics,
    getCargoDistribution,
    getRouteViolations,
    getCongestionHotspots, 
     
};