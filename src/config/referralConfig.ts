/**
 * Referral System Configuration
 * -------------------------------
 * This file defines the referral system parameters including
 * commission rates and plan types.
 */

// Maximum depth of the referral tree (how many levels get commissions)
export const MAX_REFERRAL_DEPTH = 10;

// Define available plans and their amounts
export const PLANS = {
  BASIC: {
    amount: 800, // Amount in INR
    label: 'Basic Plan'
  },
  PREMIUM: {
    amount: 2500, // Amount in INR
    label: 'Premium Plan'
  }
};

// Define commission rates for each level (as percentage)
const COMMISSION_RATES = {
  BASIC: { // ₹800 Package
    1: 15,  // 15%
    2: 2,   // 2%
    3: 3,   // 3%
    4: 4,   // 4%
    5: 5,   // 5%
    6: 6,   // 6%
    7: 7,   // 7%
    8: 8,   // 8%
    9: 9,   // 9%
    10: 10  // 10%
  },
  PREMIUM: { // ₹2500 Package
    1: 12,  // 12%
    2: 2,   // 2%
    3: 3,   // 3%
    4: 4,   // 4%
    5: 5,   // 5%
    6: 6,   // 6%
    7: 7,   // 7%
    8: 8,   // 8%
    9: 9,   // 9%
    10: 10  // 10%
  }
};

/**
 * Get commission rate based on plan type and level
 * @param planType Plan type ('basic' or 'premium')
 * @param level Referral level
 * @returns Commission rate as percentage
 */
export function getCommissionRate(planType: 'basic' | 'premium', level: number): number {
  const rates = planType === 'basic' ? COMMISSION_RATES.BASIC : COMMISSION_RATES.PREMIUM;
  
  // Make sure level is within the maximum depth
  if (level > MAX_REFERRAL_DEPTH) return 0;
  
  // Return the commission rate for the specified level
  return rates[level] || 0;
}

/**
 * Calculate commission amount based on plan amount and rate
 * @param planAmount Amount of the plan purchased
 * @param rate Commission rate as percentage
 * @returns Commission amount
 */
export function calculateCommission(planAmount: number, rate: number): number {
  return (planAmount * rate) / 100;
}