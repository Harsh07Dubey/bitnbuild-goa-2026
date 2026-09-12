const express = require("express");
const {
  register,
  verifyPhoneOtp,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyPhoneOtp);

module.exports = router;