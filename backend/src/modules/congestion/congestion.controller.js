const service =
  require("./congestion.service");

exports.getEvents =
  async (
    req,
    res,
    next
  ) => {

    try {

      const events =
        await service.getEvents();

      res.json({
        success: true,
        data: events,
      });

    } catch (error) {
      next(error);
    }
  };