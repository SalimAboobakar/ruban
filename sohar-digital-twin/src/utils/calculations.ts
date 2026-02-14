import type { Trend } from '../types';

/**
 * Calculate trend based on historical data
 * @param current - Current value
 * @param previous - Previous value
 * @returns Trend direction
 */
export function calculateTrend(current: number, previous: number): Trend {
  const change = current - previous;
  const changePercent = (change / previous) * 100;
  
  if (Math.abs(changePercent) < 2) return 'stable';
  return changePercent > 0 ? 'increasing' : 'decreasing';
}

/**
 * Calculate power cost based on consumption
 * @param powerMW - Power in megawatts
 * @param ratePerMWh - Rate per MWh (default: 20 ر.ع - official Oman industrial tariff)
 * @returns Cost per hour in Omani Rial
 * 
 * Official Oman Industrial Electricity Tariff (2024):
 * - Large Industrial Consumers (>1 MW): 0.020 ر.ع/kWh = 20 ر.ع/MWh
 * - This rate applies to Sohar Port industrial companies
 * 
 * Calculation: 
 * - 1 MW = 1 MWh per hour (for continuous consumption)
 * - Cost = powerMW × ratePerMWh = ر.ع/ساعة
 * 
 * Source: OPWP (Oman Power and Water Procurement Company) - Industrial Large Consumer Rate
 * Verified: Standard industrial tariff for large consumers in Oman
 */
export function calculateCost(powerMW: number, ratePerMWh: number = 20): number {
  // Ensure non-negative values
  if (powerMW < 0) return 0;
  return Math.round(powerMW * ratePerMWh * 100) / 100; // Round to 2 decimal places
}

/**
 * Get peak factor based on hour of day
 * @param hour - Hour of day (0-23)
 * @returns Multiplication factor for peak/off-peak
 * 
 * Note: This is a simplified factor. In reality, heavy industries
 * (metals, petrochemicals) operate 24/7 with minimal variation.
 * Light industries and logistics show more variation.
 */
export function getPeakFactor(hour: number): number {
  // Peak hours: 8am-6pm (08:00-18:00)
  if (hour >= 8 && hour <= 17) {
    return 1.25; // 25% higher during peak (averaged across all industries)
  }
  return 0.90; // 10% lower during off-peak
}

/**
 * Generate random variance for realistic simulation
 * @param min - Minimum multiplier (default: 0.9)
 * @param max - Maximum multiplier (default: 1.1)
 * @returns Random variance factor
 */
export function getRandomVariance(min: number = 0.9, max: number = 1.1): number {
  return min + Math.random() * (max - min);
}

/**
 * Round to specified decimal places
 * @param value - Number to round
 * @param decimals - Number of decimal places
 * @returns Rounded number
 */
export function roundTo(value: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// ============ New Calculation Functions for Enhanced Features ============

/**
 * Calculate cost difference between peak and off-peak hours
 * @param powerMW - Power consumption in MW
 * @param peakRate - Rate during peak hours (ر.ع/MWh) - default: 25 ر.ع/MWh
 * @param offPeakRate - Rate during off-peak hours (ر.ع/MWh) - default: 15 ر.ع/MWh
 * @returns Cost difference per hour in Omani Rial
 * 
 * Realistic rates for Oman:
 * - Peak hours (8am-6pm): 25 ر.ع/MWh
 * - Off-peak hours: 15 ر.ع/MWh
 * Source: OPWP tariff structure
 */
export function calculatePeakOffPeakDifference(
  powerMW: number,
  peakRate: number = 25,
  offPeakRate: number = 15
): number {
  const peakCost = powerMW * peakRate;
  const offPeakCost = powerMW * offPeakRate;
  return peakCost - offPeakCost;
}

/**
 * Calculate potential savings from load shifting
 * @param powerMW - Power consumption in MW
 * @param hoursToShift - Number of hours to shift from peak to off-peak
 * @returns Potential daily savings
 */
export function calculateLoadShiftSavings(
  powerMW: number,
  hoursToShift: number = 2
): number {
  const hourlyDiff = calculatePeakOffPeakDifference(powerMW);
  return hourlyDiff * hoursToShift;
}

/**
 * Calculate ROI metrics
 * @param monthlySavings - Monthly savings in Omani Rial (ر.ع)
 * @param implementationCost - One-time implementation cost in Omani Rial (ر.ع)
 * @returns ROI metrics object
 */
export function calculateROI(
  monthlySavings: number,
  implementationCost: number
): {
  paybackPeriod: number; // months
  annualROI: number; // percentage
  threeYearROI: number; // percentage
} {
  const paybackPeriod = implementationCost / monthlySavings;
  const annualSavings = monthlySavings * 12;
  const annualROI = ((annualSavings - implementationCost) / implementationCost) * 100;
  const threeYearSavings = annualSavings * 3;
  const threeYearROI = ((threeYearSavings - implementationCost) / implementationCost) * 100;

  return {
    paybackPeriod: roundTo(paybackPeriod, 1),
    annualROI: roundTo(annualROI, 1),
    threeYearROI: roundTo(threeYearROI, 1),
  };
}

/**
 * Calculate carbon footprint reduction
 * @param renewableEnergyMW - Renewable energy in MW
 * @param emissionFactor - CO2 emission factor (ton/MWh) - default 0.45 for natural gas
 * @returns CO2 savings per hour in tons
 */
export function calculateCO2Savings(
  renewableEnergyMW: number,
  emissionFactor: number = 0.45
): number {
  return roundTo(renewableEnergyMW * emissionFactor, 2);
}

/**
 * Calculate monthly CO2 savings
 * @param hourlyCO2Savings - CO2 savings per hour in tons
 * @returns Monthly CO2 savings in tons
 */
export function calculateMonthlyCO2Savings(hourlyCO2Savings: number): number {
  return roundTo(hourlyCO2Savings * 24 * 30, 0);
}

