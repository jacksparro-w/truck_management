const { validationResult } =
  require("express-validator");

const tripService =
  require("./trip.service");

exports.startTrip = async (
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

    const trip =
      await tripService.startTrip(
        req.user.userId,
        req.body
      );

    res.status(201).json({
      success: true,
      data: trip,
    });

  } catch (error) {
    next(error);
  }
};

exports.endTrip = async (
  req,
  res,
  next
) => {
  try {

    const trip =
      await tripService.endTrip(
        req.params.tripId
      );

    res.json({
      success: true,
      data: trip,
    });

  } catch (error) {
    next(error);
  }
};

exports.getActiveTrip =
  async (req, res, next) => {
    try {

      const trip =
        await tripService.getActiveTrip(
          req.user.userId
        );

      res.json({
        success: true,
        data: trip,
      });

    } catch (error) {
      next(error);
    }
  };

exports.getTripHistory =
  async (req, res, next) => {
    try {

      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 20;

      const result =
        await tripService.getTripHistory(
          page,
          limit
        );

      res.json({
        success: true,
        ...result,
      });

    } catch (error) {
      next(error);
    }
  };