const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  createContract,
  getContracts,
} = require("../controllers/contract.controller");

const router = express.Router();

router.post("/", authMiddleware, createContract);
router.get("/", authMiddleware, getContracts);

module.exports = router;