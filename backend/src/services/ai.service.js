const HARD_MAX_CONTRACT_CAP = 50000;

const calculateBaselineTrustScore = (data) => {
  let score = 50;

  const {
    merchant_verified,
    business_age_months,
    monthly_revenue,
    previous_repayment_rate,
  } = data;

  if (merchant_verified === true) {
    score += 15;
  }

  if (Number(business_age_months) >= 24) {
    score += 10;
  } else if (Number(business_age_months) >= 12) {
    score += 5;
  }

  if (Number(monthly_revenue) >= 50000) {
    score += 10;
  } else if (Number(monthly_revenue) >= 25000) {
    score += 5;
  }

  if (Number(previous_repayment_rate) >= 95) {
    score += 15;
  } else if (Number(previous_repayment_rate) >= 85) {
    score += 10;
  } else if (Number(previous_repayment_rate) >= 70) {
    score += 5;
  }

  score = Math.max(0, Math.min(score, 100));

  const maxContractCap = Math.min(
    HARD_MAX_CONTRACT_CAP,
    Math.max(5000, Math.round(score * 500))
  );

  return {
    trust_score: score,
    max_contract_cap: maxContractCap,
    risk_rationale:
      "Baseline score calculated from business verification, business age, revenue and repayment history.",
    score_source: "baseline",
  };
};

const validateAiOutput = (result) => {
  if (!result || typeof result !== "object") {
    return false;
  }

  const trustScore = Number(result.trust_score);
  const maxCap = Number(result.max_contract_cap);

  return (
    Number.isFinite(trustScore) &&
    trustScore >= 0 &&
    trustScore <= 100 &&
    Number.isFinite(maxCap) &&
    maxCap > 0 &&
    maxCap <= HARD_MAX_CONTRACT_CAP &&
    typeof result.risk_rationale === "string" &&
    result.risk_rationale.trim().length > 0
  );
};

module.exports = {
  HARD_MAX_CONTRACT_CAP,
  calculateBaselineTrustScore,
  validateAiOutput,
};