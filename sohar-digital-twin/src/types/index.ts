// Core data types for Sohar Port Digital Twin

export type EquipmentStatus = 'normal' | 'medium' | 'high' | 'idle';
export type Trend = 'increasing' | 'stable' | 'decreasing';
export type Criticality = 'high' | 'medium' | 'low';
export type Industry = 'Metals' | 'Petrochemicals' | 'Logistics' | 'Manufacturing' | 'Energy';

export interface Company {
  id: string;
  name: string;
  industry: Industry;
  base_load_mw: number;
  location: {
    x: number;
    y: number;
    z: number;
  };
  criticality: Criticality;
}

export interface CompanyReading {
  meter_id: string;
  company_name: string;
  current_power_mw: number;
  status: EquipmentStatus;
  trend: Trend;
  timestamp: string;
}

export interface PortStatus {
  timestamp: string;
  total_power_mw: number;
  capacity_mw: number;
  utilization_percent: number;
  companies: CompanyReading[];
  active_alerts: number;
  cost_per_hour: number;
}

export interface Equipment {
  id: string;
  type: 'STS' | 'RTG' | 'Container';
  name: string;
  company_id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  status: EquipmentStatus;
  power_mw?: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  company_id: string;
  timestamp: string;
}

export interface Prediction {
  id: string;
  type: 'peak' | 'anomaly' | 'recommendation';
  message: string;
  confidence: number;
  timestamp: string;
}

// ============ New Types for Enhanced Features ============

// Load Optimization Types
export interface LoadOptimization {
  currentCost: number;
  optimizedCost: number;
  savings: number;
  savingsPercentage: number;
  recommendations: OptimizationRecommendation[];
}

export interface OptimizationRecommendation {
  id: string;
  companyId: string;
  companyName: string;
  type: 'schedule' | 'load_shift' | 'peak_avoidance';
  description: string;
  currentCost: number;
  optimizedCost: number;
  savings: number;
  implementationDifficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
}

// Sustainability Types
export interface SustainabilityMetrics {
  carbonFootprint: {
    current: number; // طن CO₂/شهر
    target: number;
    reduction: number;
    reductionPercentage: number;
  };
  renewableEnergy: {
    current: number; // %
    target: number; // % (Vision 2040)
    progress: number; // %
  };
  costSavings: {
    fromRenewables: number;
    fromOptimization: number;
    total: number;
  };
  certifications: {
    iso14001: boolean;
    carbonNeutral: boolean;
  };
}

// ROI Dashboard Types
export interface ROIMetrics {
  monthlySavings: {
    fromLoadOptimization: number;
    fromRenewableEnergy: number;
    fromPredictiveMaintenance: number;
    total: number;
  };
  annualSavings: number;
  implementationCost: number;
  paybackPeriod: number; // أشهر
  roi: number; // %
  dailySavings: number;
  weeklySavings: number;
}

// Predictive Maintenance Types
export interface MaintenancePrediction {
  id: string;
  equipment: string;
  companyId: string;
  companyName: string;
  failureProbability: number; // 0-1
  estimatedFailureTime: Date;
  recommendedAction: string;
  costIfFailed: number;
  costToPrevent: number;
  savings: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

// Real-time Cost Tracking
export interface RealTimeCost {
  currentHour: number;
  projectedDaily: number;
  projectedMonthly: number;
  savingsToday: number;
  savingsThisMonth: number;
  costPerHour: number;
  averageCostPerHour: number;
}

// ============ Company Energy Profile Types ============

export type GrowthTrend = 'Stable' | 'Increasing' | 'Volatile';
export type VolatilityLevel = 'Low' | 'Medium' | 'High';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type EnergyIntensityTrend = 'Improving' | 'Stable' | 'Worsening';
export type ESGReadiness = 'High' | 'Medium' | 'Low';

export interface LoadProfile24H {
  hour: number;
  weekday_mw: number;
  weekend_mw: number;
}

export interface MonthlyPeakData {
  month: string;
  peak_mw: number;
}

export interface LoadDistribution {
  range: string; // e.g., "0-100 MW"
  frequency: number; // percentage of time
}

export interface CompanyEnergyProfile {
  // Basic Info
  id: string;
  companyName: string;
  sector: string;
  connectedVoltageLevel: string; // e.g., "33kV" or "132kV"
  averageLoadMW: number;
  peakLoadMW: number;
  loadShareOfPort: number; // percentage
  growthTrend: GrowthTrend;

  // Load Profile Analysis
  loadProfile24H: LoadProfile24H[];
  baseLoadMW: number; // minimum steady MW
  loadFactor: number; // percentage
  peakToAverageRatio: number;
  volatilityIndex: VolatilityLevel;

  // Maximum Demand Impact
  highestMWThisMonth: number;
  peakContributionRanking: number; // position among top 10
  estimatedImpactOf3PercentReduction: number; // MW reduction
  coincidenceIndicator: boolean; // Does it peak during tariff peak window?

  // Idle Load & Efficiency
  idleLoadRatio: number; // percentage
  nightTimeConsumptionPattern: string; // description
  operationalStabilityScore: number; // 0-100

  // Optimization Opportunities
  optimizationOpportunities: {
    description: string;
    expectedSavingsPercent: number; // 2-6% range
    implementationDifficulty: 'easy' | 'medium' | 'hard';
  }[];

  // Risk & Planning Insight
  sensitivityIfLoadIncreases10Percent: number; // MW impact
  riskLevelToPortConcentration: RiskLevel;
  growthForecastTo2030: string; // description

  // Sustainability Layer
  energyIntensityTrend: EnergyIntensityTrend;
  potentialCarbonReductionViaDemandShaping: number; // tons CO2/year
  esgReadinessIndicator: ESGReadiness;

  // Charts Data
  monthlyPeakTrend: MonthlyPeakData[];
  loadDistributionHistogram: LoadDistribution[];

  // Executive Summary
  executiveSummary: string;

  // Energy Health Score (calculated)
  energyHealthScore: number; // 0-100
}

