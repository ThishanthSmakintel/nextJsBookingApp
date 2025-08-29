export const currencies = [
  { value: 'USD', label: '🇺🇸 USD - US Dollar', symbol: '$' },
  { value: 'EUR', label: '🇪🇺 EUR - Euro', symbol: '€' },
  { value: 'GBP', label: '🇬🇧 GBP - British Pound', symbol: '£' },
  { value: 'LKR', label: '🇱🇰 LKR - Sri Lankan Rupee', symbol: 'Rs' },
  { value: 'INR', label: '🇮🇳 INR - Indian Rupee', symbol: '₹' },
  { value: 'JPY', label: '🇯🇵 JPY - Japanese Yen', symbol: '¥' },
  { value: 'CAD', label: '🇨🇦 CAD - Canadian Dollar', symbol: 'C$' },
  { value: 'AUD', label: '🇦🇺 AUD - Australian Dollar', symbol: 'A$' }
]

export function formatCurrency(amount, currencyCode = 'USD') {
  const currency = currencies.find(c => c.value === currencyCode)
  const symbol = currency?.symbol || '$'
  return `${symbol}${parseFloat(amount || 0).toFixed(2)}`
}

export function getCurrencySymbol(currencyCode = 'USD') {
  const currency = currencies.find(c => c.value === currencyCode)
  return currency?.symbol || '$'
}