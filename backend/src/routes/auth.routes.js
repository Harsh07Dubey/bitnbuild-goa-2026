const express = require("express");
const {
  register,
  verifyPhoneOtp,
  login,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyPhoneOtp);
router.post("/login", login);

module.exports = router;