import type { PortStatus } from '../types';

/**
 * Operations Analytics for Port Digital Twin
 * Calculates KPIs and operational metrics
 */

export interface OperationsKPIs {
  // Ship Operations
  ships: {
    total: number;
    docked: number;
    loading: number;
    unloading: number;
    waiting: number;
    avgDwellTime: number; // hours
    berthUtilization: number; // %
  };
  
  // Crane Operations
  cranes: {
    sts: { total: number; active: number; utilization: number };
    rtg: { total: number; active: number; utilization: number };
    total: number;
    active: number;
    overallUtilization: number; // %
    avgThroughput: number; // containers/hour per crane
  };
  
  // Container Operations
  containers: {
    inYard: number;
    loaded: number;
    unloaded: number;
    throughput: number; // containers/hour
    yardUtilization: number; // %
  };
  
  // Berth Operations
  berths: {
    total: number;
    occupied: number;
    available: number;
    utilization: number; // %
    avgTurnaroundTime: number; // hours
  };
  
  // Operational Efficiency
  efficiency: {
    overall: number; // %
    energyPerContainer: number; // MW/container
    costPerContainer: number; // ر.ع/container
    operationalIndex: number; // 0-100 score
  };
  
  // Energy-Operations Correlation
  energyCorrelation: {
    powerPerShip: number; // MW per ship
    powerPerCrane: number; // MW per active crane
    powerPerContainer: number; // MW per container handled
    operationalLoad: number; // % of total power used for operations
  };
}

/**
 * Calculate comprehensive operations KPIs
 */
export function calculateOperationsKPIs(portStatus: PortStatus): OperationsKPIs {
  // Simulate operations data based on port status
  // In real implementation, this would come from port management systems
  
  const totalPower = portStatus.total_power_mw;
  // Cap utilization at 100% - values above indicate overload/emergency
  const utilization = Math.min(100, portStatus.utilization_percent);
  
  // Ship operations - realistic calculation based on power consumption
  // More power consumption = more operational activity
  const baseShips = Math.min(5, Math.max(2, Math.floor(utilization / 18))); // 2-5 ships based on utilization
  const ships = {
    total: 5,
    docked: baseShips,
    loading: Math.min(baseShips, Math.floor(baseShips * 0.7)), // 70% of docked ships loading
    unloading: Math.min(baseShips, Math.floor(baseShips * 0.5)), // 50% unloading
    waiting: Math.max(0, 5 - baseShips),
    avgDwellTime: 16 + (utilization > 85 ? 6 : utilization > 70 ? 3 : 0), // 16-22 hours
    berthUtilization: Math.min(100, (baseShips / 3) * 100), // 3 berths total
  };
  
  // Crane operations - realistic utilization capped at 100%
  const craneUtilization = Math.min(100, utilization * 0.95); // Slightly lower than power utilization
  const cranes = {
    sts: {
      total: 5,
      active: Math.min(5, Math.max(2, Math.floor((craneUtilization / 100) * 5))),
      utilization: Math.min(100, craneUtilization),
    },
    rtg: {
      total: 4,
      active: Math.min(4, Math.max(1, Math.floor((craneUtilization / 100) * 4))),
      utilization: Math.min(100, craneUtilization * 0.9),
    },
    total: 9,
    active: Math.min(9, Math.max(3, Math.floor((craneUtilization / 100) * 9))),
    overallUtilization: Math.min(100, craneUtilization),
    avgThroughput: 25 + (craneUtilization / 100) * 15, // 25-40 containers/hour per crane
  };
  
  // Container operations - realistic throughput calculation
  const containerThroughput = cranes.active * cranes.avgThroughput;
  const baseYardContainers = 12500;
  const containers = {
    inYard: Math.max(5000, baseYardContainers - (containerThroughput * 0.3)), // Minimum 5k, decreases with activity
    loaded: Math.floor(containerThroughput * 0.55), // 55% loaded
    unloaded: Math.floor(containerThroughput * 0.45), // 45% unloaded
    throughput: containerThroughput,
    yardUtilization: Math.min(100, (baseYardContainers / 20000) * 100), // Assuming 20k capacity
  };
  
  // Berth operations - ensure realistic values
  const berths = {
    total: 3,
    occupied: Math.min(3, ships.docked), // Cannot exceed total berths
    available: Math.max(0, 3 - ships.docked),
    utilization: Math.min(100, ships.berthUtilization),
    avgTurnaroundTime: ships.avgDwellTime,
  };
  
  // Operational efficiency - realistic calculations
  const operationalPower = totalPower * 0.65; // 65% of power for operations
  const efficiency = {
    overall: Math.min(100, (craneUtilization + ships.berthUtilization) / 2),
    energyPerContainer: operationalPower / Math.max(1, containerThroughput),
    costPerContainer: (operationalPower * 20) / Math.max(1, containerThroughput), // 20 ر.ع/MWh
    operationalIndex: Math.min(100, Math.max(0,
      (craneUtilization * 0.3) + 
      (ships.berthUtilization * 0.3) + 
      (containers.yardUtilization * 0.2) + 
      (Math.max(0, 100 - (ships.avgDwellTime / 24 * 100)) * 0.2)
    )),
  };
  
  // Energy-Operations correlation - ensure no division by zero
  const energyCorrelation = {
    powerPerShip: ships.docked > 0 ? totalPower / ships.docked : 0,
    powerPerCrane: cranes.active > 0 ? operationalPower / cranes.active : 0,
    powerPerContainer: containerThroughput > 0 ? operationalPower / containerThroughput : 0,
    operationalLoad: totalPower > 0 ? (operationalPower / totalPower) * 100 : 0,
  };
  
  return {
    ships,
    cranes,
    containers,
    berths,
    efficiency,
    energyCorrelation,
  };
}

/**
 * Calculate operational trends
 */
export function calculateOperationalTrends(
  currentKPIs: OperationsKPIs,
  previousKPIs?: OperationsKPIs
): {
  shipsTrend: 'up' | 'down' | 'stable';
  cranesTrend: 'up' | 'down' | 'stable';
  containersTrend: 'up' | 'down' | 'stable';
  efficiencyTrend: 'up' | 'down' | 'stable';
} {
  if (!previousKPIs) {
    return {
      shipsTrend: 'stable',
      cranesTrend: 'stable',
      containersTrend: 'stable',
      efficiencyTrend: 'stable',
    };
  }
  
  const shipsChange = currentKPIs.ships.docked - previousKPIs.ships.docked;
  const cranesChange = currentKPIs.cranes.active - previousKPIs.cranes.active;
  const containersChange = currentKPIs.containers.throughput - previousKPIs.containers.throughput;
  const efficiencyChange = currentKPIs.efficiency.overall - previousKPIs.efficiency.overall;
  
  return {
    shipsTrend: Math.abs(shipsChange) < 0.5 ? 'stable' : shipsChange > 0 ? 'up' : 'down',
    cranesTrend: Math.abs(cranesChange) < 0.5 ? 'stable' : cranesChange > 0 ? 'up' : 'down',
    containersTrend: Math.abs(containersChange) < 5 ? 'stable' : containersChange > 0 ? 'up' : 'down',
    efficiencyTrend: Math.abs(efficiencyChange) < 1 ? 'stable' : efficiencyChange > 0 ? 'up' : 'down',
  };
}

