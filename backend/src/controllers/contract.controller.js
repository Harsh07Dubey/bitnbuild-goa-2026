const prisma = require("../config/prisma");
const {
  calculateBaselineTrustScore,
} = require("../services/ai.service");

const createContract = async (req, res) => {
  try {
    const {
      principal,
      share_pct,
      cap_amount,
      duration_days,
      apr_equivalent,
      platform_fee_pct,
      weekly_minimum,

      // AI inputs
      business_age_months,
      monthly_revenue,
      previous_repayment_rate,
    } = req.body;

    if (
      principal === undefined ||
      share_pct === undefined ||
      cap_amount === undefined ||
      duration_days === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "principal, share_pct, cap_amount and duration_days are required",
      });
    }

    const principalAmount = Number(principal);
    const sharePercentage = Number(share_pct);
    const capAmount = Number(cap_amount);
    const duration = Number(duration_days);

    if (
      !Number.isFinite(principalAmount) ||
      !Number.isFinite(sharePercentage) ||
      !Number.isFinite(capAmount) ||
      !Number.isFinite(duration)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid contract values",
      });
    }

    if (principalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Principal must be greater than 0",
      });
    }

    if (sharePercentage <= 0 || sharePercentage > 100) {
      return res.status(400).json({
        success: false,
        message: "share_pct must be greater than 0 and at most 100",
      });
    }

    if (capAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "cap_amount must be greater than 0",
      });
    }

    if (duration <= 0 || !Number.isInteger(duration)) {
      return res.status(400).json({
        success: false,
        message: "duration_days must be a positive integer",
      });
    }

    // --------------------------------------------------
    // AI TRUST SCORE
    // --------------------------------------------------

    const aiResult = calculateBaselineTrustScore({
      merchant_verified: req.user.verified_flag === true,
      business_age_months:
        business_age_months !== undefined
          ? Number(business_age_months)
          : 0,
      monthly_revenue:
        monthly_revenue !== undefined
          ? Number(monthly_revenue)
          : 0,
      previous_repayment_rate:
        previous_repayment_rate !== undefined
          ? Number(previous_repayment_rate)
          : 0,
    });

    // Save the latest AI trust score for the merchant
    await prisma.user.update({
      where: {
        user_id: req.user.user_id,
      },
      data: {
        trust_score: aiResult.trust_score,
        ai_score_source: aiResult.score_source,
      },
    });

    // --------------------------------------------------
    // CREATE CONTRACT
    // --------------------------------------------------

    const contract = await prisma.contract.create({
      data: {
        merchant_id: req.user.user_id,
        principal: principalAmount,
        share_pct: sharePercentage,
        cap_amount: capAmount,
        duration_days: duration,
        status: "Draft",

        apr_equivalent:
          apr_equivalent !== undefined
            ? Number(apr_equivalent)
            : null,

        platform_fee_pct:
          platform_fee_pct !== undefined
            ? Number(platform_fee_pct)
            : null,

        weekly_minimum:
          weekly_minimum !== undefined
            ? Number(weekly_minimum)
            : null,

        // AI recommendation
        ai_recommended_cap: aiResult.max_contract_cap,
        ai_risk_rationale: aiResult.risk_rationale,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Contract created successfully",
      contract,
      ai: {
        trust_score: aiResult.trust_score,
        max_contract_cap: aiResult.max_contract_cap,
        risk_rationale: aiResult.risk_rationale,
        source: aiResult.score_source,
      },
    });
  } catch (error) {
    console.error("Create contract error:", error);

    return res.status(500).json({
      success: false,
      message: "Contract creation failed",
    });
  }
};

const getContracts = async (req, res) => {
  try {
    const contracts = await prisma.contract.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        merchant: {
          select: {
            user_id: true,
            name: true,
            verified_flag: true,
            trust_score: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: contracts.length,
      contracts,
    });
  } catch (error) {
    console.error("Get contracts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contracts",
    });
  }
};

const getContractById = async (req, res) => {
  try {
    const { contractId } = req.params;

    const contract = await prisma.contract.findUnique({
      where: {
        contract_id: contractId,
      },
      include: {
        merchant: {
          select: {
            user_id: true,
            name: true,
            verified_flag: true,
            trust_score: true,
          },
        },
        fundings: {
          select: {
            funding_id: true,
            investor_id: true,
            amount_committed: true,
            timestamp: true,
          },
        },
      },
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    return res.status(200).json({
      success: true,
      contract,
    });
  } catch (error) {
    console.error("Get contract error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contract",
    });
  }
};

const updateContract = async (req, res) => {
  try {
    const { contractId } = req.params;

    const existingContract = await prisma.contract.findUnique({
      where: {
        contract_id: contractId,
      },
    });

    if (!existingContract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    if (existingContract.merchant_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own contracts",
      });
    }

    if (existingContract.status !== "Draft") {
      return res.status(400).json({
        success: false,
        message: "Only Draft contracts can be updated",
      });
    }

    const allowedFields = [
      "principal",
      "share_pct",
      "cap_amount",
      "duration_days",
      "apr_equivalent",
      "platform_fee_pct",
      "weekly_minimum",
    ];

    const data = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        data[field] = Number(req.body[field]);
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    if (
      data.principal !== undefined &&
      (!Number.isFinite(data.principal) || data.principal <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Principal must be greater than 0",
      });
    }

    if (
      data.share_pct !== undefined &&
      (!Number.isFinite(data.share_pct) ||
        data.share_pct <= 0 ||
        data.share_pct > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "share_pct must be greater than 0 and at most 100",
      });
    }

    if (
      data.cap_amount !== undefined &&
      (!Number.isFinite(data.cap_amount) || data.cap_amount <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "cap_amount must be greater than 0",
      });
    }

    if (
      data.duration_days !== undefined &&
      (!Number.isInteger(data.duration_days) ||
        data.duration_days <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "duration_days must be a positive integer",
      });
    }

    const contract = await prisma.contract.update({
      where: {
        contract_id: contractId,
      },
      data,
    });

    return res.status(200).json({
      success: true,
      message: "Contract updated successfully",
      contract,
    });
  } catch (error) {
    console.error("Update contract error:", error);

    return res.status(500).json({
      success: false,
      message: "Contract update failed",
    });
  }
};

const listContract = async (req, res) => {
  try {
    const { contractId } = req.params;

    const contract = await prisma.contract.findUnique({
      where: {
        contract_id: contractId,
      },
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    if (contract.merchant_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: "You can only list your own contracts",
      });
    }

    if (contract.status !== "Draft") {
      return res.status(400).json({
        success: false,
        message: "Only Draft contracts can be listed",
      });
    }

    const updatedContract = await prisma.contract.update({
      where: {
        contract_id: contractId,
      },
      data: {
        status: "Listed",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Contract listed successfully",
      contract: updatedContract,
    });
  } catch (error) {
    console.error("List contract error:", error);

    return res.status(500).json({
      success: false,
      message: "Contract listing failed",
    });
  }
};

module.exports = {
  createContract,
  getContracts,
  getContractById,
  updateContract,
  listContract,
};