const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  createFunding,
} = require("../controllers/funding.controller");

const router = express.Router();

router.post(
  "/contracts/:contractId/fund",
  authMiddleware,
  createFunding
);

module.exports = router;