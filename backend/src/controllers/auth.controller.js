const bcrypt = require("bcryptjs");

const prisma = require("../config/prisma");
const { sendOtp, verifyOtp } = require("../services/otp.service");

const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, password and role are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const allowedRoles = ["MERCHANT", "INVESTOR"];

    if (!allowedRoles.includes(role.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        password_hash: passwordHash,
        role: role.toUpperCase(),
        verified_flag: false,
      },
    });

    await sendOtp(user.user_id, user.phone);

    return res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to your phone.",
      user_id: user.user_id,
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
    const { user_id, otp } = req.body;

    if (!user_id || !otp) {
      return res.status(400).json({
        success: false,
        message: "user_id and otp are required",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be a 6-digit number",
      });
    }

    const result = await verifyOtp(user_id, otp);

    return res.status(200).json(result);
  } catch (error) {
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
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

    if (!user.verified_flag) {
      return res.status(403).json({
        success: false,
        message: "Please verify your phone number before logging in",
      });
    }

    const jwt = require("jsonwebtoken");

    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
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
        role: user.role,
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