const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");
const { sendOtp, verifyOtp } = require("../services/otp.service");

const JWT_SECRET = process.env.JWT_SECRET || "fairfuture_jwt_secret_fallback_2026";

const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and role are required",
      });
    }

    const normalizedPhone = String(phone).trim().replace(/\D/g, "").slice(-10);
    const normalizedEmail = email
      ? email.trim().toLowerCase()
      : `${normalizedPhone}@fairfuture.internal`;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { phone: normalizedPhone },
        ],
      },
    });

    const allowedRoles = ["MERCHANT", "INVESTOR"];
    const targetRole = role.toUpperCase();

    if (!allowedRoles.includes(targetRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be MERCHANT or INVESTOR",
      });
    }

    const userPassword = password || "DefaultPass@123";
    const passwordHash = await bcrypt.hash(userPassword, 10);

    let user;
    if (existingUser) {
      user = await prisma.user.update({
        where: { user_id: existingUser.user_id },
        data: {
          name: name.trim(),
          role: targetRole,
          password_hash: passwordHash,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          phone: normalizedPhone,
          password_hash: passwordHash,
          role: targetRole,
          verified_flag: false,
        },
      });
    }

    const otpData = await sendOtp(user.user_id, user.phone);

    return res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to your phone.",
      user_id: user.user_id,
      phone: user.phone,
      role: user.role.toLowerCase(),
      demoOtp: otpData?.otp || "582900",
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

const verifyPhoneOtp = async (req, res) => {
  try {
    const { user_id, phone, otp } = req.body;

    if ((!user_id && !phone) || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone (or user_id) and OTP are required",
      });
    }

    const cleanOtp = String(otp).trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be a 6-digit number",
      });
    }

    let user = null;
    if (user_id) {
      user = await prisma.user.findUnique({
        where: { user_id },
      });
    }
    if (!user && phone) {
      const normalizedPhone = String(phone).trim().replace(/\D/g, "").slice(-10);
      user = await prisma.user.findFirst({
        where: { phone: normalizedPhone },
      });
    }

    if (!user) {
      if (phone) {
        const normalizedPhone = String(phone).trim().replace(/\D/g, "").slice(-10);
        const placeholderEmail = `${normalizedPhone}@fairfuture.internal`;
        const placeholderPassword = await bcrypt.hash(`Pass@${normalizedPhone}`, 10);
        user = await prisma.user.create({
          data: {
            name: "Verified User",
            email: placeholderEmail,
            phone: normalizedPhone,
            password_hash: placeholderPassword,
            role: "INVESTOR",
            verified_flag: true,
          },
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    }

    await verifyOtp(user.user_id, cleanOtp);

    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        phone: user.phone,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Phone number verified successfully",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role.toLowerCase(),
        verified_flag: true,
      },
    });
  } catch (error) {
    console.error("verifyPhoneOtp error:", error);
    const clientErrors = [
      "User not found",
      "OTP not found. Please request a new OTP.",
      "OTP has expired",
      "Too many OTP attempts",
      "Invalid OTP",
    ];

    const statusCode = clientErrors.includes(error.message) ? 400 : 500;

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? "OTP verification failed"
          : error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, phone, role } = req.body;

    // 1. Phone-based Login Flow
    if (phone && !password) {
      const normalizedPhone = String(phone).trim().replace(/\D/g, "").slice(-10);
      if (normalizedPhone.length !== 10) {
        return res.status(400).json({
          success: false,
          message: "A valid 10-digit phone number is required",
        });
      }

      let user = await prisma.user.findFirst({
        where: { phone: normalizedPhone },
      });

      if (!user) {
        const userRole = (role || "INVESTOR").toUpperCase();
        const placeholderEmail = `${normalizedPhone}@fairfuture.internal`;
        const placeholderPassword = await bcrypt.hash(`Pass@${normalizedPhone}`, 10);

        user = await prisma.user.create({
          data: {
            name: req.body.name?.trim() || (userRole === "MERCHANT" ? "Merchant Partner" : "Investor Partner"),
            email: placeholderEmail,
            phone: normalizedPhone,
            password_hash: placeholderPassword,
            role: userRole === "MERCHANT" ? "MERCHANT" : "INVESTOR",
            verified_flag: false,
          },
        });
      }

      const otpData = await sendOtp(user.user_id, user.phone);

      return res.status(200).json({
        success: true,
        message: `OTP sent to +91 ${user.phone}`,
        user_id: user.user_id,
        phone: user.phone,
        role: user.role.toLowerCase(),
        demoOtp: otpData?.otp || "582900",
      });
    }

    // 2. Email & Password Flow
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password (or phone) are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        phone: user.phone,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role.toLowerCase(),
        verified_flag: user.verified_flag,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

module.exports = {
  register,
  verifyPhoneOtp,
  login,
};