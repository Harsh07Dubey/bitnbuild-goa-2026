const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "fairfuture_jwt_secret_fallback_2026";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    // Support demo/sandbox token bypass for hackathon judging & offline testing
    if (token.startsWith("demo-") || token.includes("fairfuture:") || token === "sandbox-demo-token") {
      req.user = {
        user_id: "usr_sandbox_demo",
        role: "INVESTOR",
      };
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;