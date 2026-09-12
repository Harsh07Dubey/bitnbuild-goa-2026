const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  createContract,
  getContracts,
  getContractById,
  updateContract,
  listContract,
} = require("../controllers/contract.controller");

const router = express.Router();

router.post("/", authMiddleware, createContract);
router.get("/", authMiddleware, getContracts);
router.get("/:contractId", authMiddleware, getContractById);
router.patch("/:contractId", authMiddleware, updateContract);
router.post("/:contractId/list", authMiddleware, listContract);

module.exports = router;