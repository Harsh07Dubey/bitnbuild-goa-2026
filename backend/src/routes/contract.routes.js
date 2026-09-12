const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createContract,
} = require("../controllers/contract.controller");
const { CreateDataMappingInput } = require("twilio/lib/rest/memory/v1/dataMapping");

const router = express.Router();

router.post("/", authMiddleware, createContract);

module.exports = router;