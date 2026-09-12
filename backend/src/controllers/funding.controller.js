const prisma = require("../config/prisma");

const createFunding = async (req, res) => {
  try {
    const { contractId } = req.params;
    const { amount_committed } = req.body;

    if (amount_committed === undefined) {
      return res.status(400).json({
        success: false,
        message: "amount_committed is required",
      });
    }

    const amount = Number(amount_committed);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Funding amount must be greater than 0",
      });
    }

    const contract = await prisma.contract.findUnique({
      where: {
        contract_id: contractId,
      },
      include: {
        fundings: true,
      },
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    if (contract.status !== "Listed") {
      return res.status(400).json({
        success: false,
        message: "Contract is not available for funding",
      });
    }

    if (contract.merchant_id === req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: "Merchant cannot fund their own contract",
      });
    }

    const totalFunded = contract.fundings.reduce(
      (total, funding) => total + Number(funding.amount_committed),
      0
    );

    const remainingAmount = Number(contract.principal) - totalFunded;

    if (remainingAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Contract is already fully funded",
      });
    }

    if (amount > remainingAmount) {
      return res.status(400).json({
        success: false,
        message: `Maximum remaining funding is ${remainingAmount}`,
      });
    }

    const funding = await prisma.funding.create({
      data: {
        contract_id: contractId,
        investor_id: req.user.user_id,
        amount_committed: amount,
      },
    });

    const newTotalFunded = totalFunded + amount;

    let updatedContract = contract;

    if (newTotalFunded >= Number(contract.principal)) {
      updatedContract = await prisma.contract.update({
        where: {
          contract_id: contractId,
        },
        data: {
          status: "Funded",
        },
      });
    }

    return res.status(201).json({
      success: true,
      message:
        newTotalFunded >= Number(contract.principal)
          ? "Funding successful. Contract is now fully funded."
          : "Funding successful",
      funding,
      total_funded: newTotalFunded,
      remaining_funding: Math.max(
        Number(contract.principal) - newTotalFunded,
        0
      ),
      contract_status: updatedContract.status,
    });
  } catch (error) {
    console.error("Create funding error:", error);

    return res.status(500).json({
      success: false,
      message: "Funding failed",
    });
  }
};

const getContractFundings = async (req, res) => {
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

    const fundings = await prisma.funding.findMany({
      where: {
        contract_id: contractId,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    const totalFunded = fundings.reduce(
      (total, funding) => total + Number(funding.amount_committed),
      0
    );

    return res.status(200).json({
      success: true,
      count: fundings.length,
      total_funded: totalFunded,
      fundings,
    });
  } catch (error) {
    console.error("Get contract fundings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contract funding",
    });
  }
};

const getInvestorFundings = async (req, res) => {
  try {
    const { investorId } = req.params;

    if (investorId !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own funding history",
      });
    }

    const fundings = await prisma.funding.findMany({
      where: {
        investor_id: investorId,
      },
      orderBy: {
        timestamp: "desc",
      },
      include: {
        contract: {
          select: {
            contract_id: true,
            merchant_id: true,
            principal: true,
            share_pct: true,
            cap_amount: true,
            duration_days: true,
            status: true,
          },
        },
      },
    });

    const totalInvested = fundings.reduce(
      (total, funding) => total + Number(funding.amount_committed),
      0
    );

    return res.status(200).json({
      success: true,
      count: fundings.length,
      total_invested: totalInvested,
      fundings,
    });
  } catch (error) {
    console.error("Get investor fundings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch investor funding history",
    });
  }
};

module.exports = {
  createFunding,
  getContractFundings,
  getInvestorFundings,
};