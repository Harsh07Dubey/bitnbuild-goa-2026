const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  getContractTransactions,
} = require("../controllers/transaction.controller");

const router = express.Router();

router.get(
  "/contracts/:contractId/transactions",
  authMiddleware,
  getContractTransactions
);

module.exports = router;