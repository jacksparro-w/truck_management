const { validationResult } = require("express-validator");
const {
  createUser,
  loginUser,
  getUserProfile,
} = require("./auth.service");

const validateRequest = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });

    return false;
  }

  return true;
};

const createUserHandler = async (req, res, next) => {
  try {
    if (!validateRequest(req, res)) {
      return;
    }

    const user = await createUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    if (!validateRequest(req, res)) {
      return;
    }

    const result = await loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user.userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser: createUserHandler,
  login,
  me,
};
