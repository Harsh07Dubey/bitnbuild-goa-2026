const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const contractRoutes = require("./src/routes/contract.routes");
const fundingRoutes = require("./src/routes/funding.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api", fundingRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "FairFuture backend is running",
  });
});

module.exports = app;