const bcrypt = require("bcryptjs");
const twilio = require("twilio");
const crypto = require("crypto");

const prisma = require("../config/prisma");

const OTP_EXPIRY_MINUTES = 5;

const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const sendOtp = async (userId, phone) => {
  const otp = generateOtp();

  const otpHash = await bcrypt.hash(otp, 10);

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );

  await prisma.user.update({
    where: {
      user_id: userId,
    },
    data: {
      otp_hash: otpHash,
      otp_expires_at: expiresAt,
      otp_attempts: 0,
      otp_last_sent_at: new Date(),
    },
  });
  
  if (process.env.OTP_TEST_MODE === "true") {
    console.log(`[OTP TEST MODE] User: ${userId} | OTP: ${otp}`);
  } else {
    const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
            body: `Your FairFuture verification OTP is ${otp}. It expires in 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
    });
  }

  return {
    success: true,
    expiresAt,
  };
};

const verifyOtp = async (userId, otp) => {
  const user = await prisma.user.findUnique({
    where: {
      user_id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.otp_hash || !user.otp_expires_at) {
    throw new Error("OTP not found. Please request a new OTP.");
  }

  if (new Date() > user.otp_expires_at) {
    throw new Error("OTP has expired");
  }

  if (user.otp_attempts >= 5) {
    throw new Error("Too many OTP attempts");
  }

  const isValid = await bcrypt.compare(otp, user.otp_hash);

  if (!isValid) {
    await prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        otp_attempts: {
          increment: 1,
        },
      },
    });

    throw new Error("Invalid OTP");
  }

  await prisma.user.update({
    where: {
      user_id: userId,
    },
    data: {
      verified_flag: true,
      otp_hash: null,
      otp_expires_at: null,
      otp_attempts: 0,
    },
  });

  return {
    success: true,
    message: "Phone number verified successfully",
  };
};

module.exports = {
  generateOtp,
  sendOtp,
  verifyOtp,
};