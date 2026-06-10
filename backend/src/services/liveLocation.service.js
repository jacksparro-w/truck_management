const liveLocations = new Map();

const updateLocation = (
  truckId,
  data
) => {

  liveLocations.set(
    truckId,
    {
      ...data,
      updatedAt: new Date(),
    }
  );
};

const getLocation = (
  truckId
) => {
  return liveLocations.get(
    truckId
  );
};

const getAllLocations = () => {
  return Array.from(
    liveLocations.values()
  );
};

module.exports = {
  updateLocation,
  getLocation,
  getAllLocations,
};