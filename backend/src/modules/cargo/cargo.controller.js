const cargoService = require("./cargo.service");

exports.createCargoType = async (
  req,
  res,
  next
) => {
  try {
    const cargo =
      await cargoService.createCargoType(
        req.body
      );

    res.status(201).json({
      success: true,
      data: cargo,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCargoTypes = async (
  req,
  res,
  next
) => {
  try {
    const cargoTypes =
      await cargoService.getCargoTypes();

    res.json({
      success: true,
      data: cargoTypes,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCargoType = async (
  req,
  res,
  next
) => {
  try {
    await cargoService.deactivateCargoType(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Cargo Type deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};