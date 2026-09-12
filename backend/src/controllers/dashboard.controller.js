const prisma = require("../config/prisma");

const getMerchantDashboard = async (req, res) => {
  try {
    if (String(req.user.role).toLowerCase() !== "merchant") {
      return res.status(403).json({
        success: false,
        message: "Only merchants can access this dashboard",
      });
    }

    const contracts = await prisma.contract.findMany({
      where: {
        merchant_id: req.user.user_id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalPrincipal = contracts.reduce(
      (sum, contract) => sum + Number(contract.principal),
      0
    );

    const totalRepaid = contracts.reduce(
      (sum, contract) => sum + Number(contract.total_repaid || 0),
      0
    );

    const totalRemaining = contracts.reduce(
      (sum, contract) =>
        sum +
        Math.max(
          0,
          Number(contract.cap_amount) -
            Number(contract.total_repaid || 0)
        ),
      0
    );

    return res.status(200).json({
      success: true,
      summary: {
        total_contracts: contracts.length,
        total_principal: totalPrincipal,
        total_repaid: totalRepaid,
        total_remaining: totalRemaining,
      },
      contracts,
    });
  } catch (error) {
    console.error("Merchant dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch merchant dashboard",
    });
  }
};

const getInvestorDashboard = async (req, res) => {
  try {
    if (String(req.user.role).toLowerCase() !== "investor") {
      return res.status(403).json({
        success: false,
        message: "Only investors can access this dashboard",
      });
    }

    const fundings = await prisma.funding.findMany({
      where: {
        investor_id: req.user.user_id,
      },
      include: {
        contract: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    const totalInvested = fundings.reduce(
      (sum, funding) => sum + Number(funding.amount_committed),
      0
    );

    const contracts = fundings.map((funding) => ({
      funding_id: funding.funding_id,
      contract_id: funding.contract_id,
      amount_invested: Number(funding.amount_committed),
      contract_status: funding.contract.status,
      contract_cap: Number(funding.contract.cap_amount),
      share_pct: Number(funding.contract.share_pct),
      total_repaid: Number(funding.contract.total_repaid || 0),
    }));

    return res.status(200).json({
      success: true,
      summary: {
        total_investments: fundings.length,
        total_invested: totalInvested,
      },
      investments: contracts,
    });
  } catch (error) {
    console.error("Investor dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch investor dashboard",
    });
  }
};

module.exports = {
  getMerchantDashboard,
  getInvestorDashboard,
};