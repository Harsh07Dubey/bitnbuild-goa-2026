const {
  calculateBaselineTrustScore,
  validateAiOutput,
  HARD_MAX_CONTRACT_CAP,
} = require("../services/ai.service");

const getTrustScore = async (req, res) => {
  try {
    const {
      merchant_verified,
      business_age_months,
      monthly_revenue,
      previous_repayment_rate,
    } = req.body;

    if (
      merchant_verified === undefined ||
      business_age_months === undefined ||
      monthly_revenue === undefined ||
      previous_repayment_rate === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "merchant_verified, business_age_months, monthly_revenue and previous_repayment_rate are required",
      });
    }

    const input = {
      merchant_verified: Boolean(merchant_verified),
      business_age_months: Number(business_age_months),
      monthly_revenue: Number(monthly_revenue),
      previous_repayment_rate: Number(previous_repayment_rate),
    };

    if (
      !Number.isFinite(input.business_age_months) ||
      !Number.isFinite(input.monthly_revenue) ||
      !Number.isFinite(input.previous_repayment_rate)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid trust-score input values",
      });
    }

    if (
      input.business_age_months < 0 ||
      input.monthly_revenue < 0 ||
      input.previous_repayment_rate < 0 ||
      input.previous_repayment_rate > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Trust-score values are outside the allowed range",
      });
    }

    /*
     * Gemini integration can be enabled when GEMINI_API_KEY is configured.
     * During development/demo, safely fall back to the baseline model.
     */
    let result;
    let source = "baseline";

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `
You are a financial risk scoring assistant for a microfinance platform.

Return ONLY valid JSON with exactly these fields:
{
  "trust_score": number,
  "max_contract_cap": number,
  "risk_rationale": string
}

Rules:
- trust_score must be between 0 and 100.
- max_contract_cap must be positive and no greater than ${HARD_MAX_CONTRACT_CAP}.
- Do not use or infer protected or sensitive characteristics.
- Use only the supplied business information.

Business information:
merchant_verified: ${input.merchant_verified}
business_age_months: ${input.business_age_months}
monthly_revenue: ${input.monthly_revenue}
previous_repayment_rate: ${input.previous_repayment_rate}
`;

        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
            process.env.GEMINI_API_KEY,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }],
                },
              ],
              generationConfig: {
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Gemini API returned ${response.status}`);
        }

        const aiResponse = await response.json();

        const text =
          aiResponse.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          throw new Error("Gemini returned no usable output");
        }

        const parsed = JSON.parse(text);

        if (!validateAiOutput(parsed)) {
          throw new Error("Invalid AI trust-score output");
        }

        result = {
          trust_score: Number(parsed.trust_score),
          max_contract_cap: Math.min(
            Number(parsed.max_contract_cap),
            HARD_MAX_CONTRACT_CAP
          ),
          risk_rationale: parsed.risk_rationale.trim(),
          score_source: "gemini",
        };

        source = "gemini";
      } catch (aiError) {
        console.error("AI scoring failed, using baseline:", aiError.message);

        result = calculateBaselineTrustScore(input);
      }
    } else {
      result = calculateBaselineTrustScore(input);
    }

    return res.status(200).json({
      success: true,
      source,
      data: result,
    });
  } catch (error) {
    console.error("Trust score error:", error);

    return res.status(500).json({
      success: false,
      message: "Trust score calculation failed",
    });
  }
};

module.exports = {
  getTrustScore,
};