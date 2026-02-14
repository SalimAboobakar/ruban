import type { PortStatus, Company, LoadOptimization, OptimizationRecommendation } from '../types';
import { COMPANIES } from '../data/companies';
import { calculateCost, calculatePeakOffPeakDifference, calculateLoadShiftSavings, roundTo } from './calculations';

// Realistic rates for Oman industrial sector (ر.ع/MWh)
const PEAK_RATE = 25; // Peak hours: 8am-6pm
const OFF_PEAK_RATE = 15; // Off-peak hours

/**
 * Generate load optimization recommendations
 */
export function generateLoadOptimization(
  portStatus: PortStatus
): LoadOptimization {
  const currentHour = new Date(portStatus.timestamp).getHours();
  const isPeakHour = currentHour >= 8 && currentHour <= 17;
  
  const currentCost = portStatus.cost_per_hour;
  const recommendations: OptimizationRecommendation[] = [];
  
  // Analyze each company
  portStatus.companies.forEach((companyReading) => {
    const company = COMPANIES.find((c) => c.id === companyReading.meter_id);
    if (!company) return;
    
    const currentPower = companyReading.current_power_mw;
    const baseLoad = company.base_load_mw;
    
    // Recommendation 1: Load shifting for peak hours
    if (isPeakHour && currentPower > baseLoad * 0.9) {
      const hoursToShift = 2; // Shift 2 hours
      const savings = calculateLoadShiftSavings(currentPower, hoursToShift);
      
      if (savings > 40) { // Only recommend if savings > 40 ر.ع
        recommendations.push({
          id: `opt-${company.id}-load-shift`,
          companyId: company.id,
          companyName: company.name,
          type: 'load_shift',
          description: `تأجيل تشغيل ${company.name} لمدة ${hoursToShift} ساعات من ساعات الذروة`,
          currentCost: calculateCost(currentPower, PEAK_RATE), // Peak rate
          optimizedCost: calculateCost(currentPower, OFF_PEAK_RATE), // Off-peak rate
          savings: roundTo(savings, 0),
          implementationDifficulty: company.criticality === 'high' ? 'medium' : 'easy',
          timeframe: 'يمكن تطبيقه خلال أسبوع',
          priority: savings > 200 ? 'high' : 'medium',
        });
      }
    }
    
    // Recommendation 2: Peak avoidance for non-critical companies
    if (isPeakHour && company.criticality !== 'high' && currentPower > baseLoad * 1.1) {
      const peakDiff = calculatePeakOffPeakDifference(currentPower);
      const dailySavings = peakDiff * 8; // 8 peak hours
      
      if (dailySavings > 80) { // 80 ر.ع/day minimum
        recommendations.push({
          id: `opt-${company.id}-peak-avoidance`,
          companyId: company.id,
          companyName: company.name,
          type: 'peak_avoidance',
          description: `تشغيل ${company.name} في ساعات غير الذروة لتوفير ${roundTo(dailySavings, 0)} ر.ع/يوم`,
          currentCost: calculateCost(currentPower, PEAK_RATE),
          optimizedCost: calculateCost(currentPower, OFF_PEAK_RATE),
          savings: roundTo(dailySavings, 0),
          implementationDifficulty: 'easy',
          timeframe: 'يمكن تطبيقه فوراً',
          priority: 'high',
        });
      }
    }
    
    // Recommendation 3: Schedule optimization for high consumers
    if (currentPower > 100 && company.industry === 'Metals') {
      const optimizationSavings = calculateLoadShiftSavings(currentPower, 3);
      
      if (optimizationSavings > 120) { // 120 ر.ع minimum
        recommendations.push({
          id: `opt-${company.id}-schedule`,
          companyId: company.id,
          companyName: company.name,
          type: 'schedule',
          description: `تحسين جدولة ${company.name} لتشغيل 3 ساعات في غير الذروة`,
          currentCost: calculateCost(currentPower, PEAK_RATE),
          optimizedCost: calculateCost(currentPower, OFF_PEAK_RATE),
          savings: roundTo(optimizationSavings, 0),
          implementationDifficulty: 'medium',
          timeframe: 'يمكن تطبيقه خلال أسبوعين',
          priority: 'high',
        });
      }
    }
  });
  
  // Calculate total optimized cost
  const totalOptimizedCost = recommendations.reduce((sum, rec) => {
    return sum + (rec.currentCost - rec.savings);
  }, currentCost - recommendations.reduce((sum, rec) => sum + rec.savings, 0));
  
  const totalSavings = recommendations.reduce((sum, rec) => sum + rec.savings, 0);
  const savingsPercentage = (totalSavings / currentCost) * 100;
  
  return {
    currentCost: roundTo(currentCost, 0),
    optimizedCost: roundTo(Math.max(0, totalOptimizedCost), 0),
    savings: roundTo(totalSavings, 0),
    savingsPercentage: roundTo(savingsPercentage, 1),
    recommendations: recommendations.sort((a, b) => {
      // Sort by priority and savings
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.savings - a.savings;
    }),
  };
}

