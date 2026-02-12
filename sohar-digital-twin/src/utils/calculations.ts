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
 * @param ratePerMWh - Rate per MWh (default: $80)
 * @returns Cost per hour in dollars
 */
export function calculateCost(powerMW: number, ratePerMWh: number = 80): number {
  return powerMW * ratePerMWh;
}

/**
 * Get peak factor based on hour of day
 * @param hour - Hour of day (0-23)
 * @returns Multiplication factor for peak/off-peak
 */
export function getPeakFactor(hour: number): number {
  // Peak hours: 8am-6pm (08:00-18:00)
  if (hour >= 8 && hour <= 17) {
    return 1.3; // 30% higher during peak
  }
  return 0.85; // 15% lower during off-peak
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

