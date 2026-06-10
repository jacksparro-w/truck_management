const service =
  require("./alert.service");

exports.getAlerts =
  async (req, res, next) => {

    try {

      const alerts =
        await service.getAlerts();

      res.json({
        success: true,
        data: alerts,
      });

    } catch (error) {
      next(error);
    }
  };