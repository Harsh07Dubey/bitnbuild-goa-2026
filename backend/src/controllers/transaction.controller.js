const prisma = require("../config/prisma");

const getContractTransactions = async (req, res) => {
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

    // Only the merchant who owns the contract or an investor
    // who funded it can view its transaction history.
    const isMerchant = contract.merchant_id === req.user.user_id;

    const investorFunding = await prisma.funding.findFirst({
      where: {
        contract_id: contractId,
        investor_id: req.user.user_id,
      },
    });

    if (!isMerchant && !investorFunding) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these transactions",
      });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        contract_id: contractId,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Get contract transactions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

module.exports = {
  getContractTransactions,
};