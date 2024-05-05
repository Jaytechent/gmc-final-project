const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const { registerUser, loginUser , generateResetToken,resetPassword} = require("../controllers/userControllers");

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
router.post("/auth/generate-reset-token", generateResetToken);
router.post("/auth/reset-password", resetPassword);
module.exports = router;
