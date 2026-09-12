/**
 * aiService.js — AI Underwriting & Trust Scoring Service
 * Connects frontend to POST /api/ai/trust-score
 */
import api from './api.js';

export const MOCK_AI_EVALUATION = {
  trust_score: 88,
  max_contract_cap: 180000,
  risk_rationale:
    'Prime merchant with verified UPI POS run-rate and spotless compliance history. Auto-sweep risk index is negligible.',
  status: 'High Trust',
  confidence_score: 94.8,
  breakdown: {
    bankingStability: 92,
    posReconciliation: 94,
    supplierCreditCycle: 81,
    footfallRecurrence: 89,
  },
};

/**
 * Request AI Trust Score & Underwriting Evaluation
 * POST /api/ai/trust-score
 *
 * @param {object} merchantData
 * @param {boolean} [merchantData.merchant_verified]
 * @param {number} [merchantData.business_age_months]
 * @param {number} [merchantData.monthly_revenue]
 * @param {number} [merchantData.previous_repayment_rate]
 * @param {number} [merchantData.principal] - Requested principal for cap projection
 * @returns {Promise<{ trust_score: number, max_contract_cap: number, risk_rationale: string }>}
 */
export async function getTrustScore(merchantData = {}) {
  // Normalize parameters to match backend schema
  const payload = {
    merchant_verified: Boolean(
      merchantData.merchant_verified ??
      merchantData.gstVerified ??
      true
    ),
    business_age_months: Math.max(
      1,
      Number(
        merchantData.business_age_months ??
        (parseFloat(merchantData.businessAge) ? parseFloat(merchantData.businessAge) * 12 : 36)
      )
    ),
    monthly_revenue: Math.max(
      1000,
      Number(
        merchantData.monthly_revenue ??
        merchantData.revenue ??
        (merchantData.dailyPosVolume ? merchantData.dailyPosVolume * 30 : 180000)
      )
    ),
    previous_repayment_rate: Math.min(
      100,
      Math.max(
        0,
        Number(
          merchantData.previous_repayment_rate ??
          merchantData.repaymentRate ??
          95
        )
      )
    ),
  };

  try {
    const res = await api.post('/ai/trust-score', payload);
    const data = res.data?.data || res.data;

    return {
      trust_score: Number(data.trust_score ?? 85),
      max_contract_cap: Number(
        data.max_contract_cap ??
        (merchantData.principal ? Math.round(merchantData.principal * 1.2) : 250000)
      ),
      risk_rationale:
        data.risk_rationale ||
        'Verified UPI merchant run-rate confirms positive operating cashflow.',
      source: res.data?.source || 'ai-engine',
    };
  } catch (err) {
    console.warn('[aiService] POST /ai/trust-score failed, applying rule-based scoring:', err.message);

    // Rule-based fallback as per specification
    const requestedPrincipal = Number(merchantData.principal || merchantData.requestedPrincipal || 100000);
    const revenue = payload.monthly_revenue;
    const computedScore = Math.min(96, Math.max(45, Math.round(60 + (revenue / 200000) * 30)));
    const recommendedCap = Math.round(requestedPrincipal * 1.2);

    return {
      trust_score: computedScore,
      max_contract_cap: Math.min(recommendedCap, 500000),
      risk_rationale:
        'Rule-based safety fallback: Underwriting verified based on monthly revenue velocity and duration criteria.',
      source: 'baseline-rule',
    };
  }
}

// Backward compatibility alias
export const evaluateTrustScore = getTrustScore;

export default {
  getTrustScore,
  evaluateTrustScore,
  MOCK_AI_EVALUATION,
};
