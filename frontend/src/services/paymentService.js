/**
 * Payment & Split Settlement Service
 * CreditFlow / FairFuture Core Settlement Engine
 * 
 * Rules:
 * - Gross: 100%
 * - Merchant Share: 84%
 * - Investor Pool Repayment: 15%
 * - Protocol / Platform Fee: 1%
 */
import api from './api.js';

export const DEFAULT_SPLIT_RULES = {
  merchantPct: 0.84,
  investorPct: 0.15,
  platformFeePct: 0.01
};

// In-memory / sessionStorage store for simulation sessions
const TRANSACTION_STORAGE_KEY = 'fairfuture_transactions';

function getStoredTransactions() {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return [];
    const raw = sessionStorage.getItem(TRANSACTION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTransaction(tx) {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return;
    const existing = getStoredTransactions();
    const updated = [tx, ...existing].slice(0, 50);
    sessionStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not persist transaction to sessionStorage', e);
  }
}

/**
 * Synchronously computes exact split down to 2 decimal places.
 * 
 * @param {number|string} grossAmount 
 * @param {number} sharePct (e.g. 0.15)
 * @param {number} platformFeePct (e.g. 0.01)
 * @returns {object} Split breakdown
 */
export function calculateSplit(grossAmount, sharePct = 0.15, platformFeePct = 0.01) {
  const gross = Math.max(0, typeof grossAmount === 'string' ? parseFloat(grossAmount.replace(/[^0-9.-]+/g, '')) || 0 : Number(grossAmount) || 0);

  // Calculate investor pool and platform fees first
  const investor = parseFloat((gross * sharePct).toFixed(2));
  const platformFee = parseFloat((gross * platformFeePct).toFixed(2));

  // Merchant gets remaining amount to guarantee exact balance down to the last cent
  const merchant = parseFloat((gross - investor - platformFee).toFixed(2));

  return {
    gross: parseFloat(gross.toFixed(2)),
    merchant,
    investor,
    platformFee,
    merchantPct: Math.round((1 - sharePct - platformFeePct) * 100),
    investorPct: Math.round(sharePct * 100),
    platformFeePct: Math.round(platformFeePct * 100)
  };
}

/**
 * Executes or simulates POST /api/payments/create
 * 
 * @param {object} params
 * @param {string} params.contractId - e.g. "CON-001"
 * @param {number|string} params.amount - Gross transaction amount
 * @param {string} [params.method] - Payment method e.g. "UPI"
 * @param {string} [params.paymentMethod] - Alternate key for payment method
 * @param {string} [params.customerName] - Optional customer name
 * @param {string} [params.merchantName] - Optional merchant name
 * @returns {Promise<object>} Structured transaction response
 */
export async function createPayment({
  contractId = 'CON-001',
  amount = 500,
  method = 'UPI',
  paymentMethod,
  customerName = 'Test Customer',
  merchantName = 'Sharma General Store'
}) {
  const activeMethod = paymentMethod || method || 'UPI';
  const gross = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) || 0 : Number(amount) || 0;
  const split = calculateSplit(gross);

  try {
    const res = await api.post('/payments/create', {
      contractId,
      amount: gross,
      method: activeMethod,
      customerName,
      merchantName,
      split
    });
    if (res.data?.transaction) {
      saveTransaction(res.data.transaction);
      return res.data.transaction;
    }
    if (res.data?.reference) {
      saveTransaction(res.data);
      return res.data;
    }
  } catch (err) {
    console.warn('[paymentService] createPayment falling back to mock simulator:', err.message);
  }

  // Simulated fallback settlement execution
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const randomRefDigits = Math.floor(100000 + Math.random() * 900000);
  const reference = `PAY-${randomRefDigits}`;

  const transaction = {
    success: true,
    reference,
    id: `TXN-${randomRefDigits}`,
    contractId,
    merchantName,
    customerName,
    amount: split.gross,
    grossSale: split.gross,
    paymentMethod: activeMethod,
    method: activeMethod,
    merchantRate: 0.84,
    investorRate: 0.15,
    platformRate: 0.01,
    split,
    timestamp: new Date().toISOString(),
    dateTime: 'Just now',
    formattedDate: new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date()),
    status: 'SPLIT COMPLETED',
    recordStatus: 'RECORD SEALED',
    escrowAccount: 'ESCROW-IN-001-SETTLED'
  };

  saveTransaction(transaction);
  return transaction;
}

/**
 * Fetch transaction settlement ledger for a specific contract or LP pool
 * GET /api/contracts/:contractId/transactions
 */
export async function fetchTransactions(contractId = 'CON-001') {
  try {
    const res = await api.get(`/contracts/${contractId}/transactions`);
    return res.data?.transactions || res.data || getRecentPayments();
  } catch (err) {
    console.warn(`[paymentService] fetchTransactions(${contractId}) falling back to mock:`, err.message);
    return getRecentPayments();
  }
}

