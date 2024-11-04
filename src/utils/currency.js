// Define conversion rates
const CONVERSION_RATES = {
  TWD: 1, // Base currency (NT$)
  USD: 0.032, // 1 TWD = 0.032 USD (approximate)
};

// Define currency symbols and formatting
const CURRENCY_CONFIG = {
  zh: {
    currency: 'TWD',
    symbol: 'NT$',
    position: 'before', // symbol position
  },
  en: {
    currency: 'USD',
    symbol: '$',
    position: 'before',
  },
};

/**
 * Convert price between currencies and format with proper symbol
 * @param {number} price - Price in TWD (base currency)
 * @param {string} language - Language code ('zh' or 'en')
 * @returns {string} Formatted price with currency symbol
 */
export const formatCurrency = (price, language) => {
  const config = CURRENCY_CONFIG[language] || CURRENCY_CONFIG.zh;
  const rate = CONVERSION_RATES[config.currency];
  
  // Convert price
  const convertedPrice = price * rate;
  
  // Format number to 2 decimal places
  const formattedNumber = convertedPrice.toFixed(2);
  
  // Return formatted string with symbol in correct position
  return config.position === 'before'
    ? `${config.symbol}${formattedNumber}`
    : `${formattedNumber}${config.symbol}`;
};

/**
 * Get raw converted price without formatting
 * @param {number} price - Price in TWD
 * @param {string} language - Language code
 * @returns {number} Converted price
 */
export const convertPrice = (price, language) => {
  const config = CURRENCY_CONFIG[language] || CURRENCY_CONFIG.zh;
  const rate = CONVERSION_RATES[config.currency];
  return price * rate;
}; 