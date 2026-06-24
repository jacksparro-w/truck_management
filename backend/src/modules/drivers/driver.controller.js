const driverService =
  require("./driver.service");

exports.getDrivers = async (
  req,
  res,
  next
) => {
  try {

    const drivers =
      await driverService.getDrivers();

    res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers,
    });

  } catch (error) {
    next(error);
  }
};

exports.updateDriverStatus =
  async (
    req,
    res,
    next
  ) => {

    try {

      const { id } = req.params;

      const { isActive } =
        req.body;

      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message:
            "isActive must be a boolean",
        });
      }

      const driver =
        await driverService
          .updateDriverStatus(
            id,
            isActive
          );

      res.status(200).json({
        success: true,
        message:
          "Driver status updated",
        data: driver,
      });

    } catch (error) {
      next(error);
    }
  };
