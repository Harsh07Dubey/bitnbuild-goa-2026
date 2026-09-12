const Razorpay = require("razorpay");

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.warn("Razorpay credentials are not configured");
}

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

const createOrder = async ({ amount, currency = "INR", contractId }) => {
  if (!amount || Number(amount) <= 0) {
    throw new Error("Valid amount is required");
  }

  const options = {
    amount: Math.round(Number(amount) * 100),
    currency,
    receipt: `ff_${Date.now()}`,
    notes: {
      contract_id: contractId,
      protocol: "FairFuture Dynamic Revenue Split",
    },
  };

  return razorpay.orders.create(options);
};

module.exports = {
  razorpay,
  createOrder,
};