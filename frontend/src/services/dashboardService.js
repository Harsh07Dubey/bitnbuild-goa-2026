/**
 * dashboardService.js — Real-time Metrics Dashboard Service
 * Connects frontend to:
 * - GET /api/dashboard/merchant
 * - GET /api/dashboard/investor
 */
import api from './api.js';

// Mock Investor Dashboard Data Fixture
export const MOCK_INVESTOR_DASHBOARD = {
  totalCapitalDeployed: 645000,
  totalReturnAccrued: 73420,
  projectedWeightedYield: 18.4,
  activePositions: 7,
  portfolioValue: 718420,
  unrealizedReturnPercent: 11.38,
  activeContracts: [
    {
      id: 'cf-101',
      merchantName: 'Sharma General Store',
      category: 'Retail',
      principalInvested: 50000,
      collectedReturn: 38200,
      capTarget: 60000,
      completionHorizon: '34 Days Remaining',
      progressPercent: 64,
      status: 'HEALTHY',
    },
    {
      id: 'cf-102',
      merchantName: 'Fresh Bites Cafe',
      category: 'Food',
      principalInvested: 100000,
      collectedReturn: 84000,
      capTarget: 122000,
      completionHorizon: '42 Days Remaining',
      progressPercent: 69,
      status: 'EXCEEDING_RUNRATE',
    },
    {
      id: 'cf-104',
      merchantName: 'QuickMart Grocery',
      category: 'Grocery',
      principalInvested: 120000,
      collectedReturn: 109500,
      capTarget: 141600,
      completionHorizon: '18 Days Remaining',
      progressPercent: 77,
      status: 'NEAR_MATURITY',
    },
  ],
  originationHistory: [
    { month: 'Apr', vol: '₹11.2L', height: '60%' },
    { month: 'May', vol: '₹13.4L', height: '72%' },
    { month: 'Jun', vol: '₹14.9L', height: '80%' },
    { month: 'Jul', vol: '₹16.8L', height: '91%' },
    { month: 'Aug', vol: '₹17.9L', height: '96%' },
    { month: 'Sep', vol: '₹18.45L', height: '100%' },
  ],
  sectorAllocation: [
    { name: 'Retail & Apparel', percent: 44, color: 'bg-[#2563EB]' },
    { name: 'Food & QSR', percent: 32, color: 'bg-sky-500' },
    { name: 'Grocery & Supermarkets', percent: 24, color: 'bg-emerald-500' },
  ],
};

// Mock Merchant Dashboard Data Fixture
export const MOCK_MERCHANT_DASHBOARD = {
  contract: {
    id: 'CON-001',
    merchantName: 'Sharma General Store',
    disbursedPrincipal: 150000,
    repaymentCap: 180000,
    totalRepaid: 42500,
    weeklyMinimum: 2500,
    weeklySatisfied: 3125,
    daysRemaining: 64,
    totalDuration: 90,
    trustScore: 82,
    trustStatus: 'High Trust',
    revenueShare: 15,
  },
  liveStatus: {
    engineActive: true,
    splitRatio: '84/15/1',
    nextAutoSweep: 'Tomorrow 06:00 AM',
  },
};

/**
 * Fetch Merchant Dashboard metrics
 * GET /api/dashboard/merchant
 */
export async function getMerchantDashboard() {
  try {
    const res = await api.get('/dashboard/merchant');
    return res.data?.summary || res.data || MOCK_MERCHANT_DASHBOARD;
  } catch (err) {
    console.warn('[dashboardService] getMerchantDashboard fallback:', err.message);
    return MOCK_MERCHANT_DASHBOARD;
  }
}

/**
 * Fetch Investor Dashboard metrics
 * GET /api/dashboard/investor
 */
export async function getInvestorDashboard() {
  try {
    const res = await api.get('/dashboard/investor');
    return res.data?.portfolio || res.data || MOCK_INVESTOR_DASHBOARD;
  } catch (err) {
    console.warn('[dashboardService] getInvestorDashboard fallback:', err.message);
    return MOCK_INVESTOR_DASHBOARD;
  }
}

// Backward-compatible aliases
export const fetchMerchantDashboard = getMerchantDashboard;
export const fetchInvestorDashboard = getInvestorDashboard;

export default {
  getMerchantDashboard,
  getInvestorDashboard,
  fetchMerchantDashboard,
  fetchInvestorDashboard,
  MOCK_INVESTOR_DASHBOARD,
  MOCK_MERCHANT_DASHBOARD,
};
