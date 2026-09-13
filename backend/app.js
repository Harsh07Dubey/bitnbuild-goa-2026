const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const contractRoutes = require("./src/routes/contract.routes");
const fundingRoutes = require("./src/routes/funding.routes");
const aiRoutes = require("./src/routes/ai.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const paymentWebhookRoutes = require("./src/routes/payment.webhook.routes");
const transactionRoutes = require("./src/routes/transaction.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");

const app = express();

const allowedOrigins = [
  "https://bitnbuild-goa-2026.vercel.app",
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/bitnbuild-goa-2026.*\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};

app.use(cors(corsOptions));
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api", fundingRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", paymentRoutes);
app.use("/api", paymentWebhookRoutes);
app.use("/api", transactionRoutes);
app.use("/api", dashboardRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "FairFuture backend is running",
  });
});

module.exports = app;