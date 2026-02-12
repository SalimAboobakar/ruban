import type { Company } from '../types';

/**
 * Major companies operating in Sohar Industrial Port
 * Realistic base loads and locations
 */
export const COMPANIES: Company[] = [
  {
    id: 'MTR-001',
    name: 'Sohar Aluminum',
    industry: 'Metals',
    base_load_mw: 145,
    location: { x: -50, y: 0, z: 150 },
    criticality: 'high',
  },
  {
    id: 'MTR-002',
    name: 'Jindal Shadeed Iron & Steel',
    industry: 'Metals',
    base_load_mw: 112,
    location: { x: 50, y: 0, z: 150 },
    criticality: 'high',
  },
  {
    id: 'MTR-003',
    name: 'Vale Oman Pelletizing',
    industry: 'Metals',
    base_load_mw: 90,
    location: { x: 150, y: 0, z: 150 },
    criticality: 'high',
  },
  {
    id: 'MTR-004',
    name: 'Oman Refineries Company',
    industry: 'Petrochemicals',
    base_load_mw: 45,
    location: { x: 300, y: 0, z: 120 },
    criticality: 'medium',
  },
  {
    id: 'MTR-005',
    name: 'Sohar Freezone',
    industry: 'Logistics',
    base_load_mw: 18,
    location: { x: 400, y: 0, z: 120 },
    criticality: 'medium',
  },
  {
    id: 'MTR-006',
    name: 'Sohar Methanol Company',
    industry: 'Petrochemicals',
    base_load_mw: 32,
    location: { x: 500, y: 0, z: 110 },
    criticality: 'medium',
  },
  {
    id: 'MTR-007',
    name: 'Gulf Baader',
    industry: 'Manufacturing',
    base_load_mw: 15,
    location: { x: 250, y: 0, z: 80 },
    criticality: 'low',
  },
  {
    id: 'MTR-008',
    name: 'Oman Polypropylene',
    industry: 'Petrochemicals',
    base_load_mw: 28,
    location: { x: 350, y: 0, z: 80 },
    criticality: 'medium',
  },
  {
    id: 'MTR-009',
    name: 'Sohar Power Company',
    industry: 'Energy',
    base_load_mw: 52,
    location: { x: 450, y: 0, z: 85 },
    criticality: 'high',
  },
  {
    id: 'MTR-010',
    name: 'Oman Oil Refineries',
    industry: 'Petrochemicals',
    base_load_mw: 38,
    location: { x: 550, y: 0, z: 90 },
    criticality: 'medium',
  },
  {
    id: 'MTR-011',
    name: 'Sohar Aluminium Downstream',
    industry: 'Metals',
    base_load_mw: 22,
    location: { x: -100, y: 0, z: 120 },
    criticality: 'medium',
  },
  {
    id: 'MTR-012',
    name: 'Oman Industrial Services',
    industry: 'Logistics',
    base_load_mw: 12,
    location: { x: 650, y: 0, z: 95 },
    criticality: 'low',
  },
];

// Total capacity
export const PORT_CAPACITY_MW = 585;

// Helper function to get company by ID
export function getCompanyById(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id === id);
}

// Helper function to get companies by industry
export function getCompaniesByIndustry(industry: string): Company[] {
  return COMPANIES.filter((c) => c.industry === industry);
}

// Calculate total base load
export const TOTAL_BASE_LOAD_MW = COMPANIES.reduce(
  (sum, company) => sum + company.base_load_mw,
  0
);

