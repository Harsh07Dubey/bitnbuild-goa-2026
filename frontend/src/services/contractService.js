import api from './api.js';

// Initial Mock Marketplace Contracts Dataset
export const MOCK_CONTRACTS = [
  {
    id: 'cf-101',
    merchantName: 'Sharma General Store',
    category: 'Retail',
    subCategory: 'FMCG & Daily Essentials',
    location: 'Connaught Place, New Delhi',
    status: 'LISTED',
    trustScore: 94,
    targetPrincipal: 150000,
    revenueSharePercent: 12,
    repaymentCap: 180000,
    durationDays: 90,
    fundedAmount: 112500,
    dailyPosVolume: 32000,
    businessAge: '5.2 Years',
    gstVerified: true,
    riskNotes: 'A+ bank rating, consistently exceeds average monthly card sales by 18%. Zero historical payment bounces.',
    investorCount: 14
  },
  {
    id: 'cf-102',
    merchantName: 'Fresh Bites Cafe',
    category: 'Food',
    subCategory: 'Artisanal Bakery & Cafe',
    location: 'Indiranagar, Bengaluru',
    status: 'LISTED',
    trustScore: 88,
    targetPrincipal: 250000,
    revenueSharePercent: 14,
    repaymentCap: 305000,
    durationDays: 120,
    fundedAmount: 200000,
    dailyPosVolume: 48000,
    businessAge: '3.8 Years',
    gstVerified: true,
    riskNotes: 'Prime footfall hub, verified Swiggy/Zomato POS reconciliation with steady recurring morning and evening peaks.',
    investorCount: 22
  },
  {
    id: 'cf-103',
    merchantName: 'Prestige Apparel',
    category: 'Retail',
    subCategory: 'Designer Ethnic Wear',
    location: 'Bandra West, Mumbai',
    status: 'LISTED',
    trustScore: 82,
    targetPrincipal: 320000,
    revenueSharePercent: 15,
    repaymentCap: 396800,
    durationDays: 105,
    fundedAmount: 240000,
    dailyPosVolume: 56000,
    businessAge: '6.1 Years',
    gstVerified: true,
    riskNotes: 'Strong festive season sales surge, robust merchant loyalty database, 24% return on capital multiple.',
    investorCount: 19
  },
  {
    id: 'cf-104',
    merchantName: 'QuickMart Grocery',
    category: 'Grocery',
    subCategory: 'Neighborhood Supermarket',
    location: 'Koramangala, Bengaluru',
    status: 'LISTED',
    trustScore: 91,
    targetPrincipal: 400000,
    revenueSharePercent: 10,
    repaymentCap: 472000,
    durationDays: 90,
    fundedAmount: 340000,
    dailyPosVolume: 82000,
    businessAge: '4.5 Years',
    gstVerified: true,
    riskNotes: 'High inventory turnover (14 days), tied to localized quick delivery partner, spotless tax compliance.',
    investorCount: 29
  },
  {
    id: 'cf-105',
    merchantName: 'Apex Health Wellness',
    category: 'Retail',
    subCategory: 'Pharmacy & Surgical Supplies',
    location: 'Gachibowli, Hyderabad',
    status: 'LISTED',
    trustScore: 79,
    targetPrincipal: 180000,
    revenueSharePercent: 11,
    repaymentCap: 212400,
    durationDays: 75,
    fundedAmount: 117000,
    dailyPosVolume: 36000,
    businessAge: '3.2 Years',
    gstVerified: true,
    riskNotes: 'Consistent chronic medicine subscription revenues, high defensibility against consumer spending slumps.',
    investorCount: 11
  },
  {
    id: 'cf-106',
    merchantName: 'Chai Point Corner',
    category: 'Food',
    subCategory: 'QSR & Quick Snacks',
    location: 'Cyber City, Gurugram',
    status: 'LISTED',
    trustScore: 68,
    targetPrincipal: 120000,
    revenueSharePercent: 16,
    repaymentCap: 147600,
    durationDays: 60,
    fundedAmount: 72000,
    dailyPosVolume: 26000,
    businessAge: '2.1 Years',
    gstVerified: true,
    riskNotes: 'Corporate corridor location subject to hybrid working cyclicality, backed by healthy cash gross margins (62%).',
    investorCount: 8
  },
  {
    id: 'cf-107',
    merchantName: 'Sri Balaji Electronics',
    category: 'Retail',
    subCategory: 'Consumer Electronics & Mobile',
    location: 'T. Nagar, Chennai',
    status: 'LISTED',
    trustScore: 62,
    targetPrincipal: 500000,
    revenueSharePercent: 9,
    repaymentCap: 585000,
    durationDays: 150,
    fundedAmount: 225000,
    dailyPosVolume: 74000,
    businessAge: '7.0 Years',
    gstVerified: true,
    riskNotes: 'Established wholesale/retail distributor. Slightly elevated supplier credit cycle, moderated by high collateral reserves.',
    investorCount: 16
  },
  {
    id: 'cf-108',
    merchantName: 'Golden Spoon Kitchen',
    category: 'Food',
    subCategory: 'Cloud Kitchen Network',
    location: 'Park Street, Kolkata',
    status: 'LISTED',
    trustScore: 41,
    targetPrincipal: 100000,
    revenueSharePercent: 18,
    repaymentCap: 128000,
    durationDays: 45,
    fundedAmount: 38000,
    dailyPosVolume: 19000,
    businessAge: '1.4 Years',
    gstVerified: false,
    riskNotes: 'Rapidly expanding multi-brand cloud kitchen with limited seasonal track record. High potential yield with volatility.',
    investorCount: 6
  },
  {
    id: 'cf-109',
    merchantName: 'Urban Nature Organics',
    category: 'Grocery',
    subCategory: 'Farm Produce & Cold Pressed Oils',
    location: 'Aundh, Pune',
    status: 'LISTED',
    trustScore: 35,
    targetPrincipal: 90000,
    revenueSharePercent: 19,
    repaymentCap: 115200,
    durationDays: 40,
    fundedAmount: 27000,
    dailyPosVolume: 14500,
    businessAge: '1.1 Years',
    gstVerified: false,
    riskNotes: 'New merchant with short banking history. Daily auto-sweep debits active to mitigate collection exposure.',
    investorCount: 4
  }
];

