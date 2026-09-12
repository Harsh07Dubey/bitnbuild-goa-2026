const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  getMerchantDashboard,
  getInvestorDashboard,
} = require("../controllers/dashboard.controller");

const router = express.Router();

router.get(
  "/dashboard/merchant",
  authMiddleware,
  getMerchantDashboard
);

router.get(
  "/dashboard/investor",
  authMiddleware,
  getInvestorDashboard
);

module.exports = router;