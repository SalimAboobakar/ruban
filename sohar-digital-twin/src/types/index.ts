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

