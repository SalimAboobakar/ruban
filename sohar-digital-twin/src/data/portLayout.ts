import type { Equipment } from '../types';

/**
 * Port equipment layout with 3D coordinates
 * Includes STS cranes, RTG cranes, and container stacks
 */
export const PORT_EQUIPMENT: Equipment[] = [
  // STS Cranes (Ship-to-Shore) - Berth 1 (Hutchison)
  {
    id: 'STS-001',
    type: 'STS',
    name: 'STS Crane 1',
    company_id: 'MTR-001',
    position: { x: -100, y: 0, z: 120 },
    status: 'normal',
  },
  {
    id: 'STS-002',
    type: 'STS',
    name: 'STS Crane 2',
    company_id: 'MTR-002',
    position: { x: 0, y: 0, z: 120 },
    status: 'normal',
  },
  {
    id: 'STS-003',
    type: 'STS',
    name: 'STS Crane 3',
    company_id: 'MTR-003',
    position: { x: 100, y: 0, z: 120 },
    status: 'normal',
  },

  // RTG Cranes (Rubber Tyred Gantry) - Container yard
  {
    id: 'RTG-001',
    type: 'RTG',
    name: 'RTG Crane 1',
    company_id: 'MTR-001',
    position: { x: -80, y: 0, z: 200 },
    status: 'normal',
  },
  {
    id: 'RTG-002',
    type: 'RTG',
    name: 'RTG Crane 2',
    company_id: 'MTR-002',
    position: { x: 0, y: 0, z: 200 },
    status: 'normal',
  },
  {
    id: 'RTG-003',
    type: 'RTG',
    name: 'RTG Crane 3',
    company_id: 'MTR-003',
    position: { x: 80, y: 0, z: 200 },
    status: 'normal',
  },
  {
    id: 'RTG-004',
    type: 'RTG',
    name: 'RTG Crane 4',
    company_id: 'MTR-005',
    position: { x: 380, y: 0, z: 180 },
    status: 'normal',
  },

  // Container Stacks
  {
    id: 'CNT-001',
    type: 'Container',
    name: 'Container Stack A',
    company_id: 'MTR-001',
    position: { x: -120, y: 0, z: 240 },
    status: 'normal',
  },
  {
    id: 'CNT-002',
    type: 'Container',
    name: 'Container Stack B',
    company_id: 'MTR-002',
    position: { x: -40, y: 0, z: 240 },
    status: 'normal',
  },
  {
    id: 'CNT-003',
    type: 'Container',
    name: 'Container Stack C',
    company_id: 'MTR-003',
    position: { x: 40, y: 0, z: 240 },
    status: 'normal',
  },
  {
    id: 'CNT-004',
    type: 'Container',
    name: 'Container Stack D',
    company_id: 'MTR-005',
    position: { x: 360, y: 0, z: 220 },
    status: 'normal',
  },
];

// Berth definitions for reference
export const BERTHS = [
  {
    id: 'BERTH-01',
    name: 'Hutchison Container Terminal',
    position: { x: 0, y: 0, z: 100 },
    size: { width: 300, height: 5, depth: 100 },
  },
  {
    id: 'BERTH-02',
    name: 'Steinweg Terminal',
    position: { x: 350, y: 0, z: 100 },
    size: { width: 200, height: 5, depth: 100 },
  },
  {
    id: 'BERTH-03',
    name: 'Oiltanking Terminal',
    position: { x: 600, y: 0, z: 90 },
    size: { width: 200, height: 5, depth: 80 },
  },
];

// Helper function to get equipment by company
export function getEquipmentByCompany(companyId: string): Equipment[] {
  return PORT_EQUIPMENT.filter((eq) => eq.company_id === companyId);
}

// Helper function to get equipment by type
export function getEquipmentByType(type: Equipment['type']): Equipment[] {
  return PORT_EQUIPMENT.filter((eq) => eq.type === type);
}

