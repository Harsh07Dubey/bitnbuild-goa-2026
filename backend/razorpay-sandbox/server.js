import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.sandbox or fallback to .env
dotenv.config({ path: path.join(__dirname, '.env.sandbox') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_TapGP2kHFhqm7a';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '9E0GsKSpi96UCDAnWH5UUSj1';

const allowedOrigins = [
  'https://bitnbuild-goa-2026.vercel.app',
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /^https:\/\/bitnbuild-goa-2026.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.use(express.json());

let razorpayInstance = null;
try {
  razorpayInstance = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET
  });
  console.log(`[Razorpay Sandbox] Initialized with Key ID: ${KEY_ID.slice(0, 8)}...`);
} catch (err) {
  console.error('[Razorpay Sandbox] Initialization error:', err.message);
}

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CreditFlow Isolated Razorpay Sandbox',
    port: PORT,
    keyConfigured: Boolean(KEY_ID && KEY_SECRET)
  });
});

app.get('/api/razorpay/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CreditFlow Isolated Razorpay Sandbox',
    port: PORT,
    keyConfigured: Boolean(KEY_ID && KEY_SECRET)
  });
});

/**
 * POST /api/razorpay/create-order
 * Generates an official server-side Razorpay Order
 */
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', contractId = 'CON-001' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Valid amount in paise is required.' });
    }

    if (!razorpayInstance) {
      return res.status(500).json({ success: false, error: 'Razorpay SDK is not initialized.' });
    }

    const options = {
      amount: Math.round(amount), // in paise
      currency,
      receipt: `rcpt_${contractId}_${Date.now()}`,
      notes: {
        contract_id: contractId,
        protocol: 'FairFuture Dynamic Revenue Split'
      }
    };

    const order = await razorpayInstance.orders.create(options);
    console.log(`[Razorpay Sandbox] Order created successfully: ${order.id} for ₹${amount / 100}`);

    return res.json({
      success: true,
      order,
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    console.error('[Razorpay Sandbox] Order creation failed:', err.message);
    return res.status(500).json({
      success: false,
      error: err.error?.description || err.message || 'Failed to create order'
    });
  }
});

/**
 * POST /api/razorpay/verify
 * Validates HMAC SHA256 payment signature
 */
app.post('/api/razorpay/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required signature verification parameters.'
      });
    }

    const expectedSignature = crypto
      .createHmac('sha256', KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      console.log(`[Razorpay Sandbox] Signature verified for payment: ${razorpay_payment_id}`);
      return res.json({
        success: true,
        verified: true,
        paymentId: razorpay_payment_id
      });
    } else {
      console.warn(`[Razorpay Sandbox] Signature mismatch for payment: ${razorpay_payment_id}`);
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Signature verification failed.'
      });
    }
  } catch (err) {
    console.error('[Razorpay Sandbox] Verification error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Razorpay Sandbox Helper running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Create Order: POST http://localhost:${PORT}/api/razorpay/create-order`);
  console.log(`=======================================================`);
});
