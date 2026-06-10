const { validationResult } =
  require("express-validator");

const truckService =
  require("./truck.service");

exports.createTruck = async (
  req,
  res,
  next
) => {
  try {
    const errors =
      validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const truck =
      await truckService.createTruck(
        req.body
      );

    res.status(201).json({
      success: true,
      data: truck,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrucks = async (
  req,
  res,
  next
) => {
  try {
    const trucks =
      await truckService.getAllTrucks();

    res.json({
      success: true,
      data: trucks,
    });
  } catch (error) {
    next(error);
  }
};

exports.assignDriver = async (
  req,
  res,
  next
) => {
  try {
    const truck =
      await truckService.assignDriver(
        req.params.truckId,
        req.body.driverId
      );

    res.json({
      success: true,
      data: truck,
    });
  } catch (error) {
    next(error);
  }
};