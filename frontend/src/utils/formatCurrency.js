export function formatCurrency(amount, options = {}) {
  const isBool = typeof options === 'boolean';
  const showDecimals = isBool ? options : Boolean(options?.decimals);

  if (typeof amount === 'string' && amount.startsWith('₹') && !showDecimals && !options?.maximumFractionDigits) {
    return amount;
  }

  const numeric = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : Number(amount);
  if (isNaN(numeric)) return showDecimals ? '₹0.00' : '₹0';

  const minDigits = typeof options === 'object' && options?.minimumFractionDigits !== undefined
    ? options.minimumFractionDigits
    : (showDecimals ? 2 : 0);

  const maxDigits = typeof options === 'object' && options?.maximumFractionDigits !== undefined
    ? options.maximumFractionDigits
    : (showDecimals ? 2 : 0);

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits
  }).format(numeric);
}

export function formatCurrencyWithDecimals(amount) {
  return formatCurrency(amount, true);
}

export default formatCurrency;
