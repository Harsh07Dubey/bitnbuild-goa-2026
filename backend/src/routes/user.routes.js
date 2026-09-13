const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    if (req.user?.user_id && req.user.user_id !== "usr_sandbox_demo") {
      const user = await prisma.user.findUnique({
        where: { user_id: req.user.user_id },
        select: {
          user_id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          verified_flag: true,
          trust_score: true,
        },
      });

      if (user) {
        return res.status(200).json({
          success: true,
          message: "Authenticated user",
          user: {
            ...user,
            role: user.role.toLowerCase(),
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Authenticated user",
      user: {
        ...req.user,
        role: (req.user?.role || "investor").toLowerCase(),
      },
    });
  } catch (err) {
    console.error("GET /users/me error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
});

module.exports = router;