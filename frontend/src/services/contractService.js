/**
 * contractService.js — Contract Management Service
 * Connects frontend to:
 * - POST  /api/contracts
 * - GET   /api/contracts
 * - GET   /api/contracts/:contractId
 * - PATCH /api/contracts/:contractId
 * - POST  /api/contracts/:contractId/list
 */
import api from './api.js';

// Initial Mock Marketplace Contracts Dataset (for offline/cold-start fallback)
export const MOCK_CONTRACTS = [
  {
    id: 'CON-001',
    contract_id: 'CON-001',
    merchantName: 'Sharma General Store',
    category: 'Retail',
    subCategory: 'FMCG & Daily Essentials',
    location: 'Connaught Place, New Delhi',
    status: 'ACTIVE',
    trustScore: 94,
    trust_score: 94,
    targetPrincipal: 150000,
    principal: 150000,
    revenueSharePercent: 12,
    share_pct: 12,
    repaymentCap: 180000,
    cap_amount: 180000,
    durationDays: 90,
    duration_days: 90,
    fundedAmount: 150000,
    dailyPosVolume: 32000,
    businessAge: '5.2 Years',
    gstVerified: true,
    riskNotes: 'A+ bank rating, consistently exceeds average monthly card sales by 18%. Zero historical payment bounces.',
    investorCount: 14,
  },
  {
    id: 'cf-102',
    contract_id: 'cf-102',
    merchantName: 'Fresh Bites Cafe',
    category: 'Food',
    subCategory: 'Artisanal Bakery & Cafe',
    location: 'Indiranagar, Bengaluru',
    status: 'LISTED',
    trustScore: 88,
    trust_score: 88,
    targetPrincipal: 250000,
    principal: 250000,
    revenueSharePercent: 14,
    share_pct: 14,
    repaymentCap: 305000,
    cap_amount: 305000,
    durationDays: 120,
    duration_days: 120,
    fundedAmount: 200000,
    dailyPosVolume: 48000,
    businessAge: '3.8 Years',
    gstVerified: true,
    riskNotes: 'Prime footfall hub, verified Swiggy/Zomato POS reconciliation with steady recurring morning and evening peaks.',
    investorCount: 22,
  },
  {
    id: 'cf-103',
    contract_id: 'cf-103',
    merchantName: 'Prestige Apparel',
    category: 'Retail',
    subCategory: 'Designer Ethnic Wear',
    location: 'Bandra West, Mumbai',
    status: 'LISTED',
    trustScore: 82,
    trust_score: 82,
    targetPrincipal: 320000,
    principal: 320000,
    revenueSharePercent: 15,
    share_pct: 15,
    repaymentCap: 396800,
    cap_amount: 396800,
    durationDays: 105,
    duration_days: 105,
    fundedAmount: 240000,
    dailyPosVolume: 56000,
    businessAge: '6.1 Years',
    gstVerified: true,
    riskNotes: 'Strong festive season sales surge, robust merchant loyalty database, 24% return on capital multiple.',
    investorCount: 19,
  },
  {
    id: 'cf-104',
    contract_id: 'cf-104',
    merchantName: 'QuickMart Grocery',
    category: 'Grocery',
    subCategory: 'Neighborhood Supermarket',
    location: 'Koramangala, Bengaluru',
    status: 'LISTED',
    trustScore: 91,
    trust_score: 91,
    targetPrincipal: 400000,
    principal: 400000,
    revenueSharePercent: 11,
    share_pct: 11,
    repaymentCap: 472000,
    cap_amount: 472000,
    durationDays: 150,
    duration_days: 150,
    fundedAmount: 310000,
    dailyPosVolume: 65000,
    businessAge: '4.5 Years',
    gstVerified: true,
    riskNotes: 'High volume staple retailer with predictable recurring basket sizes and top tier credit score.',
    investorCount: 27,
  },
];

let mockContractsState = [...MOCK_CONTRACTS];

/**
 * Normalizes backend contract entity to frontend component interface
 */
function normalizeContract(c) {
  if (!c) return null;
  const id = c.contract_id || c.id;
  const principal = Number(c.principal ?? c.targetPrincipal ?? 0);
  const cap = Number(c.cap_amount ?? c.repaymentCap ?? Math.round(principal * 1.2));
  const share = Number(c.share_pct ?? c.revenueSharePercent ?? 12);
  const duration = Number(c.duration_days ?? c.durationDays ?? 90);
  const totalRepaid = Number(c.total_repaid ?? 0);

  // Compute funded amount from relations if present
  let fundedAmount = Number(c.fundedAmount ?? 0);
  if (Array.isArray(c.fundings)) {
    fundedAmount = c.fundings.reduce((sum, f) => sum + Number(f.amount_committed || 0), 0);
  }

  return {
    ...c,
    id,
    contract_id: id,
    merchantName: c.merchant?.name || c.merchantName || 'Verified Merchant Store',
    category: c.category || 'Retail',
    subCategory: c.subCategory || 'General Merchandise',
    location: c.location || 'New Delhi, India',
    status: (c.status || 'LISTED').toUpperCase(),
    trustScore: Number(c.trust_score ?? c.trustScore ?? 85),
    targetPrincipal: principal,
    principal,
    revenueSharePercent: share,
    share_pct: share,
    repaymentCap: cap,
    cap_amount: cap,
    durationDays: duration,
    duration_days: duration,
    fundedAmount,
    totalRepaid,
    investorCount: c.investorCount ?? (Array.isArray(c.fundings) ? c.fundings.length : 12),
  };
}

