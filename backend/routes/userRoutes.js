const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userControllers");

router.post(
  "/auth/register",
  [
    check("name").trim().notEmpty(),
    check("email").isEmail(),
    check("password").isStrongPassword(),
  ],
  registerUser
);

router.post(
  "/auth/login",
  // [check("email").isEmail(), check("password").isStrongPassword],
  loginUser
);
router.post("/generate-reset-token", userControllers.generateResetToken);

module.exports = router;
