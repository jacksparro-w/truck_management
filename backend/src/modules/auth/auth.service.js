const bcrypt = require("bcrypt");
const prisma = require("../../config/prisma");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../config/jwt");

const createUser = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      mobile: data.mobile,
    },
  });

  if (existingUser) {
    const error = new Error("User with this mobile already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword =
    await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name,
      mobile: data.mobile,
      password: hashedPassword,
      role: data.role,
    },
  });
};

const loginUser = async ({
  mobile,
  password,
}) => {
  // Defensive validation: ensure `mobile` is a non-empty string
  if (!mobile || (typeof mobile !== "string" && typeof mobile !== "number")) {
    const error = new Error("Mobile is required");
    error.statusCode = 400;
    throw error;
  }

  const mobileStr = String(mobile).trim();

  if (!mobileStr) {
    const error = new Error("Mobile is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: {
      mobile: mobileStr,
    },
  });

  if (!user) {
    const error = new Error("Invalid mobile or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("User account is inactive");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid =
    await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid mobile or password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken,
    },
  });

  return {
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      mobile: updatedUser.mobile,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      mobile: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = {
  createUser,
  loginUser,
  getUserProfile,
};