/**
 * Retrieve transaction details by reference
 * 
 * @param {string} reference 
 * @returns {object|null}
 */
export function getPaymentDetails(reference) {
  if (!reference) return null;
  const txs = getStoredTransactions();
  const match = txs.find((tx) => tx.reference === reference || tx.id === reference);
  if (match) return match;

  return null;
}

/**
 * Get recent payments list
 */
export function getRecentPayments() {
  const txs = getStoredTransactions();
  if (txs.length > 0) return txs;

  const defaultSeeds = [
    {
      id: 'TXN-4920421',
      reference: 'PAY-4920421',
      contractId: 'CON-001',
      merchantName: 'Sharma General Store',
      dateTime: 'Today, 02:40 PM',
      rawDate: '2026-09-12T14:40:00',
      grossSale: 500,
      amount: 500,
      merchantRate: 0.84,
      investorRate: 0.15,
      platformRate: 0.01,
      status: 'SPLIT COMPLETED',
      method: 'UPI QR (GPay)',
      split: calculateSplit(500)
    },
    {
      id: 'TXN-4920419',
      reference: 'PAY-4920419',
      contractId: 'CON-001',
      merchantName: 'Sharma General Store',
      dateTime: 'Today, 01:15 PM',
      rawDate: '2026-09-12T13:15:00',
      grossSale: 1250,
      amount: 1250,
      merchantRate: 0.84,
      investorRate: 0.15,
      platformRate: 0.01,
      status: 'SPLIT COMPLETED',
      method: 'UPI QR (PhonePe)',
      split: calculateSplit(1250)
    },
    {
      id: 'TXN-4920404',
      reference: 'PAY-4920404',
      contractId: 'CON-001',
      merchantName: 'Sharma General Store',
      dateTime: 'Today, 11:30 AM',
      rawDate: '2026-09-12T11:30:00',
      grossSale: 350,
      amount: 350,
      merchantRate: 0.84,
      investorRate: 0.15,
      platformRate: 0.01,
      status: 'Settled',
      method: 'UPI QR (Paytm)',
      split: calculateSplit(350)
    },
    {
      id: 'TXN-4920388',
      reference: 'PAY-4920388',
      contractId: 'CON-001',
      merchantName: 'Sharma General Store',
      dateTime: 'Today, 10:05 AM',
      rawDate: '2026-09-12T10:05:00',
      grossSale: 2400,
      amount: 2400,
      merchantRate: 0.84,
      investorRate: 0.15,
      platformRate: 0.01,
      status: 'SPLIT COMPLETED',
      method: 'UPI QR (BHIM)',
      split: calculateSplit(2400)
    },
    {
      id: 'TXN-4920352',
      reference: 'PAY-4920352',
      contractId: 'CON-001',
      merchantName: 'Sharma General Store',
      dateTime: 'Yesterday, 08:50 PM',
      rawDate: '2026-09-11T20:50:00',
      grossSale: 850,
      amount: 850,
      merchantRate: 0.84,
      investorRate: 0.15,
      platformRate: 0.01,
      status: 'Settled',
      method: 'UPI QR (GPay)',
      split: calculateSplit(850)
    }
  ];

  return defaultSeeds;
}

/**
 * Create a live Razorpay order for contract repayment split
 * POST /api/contracts/:contractId/payment/order
 */
export async function createPaymentOrder(contractId, { amount }) {
  try {
    const res = await api.post(`/contracts/${contractId}/payment/order`, {
      amount: Number(amount),
    });
    return res.data;
  } catch (err) {
    console.warn(`[paymentService] createPaymentOrder(${contractId}) backend call failed, fallback order generated:`, err.message);
    const gross = Number(amount) || 500;
    return {
      success: true,
      order: {
        id: `order_${Date.now().toString(36)}`,
        amount: gross * 100, // in paise
        currency: 'INR',
        receipt: `rcpt_${contractId}_${Date.now().toString(36)}`,
      },
      key_id: 'rzp_test_mock',
    };
  }
}

/**
 * Dispatch simulated Razorpay webhook payload
 * POST /api/razorpay/webhook
 */
export async function sendWebhook(webhookPayload) {
  try {
    const res = await api.post('/razorpay/webhook', webhookPayload);
    return res.data;
  } catch (err) {
    console.warn('[paymentService] sendWebhook failed:', err.message);
    return { success: true, message: 'Webhook simulation acknowledged.' };
  }
}

export default {
  DEFAULT_SPLIT_RULES,
  calculateSplit,
  createPayment,
  createPaymentOrder,
  sendWebhook,
  fetchTransactions,
  getPaymentDetails,
  getRecentPayments,
};

