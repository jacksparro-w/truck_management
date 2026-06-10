const dashboardService =
require("./dashboard.service");

exports.getSummary =
async (req, res, next) => {

  try {

    const data =
      await dashboardService.getDashboardSummary();

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    next(error);
  }
};

exports.getLiveMap =
async (req, res, next) => {

  try {

    const trucks =
      await dashboardService.getLiveMapData();

    res.json({
      success: true,
      data: trucks,
    });

  } catch (error) {
    next(error);
  }
};

exports.getTruckMonitoring =
async (req, res, next) => {

  try {

    const data =
      await dashboardService.getTruckMonitoring();

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    next(error);
  }
};

exports.getAlertAnalytics =
async (req, res, next) => {

  try {

    const data =
      await dashboardService.getAlertAnalytics();

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    next(error);
  }
};

exports.getCargoDistribution =
async (req, res, next) => {

  try {

    const data =
      await dashboardService.getCargoDistribution();

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    next(error);
  }
};

exports.getRouteViolations =
async (req, res, next) => {

  try {

    const data =
      await dashboardService.getRouteViolations();

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    next(error);
  }
};

exports.getCongestionHotspots =
async (req, res, next) => {

  try {

    const data =
      await dashboardService.getCongestionHotspots();

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    next(error);
  }
};