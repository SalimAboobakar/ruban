import type { CompanyReading, PortStatus } from '../types';
import { COMPANIES, PORT_CAPACITY_MW } from './companies';
import { getPeakFactor, getRandomVariance, roundTo, calculateCost } from '../utils/calculations';
import { getStatus } from '../utils/statusColors';

/**
 * Simulates Nama API responses for real-time energy data
 * This would normally be an actual API call to Nama's systems
 */

// Store previous readings for trend calculation
let previousReadings: Map<string, number> = new Map();

/**
 * Generate a single company reading based on time and variance
 */
export function generateCompanyReading(
  companyId: string,
  simulatedTime: Date = new Date()
): CompanyReading {
  const company = COMPANIES.find((c) => c.id === companyId);
  
  if (!company) {
    throw new Error(`Company not found: ${companyId}`);
  }

  const hour = simulatedTime.getHours();
  const peakFactor = getPeakFactor(hour);
  const variance = getRandomVariance(0.9, 1.1);
  
  // Calculate current power with peak factor and variance
  const currentPower = company.base_load_mw * peakFactor * variance;
  const roundedPower = roundTo(currentPower, 1);
  
  // Determine status
  const status = getStatus(roundedPower, company.base_load_mw);
  
  // Calculate trend
  const previousPower = previousReadings.get(companyId) || roundedPower;
  const changePct = ((roundedPower - previousPower) / previousPower) * 100;
  
  let trend: CompanyReading['trend'] = 'stable';
  if (Math.abs(changePct) >= 2) {
    trend = changePct > 0 ? 'increasing' : 'decreasing';
  }
  
  // Store for next iteration
  previousReadings.set(companyId, roundedPower);
  
  // Occasionally create alerts (10% chance for high criticality companies)
  const shouldAlert = company.criticality === 'high' && Math.random() < 0.1;
  
  return {
    meter_id: company.id,
    company_name: company.name,
    current_power_mw: roundedPower,
    status: shouldAlert ? 'high' : status,
    trend,
    timestamp: simulatedTime.toISOString(),
  };
}

/**
 * Generate readings for all companies
 */
export function generateAllReadings(simulatedTime: Date = new Date()): CompanyReading[] {
  return COMPANIES.map((company) => generateCompanyReading(company.id, simulatedTime));
}

/**
 * Generate complete port status including aggregates
 */
export function generatePortStatus(simulatedTime: Date = new Date()): PortStatus {
  const readings = generateAllReadings(simulatedTime);
  
  // Calculate totals
  const totalPower = readings.reduce((sum, r) => sum + r.current_power_mw, 0);
  const roundedTotal = roundTo(totalPower, 1);
  // Utilization can exceed 100% in overload situations, but cap at 120% for display
  const utilization = Math.min(120, (roundedTotal / PORT_CAPACITY_MW) * 100);
  
  // Count alerts - increase alerts if utilization > 100%
  const baseAlerts = readings.filter((r) => r.status === 'high').length;
  const overloadAlerts = utilization > 100 ? Math.floor((utilization - 100) / 5) : 0;
  const activeAlerts = baseAlerts + overloadAlerts;
  
  // Calculate cost
  const costPerHour = calculateCost(roundedTotal);
  
  return {
    timestamp: simulatedTime.toISOString(),
    total_power_mw: roundedTotal,
    capacity_mw: PORT_CAPACITY_MW,
    utilization_percent: roundTo(utilization, 1),
    companies: readings,
    active_alerts: activeAlerts,
    cost_per_hour: Math.round(costPerHour),
  };
}

/**
 * Generate historical data for charts
 * @param hours - Number of hours to generate (default: 24)
 * @param intervalMinutes - Interval between data points (default: 30)
 */
export function generateHistoricalData(
  hours: number = 24,
  intervalMinutes: number = 30
): PortStatus[] {
  const data: PortStatus[] = [];
  const now = new Date();
  const intervalMs = intervalMinutes * 60 * 1000;
  const dataPoints = (hours * 60) / intervalMinutes;
  
  for (let i = dataPoints; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * intervalMs);
    data.push(generatePortStatus(timestamp));
  }
  
  return data;
}

/**
 * Reset previous readings (useful for time jumps)
 */
export function resetSimulator(): void {
  previousReadings.clear();
}

