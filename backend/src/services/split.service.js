const calculatePaymentSplit = ({
  grossAmount,
  sharePct,
  platformFeePct = 0,
}) => {
  const gross = Number(grossAmount);
  const investorPercentage = Number(sharePct);
  const platformPercentage = Number(platformFeePct || 0);

  if (!Number.isFinite(gross) || gross <= 0) {
    throw new Error("Invalid gross payment amount");
  }

  if (
    !Number.isFinite(investorPercentage) ||
    investorPercentage < 0 ||
    investorPercentage > 100
  ) {
    throw new Error("Invalid investor share percentage");
  }

  if (
    !Number.isFinite(platformPercentage) ||
    platformPercentage < 0 ||
    platformPercentage > 100
  ) {
    throw new Error("Invalid platform fee percentage");
  }

  if (investorPercentage + platformPercentage > 100) {
    throw new Error("Investor share and platform fee exceed 100%");
  }

  const investorShare = Number(
    ((gross * investorPercentage) / 100).toFixed(2)
  );

  const platformFee = Number(
    ((gross * platformPercentage) / 100).toFixed(2)
  );

  const merchantShare = Number(
    (gross - investorShare - platformFee).toFixed(2)
  );

  return {
    gross_amount: gross,
    merchant_share: merchantShare,
    investor_share: investorShare,
    platform_fee: platformFee,
  };
};

module.exports = {
  calculatePaymentSplit,
};