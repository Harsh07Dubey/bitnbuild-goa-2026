const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { createPaymentOrder } = require("../controllers/payment.controller");

const router = express.Router();

router.post(
  "/contracts/:contractId/payment/order",
  authMiddleware,
  createPaymentOrder
);

module.exports = router;