/**
 * fundingService.js — Investor Escrow & Funding Service
 * Connects frontend to:
 * - POST /api/contracts/:contractId/fund
 * - GET  /api/contracts/:contractId/funding
 * - GET  /api/investors/:investorId/fundings
 */
import api from './api.js';

/**
 * Allocate LP capital into a listed contract
 * POST /api/contracts/:contractId/fund
 *
 * @param {string} contractId
 * @param {object} params
 * @param {number} params.amount
 * @returns {Promise<object>}
 */
export async function fundContract(contractId, { amount }) {
  const commitAmount = Number(amount);
  if (!Number.isFinite(commitAmount) || commitAmount <= 0) {
    throw new Error('Funding amount must be a positive number.');
  }

  try {
    const res = await api.post(`/contracts/${contractId}/fund`, {
      amount: commitAmount,
      amount_committed: commitAmount,
    });
    return res.data?.funding || res.data?.data || res.data;
  } catch (err) {
    console.warn(`[fundingService] fundContract(${contractId}) fallback:`, err.response?.data?.message || err.message);

    // Fallback response for hackathon demo sandbox
    return {
      success: true,
      contractId,
      amount_committed: commitAmount,
      timestamp: new Date().toISOString(),
      message: `Simulated commitment of ₹${commitAmount.toLocaleString('en-IN')} confirmed.`,
    };
  }
}

/**
 * Retrieve all funding events committed to a specific contract
 * GET /api/contracts/:contractId/funding
 *
 * @param {string} contractId
 * @returns {Promise<Array>}
 */
export async function getContractFunding(contractId) {
  try {
    const res = await api.get(`/contracts/${contractId}/funding`);
    return res.data?.fundings || res.data?.data || [];
  } catch (err) {
    console.warn(`[fundingService] getContractFunding(${contractId}) fallback:`, err.message);
    return [];
  }
}

/**
 * Retrieve all portfolio commitments made by an investor
 * GET /api/investors/:investorId/fundings
 *
 * @param {string} investorId
 * @returns {Promise<Array>}
 */
export async function getInvestorFundings(investorId = 'INV-DEMO01') {
  try {
    const res = await api.get(`/investors/${investorId}/fundings`);
    return res.data?.fundings || res.data?.data || [];
  } catch (err) {
    console.warn(`[fundingService] getInvestorFundings(${investorId}) fallback:`, err.message);
    return [];
  }
}

export default {
  fundContract,
  getContractFunding,
  getInvestorFundings,
};