// In-memory runtime store for live session state updates in mock mode
let mockContractsState = [...MOCK_CONTRACTS];

/**
 * Filter and sort mock contracts locally
 */
function applyFiltersAndSort(contracts, filters = {}) {
  let result = [...contracts];
  const { category, duration, sort, search } = filters;

  if (category && category !== 'ALL') {
    result = result.filter((c) => c.category?.toLowerCase() === category.toLowerCase());
  }

  if (duration && duration !== 'ALL') {
    if (duration === '60') result = result.filter((c) => c.durationDays <= 60);
    else if (duration === '90') result = result.filter((c) => c.durationDays > 60 && c.durationDays <= 90);
    else if (duration === '180') result = result.filter((c) => c.durationDays > 90);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (c) =>
        c.merchantName.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
    );
  }

  if (sort) {
    if (sort === 'trust-desc') result.sort((a, b) => b.trustScore - a.trustScore);
    else if (sort === 'progress-desc') {
      result.sort((a, b) => b.fundedAmount / b.targetPrincipal - a.fundedAmount / a.targetPrincipal);
    } else if (sort === 'rate-desc') result.sort((a, b) => b.revenueSharePercent - a.revenueSharePercent);
    else if (sort === 'principal-asc') result.sort((a, b) => a.targetPrincipal - b.targetPrincipal);
  }

  return result;
}

/**
 * Fetch marketplace contracts with optional filter criteria
 * GET /api/contracts
 */
export async function fetchContracts(filters = {}) {
  try {
    const res = await api.get('/contracts', { params: filters });
    return res.data?.contracts || res.data || mockContractsState;
  } catch (err) {
    console.warn('[contractService] fetchContracts falling back to mock dataset:', err.message);
    return applyFiltersAndSort(mockContractsState, filters);
  }
}

/**
 * Fetch a single contract by ID
 * GET /api/contracts/:id
 */
export async function fetchContractById(id) {
  try {
    const res = await api.get(`/contracts/${id}`);
    return res.data?.contract || res.data;
  } catch (err) {
    console.warn(`[contractService] fetchContractById(${id}) falling back to mock:`, err.message);
    const cleanId = String(id || '').toLowerCase();
    const match = mockContractsState.find(
      (c) =>
        c.id.toLowerCase() === cleanId ||
        c.id.replace(/^cf-/, '') === cleanId.replace(/^cf-/, '') ||
        cleanId.includes(c.id.toLowerCase())
    );
    if (!match) {
      return mockContractsState[0];
    }
    return match;
  }
}

/**
 * Create a new merchant financing contract
 * POST /api/contracts
 */
export async function createContract(data) {
  try {
    const res = await api.post('/contracts', data);
    return res.data?.contract || res.data;
  } catch (err) {
    console.warn('[contractService] createContract falling back to mock:', err.message);
    const newContract = {
      id: `cf-${Math.floor(110 + Math.random() * 900)}`,
      merchantName: data.merchantName || 'Merchant Partner',
      category: data.category || 'Retail',
      subCategory: data.subCategory || 'General Commercial',
      location: data.location || 'Jaipur, Rajasthan',
      status: 'LISTED',
      trustScore: data.trustScore || 85,
      targetPrincipal: Number(data.targetPrincipal) || 200000,
      revenueSharePercent: Number(data.revenueSharePercent) || 12,
      repaymentCap: Number(data.repaymentCap) || 240000,
      durationDays: Number(data.durationDays) || 90,
      fundedAmount: 0,
      dailyPosVolume: Number(data.dailyPosVolume) || 35000,
      businessAge: data.businessAge || '3.0 Years',
      gstVerified: Boolean(data.gstVerified ?? true),
      riskNotes: data.riskNotes || 'Newly originated contract approved through underwriting scan.',
      investorCount: 0,
      createdAt: new Date().toISOString()
    };
    mockContractsState = [newContract, ...mockContractsState];
    return newContract;
  }
}

/**
 * Fund / invest in a contract
 * POST /api/contracts/:id/fund
 */
export async function fundContract(id, amount) {
  try {
    const res = await api.post(`/contracts/${id}/fund`, { amount });
    return res.data?.contract || res.data;
  } catch (err) {
    console.warn(`[contractService] fundContract(${id}, ${amount}) falling back to mock:`, err.message);
    const amt = Number(amount) || 0;
    let updatedContract = null;

    mockContractsState = mockContractsState.map((c) => {
      const match =
        c.id.toLowerCase() === String(id).toLowerCase() ||
        c.id.replace(/^cf-/, '') === String(id).replace(/^cf-/, '');
      if (match) {
        const newFunded = Math.min(c.targetPrincipal, c.fundedAmount + amt);
        updatedContract = {
          ...c,
          fundedAmount: newFunded,
          investorCount: c.investorCount + 1,
          status: newFunded >= c.targetPrincipal ? 'FUNDED' : 'LISTED'
        };
        return updatedContract;
      }
      return c;
    });

    return updatedContract || { id, fundedAmount: amt, success: true };
  }
}

export default {
  MOCK_CONTRACTS,
  fetchContracts,
  fetchContractById,
  createContract,
  fundContract
};
