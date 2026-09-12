const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  createContract,
  getContracts,
  getContractById,
} = require("../controllers/contract.controller");

const router = express.Router();

router.post("/", authMiddleware, createContract);
router.get("/", authMiddleware, getContracts);
router.get("/:contractId", authMiddleware, getContractById);

module.exports = router;