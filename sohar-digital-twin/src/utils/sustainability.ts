import type { PortStatus, SustainabilityMetrics } from '../types';
import { calculateCO2Savings, calculateMonthlyCO2Savings, roundTo } from './calculations';

/**
 * Calculate sustainability metrics
 */
export function calculateSustainabilityMetrics(
  portStatus: PortStatus,
  renewableEnergyMW: number = 45 // 25 MW solar + 20 MW wind
): SustainabilityMetrics {
  const totalPower = portStatus.total_power_mw;
  const renewablePercentage = (renewableEnergyMW / totalPower) * 100;
  
  // CO2 calculations
  const hourlyCO2Savings = calculateCO2Savings(renewableEnergyMW);
  const monthlyCO2Savings = calculateMonthlyCO2Savings(hourlyCO2Savings);
  
  // Current carbon footprint (assuming rest is from natural gas)
  const nonRenewablePower = totalPower - renewableEnergyMW;
  const currentMonthlyCO2 = calculateMonthlyCO2Savings(nonRenewablePower * 0.45);
  
  // Target: Vision 2040 - 30% renewable energy
  const targetRenewablePercentage = 30;
  const targetRenewableMW = (totalPower * targetRenewablePercentage) / 100;
  const targetMonthlyCO2 = calculateMonthlyCO2Savings(
    (totalPower - targetRenewableMW) * 0.45
  );
  
  const co2Reduction = currentMonthlyCO2 - targetMonthlyCO2;
  const co2ReductionPercentage = (co2Reduction / currentMonthlyCO2) * 100;
  
  // Cost savings (in Omani Rial)
  // Realistic costs for Oman:
  // - Renewable energy: 12 ر.ع/MWh (lower operational cost)
  // - Grid (natural gas): 20 ر.ع/MWh (average industrial rate)
  const renewableCostPerMWh = 12; // Lower cost for renewables
  const gridCostPerMWh = 20; // Grid cost (average industrial rate)
  const costSavingsFromRenewables = renewableEnergyMW * (gridCostPerMWh - renewableCostPerMWh) * 24 * 30;
  
  // Progress towards Vision 2040
  const progress = (renewablePercentage / targetRenewablePercentage) * 100;
  
  return {
    carbonFootprint: {
      current: roundTo(currentMonthlyCO2, 0),
      target: roundTo(targetMonthlyCO2, 0),
      reduction: roundTo(co2Reduction, 0),
      reductionPercentage: roundTo(co2ReductionPercentage, 1),
    },
    renewableEnergy: {
      current: roundTo(renewablePercentage, 1),
      target: targetRenewablePercentage,
      progress: roundTo(Math.min(progress, 100), 1),
    },
    costSavings: {
      fromRenewables: roundTo(costSavingsFromRenewables, 0),
      fromOptimization: 0, // Will be calculated separately
      total: roundTo(costSavingsFromRenewables, 0),
    },
    certifications: {
      iso14001: renewablePercentage >= 10, // ISO 14001 requires environmental management
      carbonNeutral: false, // Not yet carbon neutral
    },
  };
}