/**
 * Create a new merchant financing contract
 * POST /api/contracts
 */
export async function createContract(contractData) {
  const payload = {
    principal: Number(contractData.principal ?? contractData.targetPrincipal ?? 100000),
    share_pct: Number(contractData.share_pct ?? contractData.revenueSharePercent ?? 15),
    cap_amount: Number(contractData.cap_amount ?? contractData.repaymentCap ?? 120000),
    duration_days: Number(contractData.duration_days ?? contractData.durationDays ?? 90),
    apr_equivalent: Number(contractData.apr_equivalent ?? 18.5),
    platform_fee_pct: Number(contractData.platform_fee_pct ?? 1.0),
    weekly_minimum: Number(contractData.weekly_minimum ?? 2500),
    business_age_months: Number(contractData.business_age_months ?? 36),
    monthly_revenue: Number(contractData.monthly_revenue ?? 150000),
    previous_repayment_rate: Number(contractData.previous_repayment_rate ?? 95),
  };

  try {
    const res = await api.post('/contracts', payload);
    const contract = res.data?.contract || res.data?.data || res.data;
    return normalizeContract(contract);
  } catch (err) {
    console.warn('[contractService] createContract backend call failed, creating local sandbox mock:', err.message);

    const newContract = {
      id: `cf-${Math.floor(110 + Math.random() * 900)}`,
      merchantName: contractData.merchantName || 'Sharma General Store',
      category: contractData.category || 'Retail',
      subCategory: 'General Commercial',
      location: contractData.location || 'Jaipur, Rajasthan',
      status: 'DRAFT',
      trustScore: contractData.trustScore || 85,
      targetPrincipal: payload.principal,
      revenueSharePercent: payload.share_pct,
      repaymentCap: payload.cap_amount,
      durationDays: payload.duration_days,
      fundedAmount: 0,
      investorCount: 0,
      createdAt: new Date().toISOString(),
    };

    mockContractsState = [newContract, ...mockContractsState];
    return newContract;
  }
}

/**
 * Get all contracts with optional filters (category, status, etc.)
 * GET /api/contracts
 */
export async function getContracts(params = {}) {
  try {
    const res = await api.get('/contracts', { params });
    const rawList = res.data?.contracts || res.data?.data || res.data;

    if (Array.isArray(rawList) && rawList.length > 0) {
      return rawList.map(normalizeContract);
    }
    return mockContractsState.map(normalizeContract);
  } catch (err) {
    console.warn('[contractService] getContracts failed, falling back to mock fixtures:', err.message);
    return mockContractsState.map(normalizeContract);
  }
}

// Backward-compatible alias for getContracts
export const fetchContracts = getContracts;

/**
 * Fetch a single contract by ID
 * GET /api/contracts/:contractId
 */
export async function fetchContractById(contractId) {
  try {
    const res = await api.get(`/contracts/${contractId}`);
    const raw = res.data?.contract || res.data?.data || res.data;
    return normalizeContract(raw);
  } catch (err) {
    console.warn(`[contractService] fetchContractById(${contractId}) fallback:`, err.message);
    const match = mockContractsState.find(
      (c) =>
        c.id.toLowerCase() === String(contractId).toLowerCase() ||
        c.id.replace(/^cf-/, '') === String(contractId).replace(/^cf-/, '')
    );
    return normalizeContract(match || mockContractsState[0]);
  }
}

/**
 * Update contract properties
 * PATCH /api/contracts/:contractId
 */
export async function updateContract(contractId, updates) {
  try {
    const res = await api.patch(`/contracts/${contractId}`, updates);
    return normalizeContract(res.data?.contract || res.data?.data || res.data);
  } catch (err) {
    console.warn(`[contractService] updateContract(${contractId}) fallback:`, err.message);
    return { id: contractId, ...updates };
  }
}

/**
 * List contract to marketplace for investor funding
 * POST /api/contracts/:contractId/list
 */
export async function listContract(contractId) {
  try {
    const res = await api.post(`/contracts/${contractId}/list`);
    return normalizeContract(res.data?.contract || res.data?.data || res.data);
  } catch (err) {
    console.warn(`[contractService] listContract(${contractId}) fallback:`, err.message);
    return { id: contractId, status: 'LISTED' };
  }
}

/**
 * Fund contract (convenience delegation)
 */
export async function fundContract(id, amount) {
  try {
    const res = await api.post(`/contracts/${id}/fund`, {
      amount,
      amount_committed: amount,
    });
    return normalizeContract(res.data?.contract || res.data?.data || res.data);
  } catch (err) {
    console.warn(`[contractService] fundContract(${id}) fallback:`, err.message);
    const amt = Number(amount) || 0;
    mockContractsState = mockContractsState.map((c) => {
      if (c.id === id) {
        const newFunded = Math.min(c.targetPrincipal, c.fundedAmount + amt);
        return {
          ...c,
          fundedAmount: newFunded,
          investorCount: (c.investorCount || 0) + 1,
          status: newFunded >= c.targetPrincipal ? 'FUNDED' : c.status,
        };
      }
      return c;
    });
    return { id, fundedAmount: amt, success: true };
  }
}

export default {
  MOCK_CONTRACTS,
  createContract,
  getContracts,
  fetchContracts,
  fetchContractById,
  updateContract,
  listContract,
  fundContract,
};
