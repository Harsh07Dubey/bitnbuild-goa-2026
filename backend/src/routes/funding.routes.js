const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  createFunding,
  getContractFundings,
  getInvestorFundings,
} = require("../controllers/funding.controller");

const router = express.Router();

router.post(
  "/contracts/:contractId/fund",
  authMiddleware,
  createFunding
);

router.get(
  "/contracts/:contractId/funding",
  authMiddleware,
  getContractFundings
);

router.get(
  "/investors/:investorId/fundings",
  authMiddleware,
  getInvestorFundings
);

module.exports = router;