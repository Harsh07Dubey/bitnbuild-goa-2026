const prisma = require("../config/prisma");

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
      },
    });

    return res.status(201).json({
      success: true,
      message: "Contract created successfully",
      contract,
    });
  } catch (error) {
    console.error("Create contract error:", error);

    return res.status(500).json({
      success: false,
      message: "Contract creation failed",
    });
  }
};

module.exports = {
  createContract,
};