const express = require("express");
const {
  handleRazorpayWebhook,
} = require("../controllers/payment.webhook.controller");

const router = express.Router();

router.post("/razorpay/webhook", handleRazorpayWebhook);

module.exports = router;