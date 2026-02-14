import type { CompanyEnergyProfile } from '../types';

/**
 * Detailed Energy Profiles for 10 Major Industrial Tenants in Sohar Port
 * Data is realistic but demo-safe, internally consistent
 * Total port load ≈ 1200 MW
 */

// Helper function to generate 24h load curve data
function generate24HLoadCurve(
  baseLoad: number,
  peakLoad: number,
  peakHours: number[],
  weekendReduction: number = 0.15
): Array<{ hour: number; weekday_mw: number; weekend_mw: number }> {
  const data: Array<{ hour: number; weekday_mw: number; weekend_mw: number }> = [];
  
  for (let hour = 0; hour < 24; hour++) {
    const isPeakHour = peakHours.includes(hour);
    const weekdayMW = isPeakHour 
      ? peakLoad 
      : baseLoad + (peakLoad - baseLoad) * (0.3 + Math.random() * 0.4);
    const weekendMW = weekdayMW * (1 - weekendReduction);
    
    data.push({
      hour,
      weekday_mw: Math.round(weekdayMW * 10) / 10,
      weekend_mw: Math.round(weekendMW * 10) / 10,
    });
  }
  
  return data;
}

// Helper function to generate monthly peak trend
function generateMonthlyPeakTrend(peakLoad: number): Array<{ month: string; peak_mw: number }> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    peak_mw: Math.round((peakLoad * (0.85 + Math.random() * 0.2)) * 10) / 10,
  }));
}

// Helper function to generate load distribution histogram
function generateLoadDistribution(baseLoad: number, peakLoad: number): Array<{ range: string; frequency: number }> {
  const ranges = [
    { range: `${Math.round(baseLoad * 0.8)}-${Math.round(baseLoad * 0.9)} MW`, frequency: 15 },
    { range: `${Math.round(baseLoad * 0.9)}-${Math.round(baseLoad)} MW`, frequency: 20 },
    { range: `${Math.round(baseLoad)}-${Math.round((baseLoad + peakLoad) / 2)} MW`, frequency: 35 },
    { range: `${Math.round((baseLoad + peakLoad) / 2)}-${Math.round(peakLoad * 0.95)} MW`, frequency: 20 },
    { range: `${Math.round(peakLoad * 0.95)}-${Math.round(peakLoad)} MW`, frequency: 10 },
  ];
  return ranges;
}

// Helper function to calculate Energy Health Score
function calculateEnergyHealthScore(
  loadFactor: number,
  idleLoadRatio: number,
  operationalStability: number,
  volatilityIndex: string
): number {
  let score = 0;
  
  // Load Factor component (0-30 points)
  score += Math.min(30, (loadFactor / 100) * 30);
  
  // Idle Load component (0-25 points) - lower is better
  score += Math.max(0, 25 - (idleLoadRatio / 100) * 25);
  
  // Operational Stability (0-25 points)
  score += (operationalStability / 100) * 25;
  
  // Volatility component (0-20 points) - lower volatility is better
  const volatilityPenalty = volatilityIndex === 'High' ? 5 : volatilityIndex === 'Medium' ? 10 : 20;
  score += volatilityPenalty;
  
  return Math.round(score);
}

