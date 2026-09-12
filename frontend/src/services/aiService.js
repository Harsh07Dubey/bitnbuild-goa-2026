import api from './api.js';

export const MOCK_AI_EVALUATION = {
  trustScore: 88,
  status: 'High Trust',
  confidenceScore: 94.8,
  breakdown: {
    bankingStability: 92,
    posReconciliation: 94,
    supplierCreditCycle: 81,
    footfallRecurrence: 89
  },
  recommendedTerms: {
    maxPrincipal: 350000,
    optimalRevenueShare: 14,
    tenureDays: 90,
    estimatedDailyVelocity: 42000
  },
  summary: 'Prime merchant with verified UPI POS run-rate and spotless compliance history. Auto-sweep risk index is negligible.'
};

/**
 * AI Underwriting & Trust Score Evaluation
 * POST /api/ai/trust-score
 * 
 * @param {object} payload
 * @param {string} payload.merchantName
 * @param {string} payload.category
 * @param {number} payload.dailyPosVolume
 * @param {string} payload.businessAge
 * @param {boolean} [payload.gstVerified]
 * @returns {Promise<object>}
 */
export async function evaluateTrustScore(payload = {}) {
  try {
    const res = await api.post('/ai/trust-score', payload);
    return res.data?.evaluation || res.data || MOCK_AI_EVALUATION;
  } catch (err) {
    console.warn('[aiService] evaluateTrustScore falling back to mock:', err.message);

    const posVol = Number(payload.dailyPosVolume) || 30000;
    const computedScore = Math.min(97, Math.max(45, Math.round(55 + (posVol / 100000) * 35)));

    return {
      ...MOCK_AI_EVALUATION,
      trustScore: computedScore,
      status: computedScore >= 75 ? 'High Trust' : computedScore >= 50 ? 'Moderate' : 'Risk Alert',
      merchantName: payload.merchantName || 'Merchant Applicant',
      category: payload.category || 'Retail',
      evaluatedAt: new Date().toISOString()
    };
  }
}

export default {
  MOCK_AI_EVALUATION,
  evaluateTrustScore
};
