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
 * Simulates backend POST /api/payments/create
 * 
 * @param {object} params
 * @param {string} params.contractId - e.g. "CON-001"
 * @param {number|string} params.amount - Gross transaction amount
 * @param {string} params.paymentMethod - e.g. "UPI" or "Card"
 * @param {string} [params.customerName] - Optional customer name
 * @param {string} [params.merchantName] - Optional merchant name
 * @returns {Promise<object>} Structured transaction response
 */
export async function createPayment({
  contractId = 'CON-001',
  amount = 500,
  paymentMethod = 'UPI Test Simulator',
  customerName = 'Test Customer',
  merchantName = 'Sharma General Store'
}) {
  // Simulate network latency (500ms - 800ms)
  await new Promise((resolve) => setTimeout(resolve, 650));

  const gross = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) || 0 : Number(amount) || 0;
  const split = calculateSplit(gross);
  
  // Synthetic reference: PAY- + random 6-digit number
  const randomRefDigits = Math.floor(100000 + Math.random() * 900000);
  const reference = `PAY-${randomRefDigits}`;

  const transaction = {
    success: true,
    reference,
    contractId,
    merchantName,
    customerName,
    amount: split.gross,
    paymentMethod,
    split,
    timestamp: new Date().toISOString(),
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
 * Retrieve transaction details by reference
 * 
 * @param {string} reference 
 * @returns {object|null}
 */
export function getPaymentDetails(reference) {
  if (!reference) return null;
  const txs = getStoredTransactions();
  const match = txs.find((tx) => tx.reference === reference);
  if (match) return match;

  // Fallback synthetic if loaded directly via URL query params
  return null;
}

/**
 * Get recent payments list
 */
export function getRecentPayments() {
  const txs = getStoredTransactions();
  if (txs.length > 0) return txs;

  // Default seed transactions if empty
  const defaultSeeds = [
    {
      reference: 'PAY-831920',
      contractId: 'CON-001',
      merchantName: 'Sharma General Store',
      amount: 500.00,
      paymentMethod: 'UPI',
      split: calculateSplit(500),
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      formattedDate: '12 Sep 2026, 10:48 AM',
      status: 'SPLIT COMPLETED'
    },
    {
      reference: 'PAY-712495',
      contractId: 'CON-001',
      merchantName: 'Sharma General Store',
      amount: 1200.00,
      paymentMethod: 'UPI',
      split: calculateSplit(1200),
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      formattedDate: '12 Sep 2026, 10:15 AM',
      status: 'SPLIT COMPLETED'
    },
    {
      reference: 'PAY-492104',
      contractId: 'CON-001',
      merchantName: 'Sharma General Store',
      amount: 250.00,
      paymentMethod: 'UPI',
      split: calculateSplit(250),
      timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
      formattedDate: '12 Sep 2026, 09:10 AM',
      status: 'SPLIT COMPLETED'
    }
  ];

  return defaultSeeds;
}

export default {
  DEFAULT_SPLIT_RULES,
  calculateSplit,
  createPayment,
  getPaymentDetails,
  getRecentPayments
};