export const COMPANY_ENERGY_PROFILES: CompanyEnergyProfile[] = [
  {
    id: 'SA-001',
    companyName: 'Sohar Aluminum',
    sector: 'Metals - Primary Aluminum Smelting',
    connectedVoltageLevel: '132kV',
    averageLoadMW: 580,
    peakLoadMW: 650,
    loadShareOfPort: 48.3,
    growthTrend: 'Stable',
    
    // Realistic 24h load curve for aluminum smelter (continuous operation with slight variations)
    loadProfile24H: [
      { hour: 0, weekday_mw: 545, weekend_mw: 540 },
      { hour: 1, weekday_mw: 540, weekend_mw: 535 },
      { hour: 2, weekday_mw: 535, weekend_mw: 530 },
      { hour: 3, weekday_mw: 530, weekend_mw: 525 },
      { hour: 4, weekday_mw: 525, weekend_mw: 520 },
      { hour: 5, weekday_mw: 530, weekend_mw: 525 },
      { hour: 6, weekday_mw: 540, weekend_mw: 535 },
      { hour: 7, weekday_mw: 560, weekend_mw: 550 },
      { hour: 8, weekday_mw: 580, weekend_mw: 570 },
      { hour: 9, weekday_mw: 600, weekend_mw: 590 },
      { hour: 10, weekday_mw: 620, weekend_mw: 610 },
      { hour: 11, weekday_mw: 640, weekend_mw: 630 },
      { hour: 12, weekday_mw: 650, weekend_mw: 640 },
      { hour: 13, weekday_mw: 650, weekend_mw: 640 },
      { hour: 14, weekday_mw: 645, weekend_mw: 635 },
      { hour: 15, weekday_mw: 640, weekend_mw: 630 },
      { hour: 16, weekday_mw: 630, weekend_mw: 620 },
      { hour: 17, weekday_mw: 610, weekend_mw: 600 },
      { hour: 18, weekday_mw: 590, weekend_mw: 580 },
      { hour: 19, weekday_mw: 575, weekend_mw: 570 },
      { hour: 20, weekday_mw: 565, weekend_mw: 560 },
      { hour: 21, weekday_mw: 555, weekend_mw: 550 },
      { hour: 22, weekday_mw: 550, weekend_mw: 545 },
      { hour: 23, weekday_mw: 545, weekend_mw: 540 },
    ],
    baseLoadMW: 520,
    loadFactor: 89.2,
    peakToAverageRatio: 1.12,
    volatilityIndex: 'Low',
    
    highestMWThisMonth: 648,
    peakContributionRanking: 1,
    estimatedImpactOf3PercentReduction: 19.5,
    coincidenceIndicator: true,
    
    idleLoadRatio: 8.5,
    nightTimeConsumptionPattern: 'Maintains 85% of base load for potline operations. Minimal reduction during night shift. Potlines operate continuously with only minor load variations during anode changes.',
    operationalStabilityScore: 92,
    
    optimizationOpportunities: [
      {
        description: 'Optimize potline anode change schedule to avoid peak tariff hours (10:00-16:00). Current practice spreads changes throughout day, but can be shifted to off-peak periods.',
        expectedSavingsPercent: 3.2,
        implementationDifficulty: 'medium',
      },
      {
        description: 'Implement demand response program to reduce load by 5-8% during peak tariff windows through coordinated potline operations and auxiliary equipment scheduling.',
        expectedSavingsPercent: 2.8,
        implementationDifficulty: 'hard',
      },
      {
        description: 'Upgrade auxiliary systems (compressed air, cooling water pumps, fume treatment fans) with Variable Frequency Drives (VFDs) to reduce base load consumption.',
        expectedSavingsPercent: 4.1,
        implementationDifficulty: 'medium',
      },
      {
        description: 'Optimize casthouse operations scheduling to reduce simultaneous high-load operations during peak hours.',
        expectedSavingsPercent: 2.3,
        implementationDifficulty: 'easy',
      },
    ],
    
    sensitivityIfLoadIncreases10Percent: 58,
    riskLevelToPortConcentration: 'High',
    growthForecastTo2030: 'Stable operations expected. Current capacity of 390,000 tpa maintained. Potential expansion projects (Phase 2) under evaluation but not confirmed. Energy efficiency improvements may reduce specific consumption (kWh/ton) while maintaining production.',
    
    energyIntensityTrend: 'Stable',
    potentialCarbonReductionViaDemandShaping: 12500,
    esgReadinessIndicator: 'High',
    
    // Realistic monthly peak trend (slight seasonal variations)
    monthlyPeakTrend: [
      { month: 'Jan', peak_mw: 642 },
      { month: 'Feb', peak_mw: 638 },
      { month: 'Mar', peak_mw: 645 },
      { month: 'Apr', peak_mw: 648 },
      { month: 'May', peak_mw: 650 },
      { month: 'Jun', peak_mw: 648 },
      { month: 'Jul', peak_mw: 645 },
      { month: 'Aug', peak_mw: 642 },
      { month: 'Sep', peak_mw: 640 },
      { month: 'Oct', peak_mw: 645 },
      { month: 'Nov', peak_mw: 643 },
      { month: 'Dec', peak_mw: 640 },
    ],
    
    // Realistic load distribution (most time spent near average, less time at extremes)
    loadDistributionHistogram: [
      { range: '520-540 MW', frequency: 18 },
      { range: '540-560 MW', frequency: 22 },
      { range: '560-580 MW', frequency: 28 },
      { range: '580-600 MW', frequency: 20 },
      { range: '600-650 MW', frequency: 12 },
    ],
    
    executiveSummary: 'Sohar Aluminum is the dominant energy consumer in Sohar Port, operating a 390,000 tpa aluminum smelter with continuous 24/7 operations. The facility maintains exceptional load factor (89.2%) with minimal volatility, reflecting stable potline operations typical of primary aluminum production. With 6 potlines operating continuously, the facility demonstrates high operational stability (92/100). Peak demand (650 MW) aligns with Oman tariff peak windows (10:00-16:00), presenting significant optimization opportunities through demand response programs. The company shows strong ESG readiness and has potential for 12,500 tons CO₂/year reduction through demand shaping initiatives. Current idle load is low (8.5%), indicating efficient operations, but opportunities exist in auxiliary system optimization and load scheduling.',
    
    energyHealthScore: 0, // Will be calculated
  },
  
  {
    id: 'JS-002',
    companyName: 'Jindal Shadeed Iron & Steel',
    sector: 'Metals - Steel Production',
    connectedVoltageLevel: '132kV',
    averageLoadMW: 145,
    peakLoadMW: 185,
    loadShareOfPort: 12.1,
    growthTrend: 'Increasing',
    
    loadProfile24H: generate24HLoadCurve(120, 185, [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 0.2),
    baseLoadMW: 120,
    loadFactor: 78.4,
    peakToAverageRatio: 1.28,
    volatilityIndex: 'Medium',
    
    highestMWThisMonth: 182,
    peakContributionRanking: 2,
    estimatedImpactOf3PercentReduction: 5.6,
    coincidenceIndicator: true,
    
    idleLoadRatio: 12.3,
    nightTimeConsumptionPattern: 'Reduces to 70% of base load during night shift. Arc furnace operations scheduled during day.',
    operationalStabilityScore: 78,
    
    optimizationOpportunities: [
      {
        description: 'Optimize arc furnace charging schedule to avoid peak tariff windows',
        expectedSavingsPercent: 4.5,
        implementationDifficulty: 'medium',
      },
      {
        description: 'Reduce idle load during furnace maintenance and relining periods',
        expectedSavingsPercent: 3.8,
        implementationDifficulty: 'easy',
      },
      {
        description: 'Improve load distribution across multiple furnaces to increase Load Factor',
        expectedSavingsPercent: 2.9,
        implementationDifficulty: 'hard',
      },
    ],
    
    sensitivityIfLoadIncreases10Percent: 14.5,
    riskLevelToPortConcentration: 'Medium',
    growthForecastTo2030: 'Expansion plans underway. Expected 15-20% capacity increase by 2027.',
    
    energyIntensityTrend: 'Improving',
    potentialCarbonReductionViaDemandShaping: 3200,
    esgReadinessIndicator: 'Medium',
    
    monthlyPeakTrend: generateMonthlyPeakTrend(185),
    loadDistributionHistogram: generateLoadDistribution(120, 185),
    
    executiveSummary: 'Jindal Shadeed operates a 1.5 MTPA steel plant with variable load patterns driven by arc furnace operations. The facility shows moderate load factor (78.4%) with some volatility during production cycles. Peak demand coincides with tariff windows, offering demand response potential. Recent efficiency improvements are reflected in improving energy intensity trends.',
    
    energyHealthScore: 0,
  },
  
  {
    id: 'VO-003',
    companyName: 'Vale Oman Pelletizing',
    sector: 'Metals - Iron Ore Processing',
    connectedVoltageLevel: '33kV',
    averageLoadMW: 105,
    peakLoadMW: 135,
    loadShareOfPort: 8.8,
    growthTrend: 'Stable',
    
    loadProfile24H: generate24HLoadCurve(90, 135, [9, 10, 11, 12, 13, 14, 15, 16], 0.15),
    baseLoadMW: 90,
    loadFactor: 77.8,
    peakToAverageRatio: 1.29,
    volatilityIndex: 'Medium',
    
    highestMWThisMonth: 133,
    peakContributionRanking: 3,
    estimatedImpactOf3PercentReduction: 4.1,
    coincidenceIndicator: true,
    
    idleLoadRatio: 10.8,
    nightTimeConsumptionPattern: 'Maintains 80% of base load. Pelletizing plant operates with reduced throughput at night.',
    operationalStabilityScore: 81,
    
    optimizationOpportunities: [
      {
        description: 'Optimize pelletizing line scheduling to improve Load Factor',
        expectedSavingsPercent: 3.5,
        implementationDifficulty: 'medium',
      },
      {
        description: 'Consider VFD for large motors in grinding and pelletizing circuits',
        expectedSavingsPercent: 4.2,
        implementationDifficulty: 'medium',
      },
      {
        description: 'Reduce idle load during line changeovers and maintenance',
        expectedSavingsPercent: 2.6,
        implementationDifficulty: 'easy',
      },
    ],
    
    sensitivityIfLoadIncreases10Percent: 10.5,
    riskLevelToPortConcentration: 'Medium',
    growthForecastTo2030: 'Stable operations. No major expansion planned in near term.',
    
    energyIntensityTrend: 'Stable',
    potentialCarbonReductionViaDemandShaping: 2100,
    esgReadinessIndicator: 'High',
    
    monthlyPeakTrend: generateMonthlyPeakTrend(135),
    loadDistributionHistogram: generateLoadDistribution(90, 135),
    
    executiveSummary: 'Vale Oman operates a 9 MTPA iron ore pelletizing plant with consistent operations. The facility maintains moderate load factor (77.8%) with some variability during production cycles. The plant demonstrates good operational stability and strong ESG practices.',
    
    energyHealthScore: 0,
  },
  
  {
    id: 'SPC-004',
    companyName: 'Sohar Power Company',
    sector: 'Energy - Power Generation',
    connectedVoltageLevel: '132kV',
    averageLoadMW: 48,
    peakLoadMW: 62,
    loadShareOfPort: 4.0,
    growthTrend: 'Stable',
    
    loadProfile24H: generate24HLoadCurve(42, 62, [12, 13, 14, 15, 16, 17, 18, 19], 0.1),
    baseLoadMW: 42,
    loadFactor: 77.4,
    peakToAverageRatio: 1.29,
    volatilityIndex: 'Low',
    
    highestMWThisMonth: 61,
    peakContributionRanking: 4,
    estimatedImpactOf3PercentReduction: 1.9,
    coincidenceIndicator: true,
    
    idleLoadRatio: 6.2,
    nightTimeConsumptionPattern: 'Maintains base load for grid stability. Minimal variation throughout 24h cycle.',
    operationalStabilityScore: 95,
    
    optimizationOpportunities: [
      {
        description: 'Optimize turbine loading to improve efficiency during partial load conditions',
        expectedSavingsPercent: 2.8,
        implementationDifficulty: 'hard',
      },
      {
        description: 'Improve heat rate through better fuel management',
        expectedSavingsPercent: 3.1,
        implementationDifficulty: 'medium',
      },
    ],
    
    sensitivityIfLoadIncreases10Percent: 4.8,
    riskLevelToPortConcentration: 'Low',
    growthForecastTo2030: 'Stable. Power purchase agreements in place through 2030.',
    
    energyIntensityTrend: 'Stable',
    potentialCarbonReductionViaDemandShaping: 850,
    esgReadinessIndicator: 'Medium',
    
    monthlyPeakTrend: generateMonthlyPeakTrend(62),
    loadDistributionHistogram: generateLoadDistribution(42, 62),
    
    executiveSummary: 'Sohar Power Company operates a 585 MW combined cycle power plant serving the port and industrial zone. The facility maintains high operational stability (95%) with consistent base load operations. Load factor is moderate (77.4%) reflecting grid demand patterns.',
    
    energyHealthScore: 0,
  },
  
  {
    id: 'ORC-005',
    companyName: 'Oman Refineries Company',
    sector: 'Petrochemicals - Oil Refining',
    connectedVoltageLevel: '33kV',
    averageLoadMW: 42,
    peakLoadMW: 55,
    loadShareOfPort: 3.5,
    growthTrend: 'Stable',
    
    loadProfile24H: generate24HLoadCurve(38, 55, [10, 11, 12, 13, 14, 15, 16], 0.12),
    baseLoadMW: 38,
    loadFactor: 76.4,
    peakToAverageRatio: 1.31,
    volatilityIndex: 'Low',
    
    highestMWThisMonth: 54,
    peakContributionRanking: 5,
    estimatedImpactOf3PercentReduction: 1.7,
    coincidenceIndicator: true,
    
    idleLoadRatio: 9.1,
    nightTimeConsumptionPattern: 'Maintains 88% of base load. Continuous process operations with minimal variation.',
    operationalStabilityScore: 88,
    
    optimizationOpportunities: [
      {
        description: 'Optimize pump and compressor operations using VFD technology',
        expectedSavingsPercent: 4.8,
        implementationDifficulty: 'medium',
      },
      {
        description: 'Improve load scheduling for maintenance activities',
        expectedSavingsPercent: 2.4,
        implementationDifficulty: 'easy',
      },
      {
        description: 'Optimize distillation column operations to reduce peak demand',
        expectedSavingsPercent: 3.3,
        implementationDifficulty: 'hard',
      },
    ],
    
    sensitivityIfLoadIncreases10Percent: 4.2,
    riskLevelToPortConcentration: 'Low',
    growthForecastTo2030: 'Stable operations. Modernization projects may increase efficiency but not total load.',
    
    energyIntensityTrend: 'Improving',
    potentialCarbonReductionViaDemandShaping: 720,
    esgReadinessIndicator: 'High',
    
    monthlyPeakTrend: generateMonthlyPeakTrend(55),
    loadDistributionHistogram: generateLoadDistribution(38, 55),
    
    executiveSummary: 'Oman Refineries operates a 106,000 bpd refinery with continuous process operations. The facility maintains good load factor (76.4%) with low volatility, reflecting stable refining operations. Recent modernization efforts are improving energy intensity.',
    
    energyHealthScore: 0,
  },
  
  {
    id: 'AL-006',
    companyName: 'Air Liquide Sohar',
    sector: 'Industrial Gases',
    connectedVoltageLevel: '33kV',
    averageLoadMW: 38,
    peakLoadMW: 48,
    loadShareOfPort: 3.2,
    growthTrend: 'Stable',
    
    loadProfile24H: generate24HLoadCurve(34, 48, [9, 10, 11, 12, 13, 14, 15, 16, 17], 0.18),
    baseLoadMW: 34,
    loadFactor: 79.2,
    peakToAverageRatio: 1.26,
    volatilityIndex: 'Low',
    
    highestMWThisMonth: 47,
    peakContributionRanking: 6,
    estimatedImpactOf3PercentReduction: 1.4,
    coincidenceIndicator: true,
    
    idleLoadRatio: 7.8,
    nightTimeConsumptionPattern: 'Maintains 82% of base load. Air separation units operate continuously with minimal variation.',
    operationalStabilityScore: 91,
    
    optimizationOpportunities: [
      {
        description: 'Optimize air separation unit operations to reduce peak demand',
        expectedSavingsPercent: 3.6,
        implementationDifficulty: 'hard',
      },
      {
        description: 'Consider VFD for large compressors in air separation process',
        expectedSavingsPercent: 4.5,
        implementationDifficulty: 'medium',
      },
    ],
    
    sensitivityIfLoadIncreases10Percent: 3.8,
    riskLevelToPortConcentration: 'Low',
    growthForecastTo2030: 'Stable. Long-term supply agreements in place with major port tenants.',
    
    energyIntensityTrend: 'Stable',
    potentialCarbonReductionViaDemandShaping: 650,
    esgReadinessIndicator: 'High',
    
    monthlyPeakTrend: generateMonthlyPeakTrend(48),
    loadDistributionHistogram: generateLoadDistribution(34, 48),
    
    executiveSummary: 'Air Liquide operates air separation units producing industrial gases for port tenants. The facility maintains high load factor (79.2%) with excellent operational stability (91%). Continuous operations with minimal variability characterize this critical infrastructure provider.',
    
    energyHealthScore: 0,
  },
  
  {
    id: 'OQ-007',
    companyName: 'OQ Methanol',
    sector: 'Petrochemicals - Methanol Production',
    connectedVoltageLevel: '33kV',
    averageLoadMW: 32,
    peakLoadMW: 42,
    loadShareOfPort: 2.7,
    growthTrend: 'Stable',
    
    loadProfile24H: generate24HLoadCurve(28, 42, [10, 11, 12, 13, 14, 15, 16], 0.15),
    baseLoadMW: 28,
    loadFactor: 76.2,
    peakToAverageRatio: 1.31,
    volatilityIndex: 'Low',
    
    highestMWThisMonth: 41,
    peakContributionRanking: 7,
    estimatedImpactOf3PercentReduction: 1.3,
    coincidenceIndicator: true,
    
    idleLoadRatio: 8.5,
    nightTimeConsumptionPattern: 'Maintains 85% of base load. Continuous methanol synthesis process with stable operations.',
    operationalStabilityScore: 87,
    
    optimizationOpportunities: [
      {
        description: 'Optimize synthesis gas compressor operations',
        expectedSavingsPercent: 3.9,
        implementationDifficulty: 'medium',
      },
      {
        description: 'Improve heat integration to reduce electrical load',
        expectedSavingsPercent: 2.7,
        implementationDifficulty: 'hard',
      },
    ],
    
    sensitivityIfLoadIncreases10Percent: 3.2,
    riskLevelToPortConcentration: 'Low',
    growthForecastTo2030: 'Stable operations. No expansion plans in current portfolio.',
    
    energyIntensityTrend: 'Stable',
    potentialCarbonReductionViaDemandShaping: 540,
    esgReadinessIndicator: 'Medium',
    
    monthlyPeakTrend: generateMonthlyPeakTrend(42),
    loadDistributionHistogram: generateLoadDistribution(28, 42),
    
    executiveSummary: 'OQ Methanol operates a 1.05 MTPA methanol plant with continuous process operations. The facility maintains good load factor (76.2%) with low volatility, reflecting stable synthesis operations. Good operational stability supports consistent production.',
    
    energyHealthScore: 0,
  },
  
  {
    id: 'SFZ-008',
    companyName: 'Sohar Freezone Logistics',
    sector: 'Logistics - Warehousing & Distribution',
    connectedVoltageLevel: '11kV',
    averageLoadMW: 18,
    peakLoadMW: 28,
    loadShareOfPort: 1.5,
    growthTrend: 'Increasing',
    
    loadProfile24H: generate24HLoadCurve(12, 28, [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 0.35),
    baseLoadMW: 12,
    loadFactor: 64.3,
    peakToAverageRatio: 1.56,
    volatilityIndex: 'High',
    
    highestMWThisMonth: 27,
    peakContributionRanking: 8,
    estimatedImpactOf3PercentReduction: 0.8,
    coincidenceIndicator: true,
    
    idleLoadRatio: 18.5,
    nightTimeConsumptionPattern: 'Reduces to 45% of base load during night. Warehouse operations primarily daytime-focused.',
    operationalStabilityScore: 65,
    
    optimizationOpportunities: [
      {
        description: 'Reduce idle load during low activity periods (nights, weekends)',
        expectedSavingsPercent: 5.2,
        implementationDifficulty: 'easy',
      },
      {
        description: 'Improve load scheduling to increase Load Factor',
        expectedSavingsPercent: 4.1,
        implementationDifficulty: 'medium',
      },
      {
        description: 'Consider energy-efficient lighting and HVAC systems',
        expectedSavingsPercent: 3.8,
        implementationDifficulty: 'medium',
      },
    ],
    
    sensitivityIfLoadIncreases10Percent: 1.8,
    riskLevelToPortConcentration: 'Low',
    growthForecastTo2030: 'Growing. Expected 25-30% increase in operations by 2028.',
    
    energyIntensityTrend: 'Improving',
    potentialCarbonReductionViaDemandShaping: 310,
    esgReadinessIndicator: 'Medium',
    
    monthlyPeakTrend: generateMonthlyPeakTrend(28),
    loadDistributionHistogram: generateLoadDistribution(12, 28),
    
    executiveSummary: 'Sohar Freezone Logistics operates warehousing and distribution facilities with highly variable load patterns. The facility shows lower load factor (64.3%) with high volatility, reflecting business-hour operations. Significant optimization potential exists through idle load reduction and scheduling improvements.',
    
    energyHealthScore: 0,
  },
  
  {
    id: 'GPS-009',
    companyName: 'Gulf Petrochemical Services',
    sector: 'Petrochemicals - Downstream Processing',
    connectedVoltageLevel: '33kV',
    averageLoadMW: 28,
    peakLoadMW: 38,
    loadShareOfPort: 2.3,
    growthTrend: 'Stable',
    
    loadProfile24H: generate24HLoadCurve(24, 38, [10, 11, 12, 13, 14, 15, 16], 0.14),
    baseLoadMW: 24,
    loadFactor: 73.7,
    peakToAverageRatio: 1.36,
    volatilityIndex: 'Medium',
    
    highestMWThisMonth: 37,
    peakContributionRanking: 9,
    estimatedImpactOf3PercentReduction: 1.1,
    coincidenceIndicator: true,
    
    idleLoadRatio: 11.2,
    nightTimeConsumptionPattern: 'Maintains 80% of base load. Continuous processing with some variation during product changeovers.',
    operationalStabilityScore: 79,
    
    optimizationOpportunities: [
      {
        description: 'Optimize process unit operations to reduce peak demand',
        expectedSavingsPercent: 3.4,
        implementationDifficulty: 'medium',
      },
      {
        description: 'Reduce idle load during product changeover periods',
        expectedSavingsPercent: 2.9,
        implementationDifficulty: 'easy',
      },
      {
        description: 'Consider VFD for pumps and compressors',
        expectedSavingsPercent: 4.3,
        implementationDifficulty: 'medium',
      },
    ],
    
    sensitivityIfLoadIncreases10Percent: 2.8,
    riskLevelToPortConcentration: 'Low',
    growthForecastTo2030: 'Stable. Focus on efficiency improvements rather than capacity expansion.',
    
    energyIntensityTrend: 'Improving',
    potentialCarbonReductionViaDemandShaping: 480,
    esgReadinessIndicator: 'Medium',
    
    monthlyPeakTrend: generateMonthlyPeakTrend(38),
    loadDistributionHistogram: generateLoadDistribution(24, 38),
    
    executiveSummary: 'Gulf Petrochemical Services operates downstream petrochemical processing facilities with moderate load patterns. The facility maintains reasonable load factor (73.7%) with some volatility during production cycles. Recent efficiency initiatives are showing positive results.',
    
    energyHealthScore: 0,
  },
  
  {
    id: 'PSM-010',
    companyName: 'Port Services & Marine Ops',
    sector: 'Marine Services - Port Operations',
    connectedVoltageLevel: '11kV',
    averageLoadMW: 15,
    peakLoadMW: 25,
    loadShareOfPort: 1.3,
    growthTrend: 'Increasing',
    
    loadProfile24H: generate24HLoadCurve(10, 25, [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 0.3),
    baseLoadMW: 10,
    loadFactor: 60.0,
    peakToAverageRatio: 1.67,
    volatilityIndex: 'High',
    
    highestMWThisMonth: 24,
    peakContributionRanking: 10,
    estimatedImpactOf3PercentReduction: 0.8,
    coincidenceIndicator: true,
    
    idleLoadRatio: 22.3,
    nightTimeConsumptionPattern: 'Reduces to 40% of base load during night. Port operations peak during vessel arrivals and cargo handling.',
    operationalStabilityScore: 58,
    
    optimizationOpportunities: [
      {
        description: 'Significantly reduce idle load during low activity periods',
        expectedSavingsPercent: 5.8,
        implementationDifficulty: 'easy',
      },
      {
        description: 'Optimize crane and handling equipment operations',
        expectedSavingsPercent: 4.2,
        implementationDifficulty: 'medium',
      },
      {
        description: 'Improve load scheduling to increase Load Factor',
        expectedSavingsPercent: 3.5,
        implementationDifficulty: 'medium',
      },
    ],
    
    sensitivityIfLoadIncreases10Percent: 1.5,
    riskLevelToPortConcentration: 'Low',
    growthForecastTo2030: 'Growing. Port traffic expected to increase 20-25% by 2030.',
    
    energyIntensityTrend: 'Improving',
    potentialCarbonReductionViaDemandShaping: 260,
    esgReadinessIndicator: 'Low',
    
    monthlyPeakTrend: generateMonthlyPeakTrend(25),
    loadDistributionHistogram: generateLoadDistribution(10, 25),
    
    executiveSummary: 'Port Services & Marine Operations manages port infrastructure with highly variable load patterns driven by vessel schedules. The facility shows lower load factor (60.0%) with high volatility, reflecting the nature of port operations. Significant optimization potential exists, particularly in idle load reduction.',
    
    energyHealthScore: 0,
  },
];

// Calculate Energy Health Scores
COMPANY_ENERGY_PROFILES.forEach(profile => {
  profile.energyHealthScore = calculateEnergyHealthScore(
    profile.loadFactor,
    profile.idleLoadRatio,
    profile.operationalStabilityScore,
    profile.volatilityIndex
  );
});

// Helper function to get profile by ID
export function getCompanyProfileById(id: string): CompanyEnergyProfile | undefined {
  return COMPANY_ENERGY_PROFILES.find(p => p.id === id);
}

// Helper function to get all profiles
export function getAllCompanyProfiles(): CompanyEnergyProfile[] {
  return COMPANY_ENERGY_PROFILES;
}

