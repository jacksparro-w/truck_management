const destinationService =
  require("./destination.service");

exports.createDestination =
  async (req, res, next) => {
    try {
      const destination =
        await destinationService.createDestination(
          req.body
        );

      res.status(201).json({
        success: true,
        data: destination,
      });
    } catch (error) {
      next(error);
    }
  };

exports.getDestinations =
  async (req, res, next) => {
    try {
      const destinations =
        await destinationService.getDestinations(
          req.query.type
        );

      res.json({
        success: true,
        data: destinations,
      });
    } catch (error) {
      next(error);
    }
  };

exports.getDestination =
  async (req, res, next) => {
    try {
      const destination =
        await destinationService.getDestinationById(
          req.params.id
        );

      res.json({
        success: true,
        data: destination,
      });
    } catch (error) {
      next(error);
    }
  };