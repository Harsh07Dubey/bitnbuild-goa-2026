const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { getTrustScore } = require("../controllers/ai.controller");

const router = express.Router();

router.post("/trust-score", authMiddleware, getTrustScore);

module.exports = router;