const { validationResult } =
  require("express-validator");

const trackingService =
  require("./tracking.service");

exports.updateLocation =
  async (req, res, next) => {

    try {

      const errors =
        validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors:
            errors.array(),
        });
      }

      const gps =
        await trackingService.saveLocation(
          req.body
        );

      res.status(201).json({
        success: true,
        data: gps,
      });

    } catch (error) {
      next(error);
    }
  };

exports.getHistory =
  async (req, res, next) => {

    try {

      const page =
        Number(
          req.query.page
        ) || 1;

      const limit =
        Number(
          req.query.limit
        ) || 50;

      const data =
        await trackingService.getLocationHistory(
          req.params.tripId,
          page,
          limit
        );

      res.json({
        success: true,
        data,
      });

    } catch (error) {
      next(error);
    }
  };