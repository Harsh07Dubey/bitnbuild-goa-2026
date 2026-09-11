export function formatCurrency(amount) {
  if (typeof amount === 'string' && amount.startsWith('₹')) {
    return amount;
  }
  const numeric = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
  if (isNaN(numeric)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numeric);
}

export default formatCurrency;
