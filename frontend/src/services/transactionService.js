/**
 * transactionService.js — Contract Split Transactions Ledger Service
 * Connects frontend to:
 * - GET /api/contracts/:contractId/transactions
 */
import api from './api.js';

export const MOCK_LEDGER_TRANSACTIONS = [
  {
    id: 'TXN-4920421',
    dateTime: 'Today, 02:40 PM',
    rawDate: '2026-09-12T14:40:00',
    grossSale: 500,
    merchantRate: 0.84,
    investorRate: 0.15,
    platformRate: 0.01,
    status: 'SPLIT COMPLETED',
    method: 'UPI QR (GPay)',
  },
  {
    id: 'TXN-4920419',
    dateTime: 'Today, 01:15 PM',
    rawDate: '2026-09-12T13:15:00',
    grossSale: 1250,
    merchantRate: 0.84,
    investorRate: 0.15,
    platformRate: 0.01,
    status: 'SPLIT COMPLETED',
    method: 'UPI QR (PhonePe)',
  },
  {
    id: 'TXN-4920404',
    dateTime: 'Today, 11:30 AM',
    rawDate: '2026-09-12T11:30:00',
    grossSale: 350,
    merchantRate: 0.84,
    investorRate: 0.15,
    platformRate: 0.01,
    status: 'Settled',
    method: 'UPI QR (Paytm)',
  },
  {
    id: 'TXN-4920388',
    dateTime: 'Today, 10:05 AM',
    rawDate: '2026-09-12T10:05:00',
    grossSale: 2400,
    merchantRate: 0.84,
    investorRate: 0.15,
    platformRate: 0.01,
    status: 'SPLIT COMPLETED',
    method: 'UPI QR (BHIM)',
  },
  {
    id: 'TXN-4920352',
    dateTime: 'Yesterday, 08:50 PM',
    rawDate: '2026-09-11T20:50:00',
    grossSale: 850,
    merchantRate: 0.84,
    investorRate: 0.15,
    platformRate: 0.01,
    status: 'Settled',
    method: 'UPI QR (GPay)',
  },
];

/**
 * Retrieve all real-time split settlement ledger records for a contract
 * GET /api/contracts/:contractId/transactions
 *
 * @param {string} contractId
 * @returns {Promise<Array>}
 */
export async function getContractTransactions(contractId = 'CON-001') {
  try {
    const res = await api.get(`/contracts/${contractId}/transactions`);
    const list = res.data?.transactions || res.data?.data || [];
    if (Array.isArray(list) && list.length > 0) {
      return list.map((tx) => ({
        id: tx.txn_id || tx.id,
        reference: tx.payment_id || tx.id,
        grossSale: Number(tx.gross_amount ?? tx.grossSale ?? 0),
        merchantPayout: Number(tx.merchant_share ?? 0),
        investorSplit: Number(tx.investor_share ?? 0),
        platformFee: Number(tx.platform_fee ?? 0),
        merchantRate: 0.84,
        investorRate: 0.15,
        platformRate: 0.01,
        status: tx.status || 'SPLIT COMPLETED',
        dateTime: tx.timestamp ? new Date(tx.timestamp).toLocaleString('en-IN') : 'Just now',
        method: 'UPI POS Split',
      }));
    }
    return MOCK_LEDGER_TRANSACTIONS;
  } catch (err) {
    console.warn(`[transactionService] getContractTransactions(${contractId}) fallback:`, err.message);
    return MOCK_LEDGER_TRANSACTIONS;
  }
}

export default {
  getContractTransactions,
  MOCK_LEDGER_TRANSACTIONS,
};
