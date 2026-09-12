const prisma = require("../config/prisma");
const { createOrder } = require("../services/razorpay.service");

const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const { contractId } = req.params;

    if (!contractId || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "contractId and a valid amount are required",
      });
    }

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

    // Payments are allowed only after the contract is fully funded.
    if (contract.status !== "Funded" && contract.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Contract must be fully funded before accepting payments",
      });
    }

    const requestedAmount = Number(amount);
    const capAmount = Number(contract.cap_amount);
    const totalRepaid = Number(contract.total_repaid || 0);

    const remainingCap = Math.max(0, capAmount - totalRepaid);

    if (remainingCap <= 0) {
      return res.status(400).json({
        success: false,
        message: "Repayment cap has already been reached",
      });
    }

    if (requestedAmount > remainingCap) {
      return res.status(400).json({
        success: false,
        message: "Payment amount exceeds remaining repayment cap",
        remaining_cap: remainingCap,
      });
    }

    const order = await createOrder({
      amount: requestedAmount,
      currency: "INR",
      contractId,
    });

    // First successful payment-order creation activates the contract.
    if (contract.status === "Funded") {
      await prisma.contract.update({
        where: {
          contract_id: contractId,
        },
        data: {
          status: "Active",
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Razorpay payment order created",
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      contract_id: contractId,
    });
  } catch (error) {
    console.error("Create payment order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

module.exports = {
  createPaymentOrder,
};
