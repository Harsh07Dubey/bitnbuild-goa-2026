/**
 * authService.js — FairFuture Authentication Service Layer
 * Simulates POST /api/auth/send-otp, POST /api/auth/verify-otp, POST /api/merchants
 */

const DEMO_OTP = '582900';
const SIMULATED_DELAY_MS = 700;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ─── OTP SEND ────────────────────────────────────────────────────────────────

/**
 * Simulate POST /api/auth/send-otp
 * @param {string} phone - 10-digit Indian mobile number
 */
export async function sendOtp(phone) {
  await delay(SIMULATED_DELAY_MS);

  if (!phone || phone.replace(/\D/g, '').length !== 10) {
    throw new Error('Please enter a valid 10-digit mobile number.');
  }

  // In real mode, backend would dispatch the OTP via SMS/Twilio
  console.info(`[authService] OTP sent to +91${phone}. Demo code: ${DEMO_OTP}`);

  return {
    success: true,
    phone,
    message: `OTP sent to +91 ${phone}`,
    demoOtp: DEMO_OTP, // expose for hackathon sandbox UI hint
  };
}

// ─── OTP VERIFY ──────────────────────────────────────────────────────────────

/**
 * Simulate POST /api/auth/verify-otp
 * @param {string} phone
 * @param {string} code - 6-digit OTP
 */
export async function verifyOtp(phone, code) {
  await delay(SIMULATED_DELAY_MS);

  if (!code || code.length !== 6) {
    throw new Error('Please enter the complete 6-digit OTP code.');
  }

  // Accept any 6-digit numeric code in demo mode
  const isValid = /^\d{6}$/.test(code);
  if (!isValid) {
    throw new Error('OTP must be a 6-digit numeric code.');
  }

  // Generate a deterministic mock JWT token based on phone number
  const token = btoa(`fairfuture:${phone}:${Date.now()}`);

  return {
    success: true,
    token,
    phone,
    message: 'OTP verified successfully.',
    newUser: true, // In sandbox, always treat as new user for onboarding
  };
}

// ─── MERCHANT REGISTRATION ───────────────────────────────────────────────────

/**
 * Simulate POST /api/merchants
 * @param {{ phone: string, stallName: string, shopAddress: string, category: string }} profileData
 */
export async function registerMerchant(profileData) {
  await delay(SIMULATED_DELAY_MS);

  const { phone, stallName, shopAddress, category } = profileData;

  if (!stallName?.trim()) throw new Error('Shop name is required.');
  if (!shopAddress?.trim()) throw new Error('Shop address is required.');
  if (!category?.trim()) throw new Error('Business category is required.');

  const merchantId = `MCH-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    success: true,
    merchantId,
    profile: {
      phone,
      stallName: stallName.trim(),
      shopAddress: shopAddress.trim(),
      category,
      role: 'merchant',
      contractId: 'CON-001', // Default linked contract for demo
      verifiedAt: new Date().toISOString(),
    },
    message: 'Merchant profile registered successfully.',
  };
}

// ─── LOGOUT ──────────────────────────────────────────────────────────────────

export async function logoutUser() {
  await delay(200);
  return { success: true };
}

export const DEMO_OTP_CODE = DEMO_OTP;

export default {
  sendOtp,
  verifyOtp,
  registerMerchant,
  logoutUser,
  DEMO_OTP_CODE,
};
