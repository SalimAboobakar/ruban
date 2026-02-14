import type { ROIMetrics, LoadOptimization, SustainabilityMetrics } from '../types';
import { calculateROI, roundTo } from './calculations';

/**
 * Calculate comprehensive ROI metrics
 */
/**
 * Calculate ROI metrics
 * Implementation cost based on realistic estimates:
 * - Smart meters: 3,500 ر.ع per company × 12 companies = 42,000 ر.ع
 * - Software & integration: 15,000 ر.ع
 * - Training & setup: 8,000 ر.ع
 * Total: ~65,000 ر.ع
 */
export function calculateROIMetrics(
  loadOptimization: LoadOptimization,
  sustainability: SustainabilityMetrics,
  implementationCost: number = 65000 // 65,000 ر.ع implementation cost (realistic for 12 companies)
): ROIMetrics {
  // Daily savings from load optimization (assuming 8 peak hours)
  const dailyLoadOptimizationSavings = (loadOptimization.savings / 8) * 24;
  const monthlyLoadOptimizationSavings = dailyLoadOptimizationSavings * 30;
  
  // Monthly savings breakdown (in Omani Rial)
  // Realistic estimates based on industry standards:
  // - Predictive maintenance: saves 5-8% of maintenance costs
  // - Average maintenance cost for port: ~150,000 ر.ع/month
  // - Savings: ~10,000 ر.ع/month
  const monthlySavings = {
    fromLoadOptimization: roundTo(monthlyLoadOptimizationSavings, 0),
    fromRenewableEnergy: roundTo(sustainability.costSavings.fromRenewables, 0),
    fromPredictiveMaintenance: 10000, // Estimated 10,000 ر.ع/month from predictive maintenance
    total: 0,
  };
  
  monthlySavings.total = roundTo(
    monthlySavings.fromLoadOptimization +
    monthlySavings.fromRenewableEnergy +
    monthlySavings.fromPredictiveMaintenance,
    0
  );
  
  // Annual savings
  const annualSavings = monthlySavings.total * 12;
  
  // ROI calculations
  const roiMetrics = calculateROI(monthlySavings.total, implementationCost);
  
  // Daily and weekly savings
  const dailySavings = roundTo(monthlySavings.total / 30, 0);
  const weeklySavings = roundTo(monthlySavings.total / 4.33, 0);
  
  return {
    monthlySavings,
    annualSavings: roundTo(annualSavings, 0),
    implementationCost,
    paybackPeriod: roiMetrics.paybackPeriod,
    roi: roiMetrics.annualROI,
    dailySavings,
    weeklySavings,
  };
}

