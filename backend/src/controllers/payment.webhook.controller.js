const crypto = require("crypto");
const prisma = require("../config/prisma");
const { calculatePaymentSplit } = require("../services/split.service");

const verifyWebhookSignature = (rawBody, signature) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (expectedBuffer.length !== signatureBuffer.length) {
   return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);

};

const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];

    if (!verifyWebhookSignature(req.rawBody, signature)) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const event = req.body;

    if (event.event !== "payment.captured") {
      return res.status(200).json({
        success: true,
        message: "Event ignored",
      });
    }

    const payment = event.payload?.payment?.entity;

    if (!payment?.id || !payment?.order_id || !payment?.amount) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment payload",
      });
    }

    const idempotencyKey = `razorpay_${payment.id}`;

    const existingTransaction = await prisma.transaction.findUnique({
      where: {
        idempotency_key: idempotencyKey,
      },
    });

    if (existingTransaction) {
      return res.status(200).json({
        success: true,
        message: "Payment already processed",
        duplicate: true,
      });
    }

    // Contract ID is stored in the Razorpay order notes.
    const contractId = payment.notes?.contract_id;

    if (!contractId) {
      return res.status(400).json({
        success: false,
        message: "Contract ID missing from payment metadata",
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

    const grossAmount = Number(payment.amount) / 100;
    const currentRepaid = Number(contract.total_repaid || 0);
    const capAmount = Number(contract.cap_amount);

    const remainingCap = Math.max(0, capAmount - currentRepaid);

    if (grossAmount > remainingCap) {
      return res.status(400).json({
        success: false,
        message: "Payment exceeds remaining repayment cap",
        remaining_cap: remainingCap,
      });
    }

    const split = calculatePaymentSplit({
      grossAmount,
      sharePct: Number(contract.share_pct),
      platformFeePct: Number(contract.platform_fee_pct || 0),
    });

    const newTotalRepaid = Number(
      (currentRepaid + grossAmount).toFixed(2)
    );

    await prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          contract_id: contractId,
          payment_id: payment.id,
          gross_amount: split.gross_amount,
          merchant_share: split.merchant_share,
          investor_share: split.investor_share,
          platform_fee: split.platform_fee,
          idempotency_key: idempotencyKey,
          status: "CAPTURED",
        },
      });

      await tx.contract.update({
        where: {
          contract_id: contractId,
        },
        data: {
          total_repaid: newTotalRepaid,
          status: newTotalRepaid >= capAmount ? "Fulfilled" : "Active",
        },
      });
    });

    return res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      transaction: {
        payment_id: payment.id,
        ...split,
        total_repaid: newTotalRepaid,
        contract_status:
          newTotalRepaid >= capAmount ? "Fulfilled" : "Active",
      },
    });
  } catch (error) {
    console.error("Razorpay webhook error:", error);

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};

module.exports = {
  handleRazorpayWebhook,
};