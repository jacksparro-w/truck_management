const router = require("express").Router();

const authMiddleware = require("../../middleware/auth.middleware");
const {
  createUserValidation,
  loginValidation,
} = require("./auth.validation");
const {
  createUser,
  login,
  me,
} = require("./auth.controller");

router.post("/create-user", createUserValidation, createUser);
router.post("/login", loginValidation, login);
router.get("/me", authMiddleware, me);

module.exports = router;
