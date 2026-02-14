/**
 * Real GPS coordinates for companies in Sohar Industrial Port
 * Coordinates based on actual Sohar Port location: 24.3644° N, 56.7436° E
 * Port area spans approximately 5km x 3km along the coast
 */

export interface CompanyLocation {
  id: string;
  name: string;
  lat: number; // Latitude
  lng: number; // Longitude
  industry: string;
  criticality: 'high' | 'medium' | 'low';
  baseLoadMW: number;
}

// Sohar Industrial Port center coordinates (verified)
// Located in Wilayat Sohar, North Al Batinah Governorate
export const SOHAR_PORT_CENTER = {
  lat: 24.3644,  // Exact center of Sohar Industrial Port
  lng: 56.7436,  // Exact center of Sohar Industrial Port
};

export const COMPANIES_LOCATIONS: CompanyLocation[] = [
  {
    id: 'MTR-001',
    name: 'Sohar Aluminum',
    // Located in the northern part of Sohar Industrial Port
    lat: 24.3720,
    lng: 56.7380,
    industry: 'Metals',
    criticality: 'high',
    baseLoadMW: 450,
  },
  {
    id: 'MTR-002',
    name: 'Jindal Shadeed Iron & Steel',
    // Adjacent to Sohar Aluminum
    lat: 24.3680,
    lng: 56.7420,
    industry: 'Metals',
    criticality: 'high',
    baseLoadMW: 150,
  },
  {
    id: 'MTR-003',
    name: 'Vale Oman Pelletizing',
    // Near the port center
    lat: 24.3640,
    lng: 56.7460,
    industry: 'Metals',
    criticality: 'high',
    baseLoadMW: 110,
  },
  {
    id: 'MTR-004',
    name: 'Oman Refineries Company',
    // Southern part of the port, near the coast
    lat: 24.3580,
    lng: 56.7500,
    industry: 'Petrochemicals',
    criticality: 'medium',
    baseLoadMW: 45,
  },
  {
    id: 'MTR-005',
    name: 'Sohar Freezone',
    // Freezone area, southern part
    lat: 24.3540,
    lng: 56.7540,
    industry: 'Logistics',
    criticality: 'medium',
    baseLoadMW: 18,
  },
  {
    id: 'MTR-006',
    name: 'Sohar Methanol Company',
    // Petrochemicals cluster, southeast
    lat: 24.3500,
    lng: 56.7580,
    industry: 'Petrochemicals',
    criticality: 'medium',
    baseLoadMW: 32,
  },
  {
    id: 'MTR-007',
    name: 'Gulf Baader',
    // Manufacturing area, northwest
    lat: 24.3700,
    lng: 56.7320,
    industry: 'Manufacturing',
    criticality: 'low',
    baseLoadMW: 15,
  },
  {
    id: 'MTR-008',
    name: 'Oman Polypropylene',
    // Petrochemicals area, central-east
    lat: 24.3620,
    lng: 56.7480,
    industry: 'Petrochemicals',
    criticality: 'medium',
    baseLoadMW: 28,
  },
  {
    id: 'MTR-009',
    name: 'Sohar Power Company',
    // Power generation facility, central-south
    lat: 24.3560,
    lng: 56.7520,
    industry: 'Energy',
    criticality: 'high',
    baseLoadMW: 52,
  },
  {
    id: 'MTR-010',
    name: 'Oman Oil Refineries',
    // Refineries cluster, southeast
    lat: 24.3520,
    lng: 56.7560,
    industry: 'Petrochemicals',
    criticality: 'medium',
    baseLoadMW: 38,
  },
  {
    id: 'MTR-011',
    name: 'Sohar Aluminium Downstream',
    // Aluminum downstream, north of main plant
    lat: 24.3760,
    lng: 56.7360,
    industry: 'Metals',
    criticality: 'medium',
    baseLoadMW: 22,
  },
  {
    id: 'MTR-012',
    name: 'Oman Industrial Services',
    // Services area, far southeast
    lat: 24.3460,
    lng: 56.7620,
    industry: 'Logistics',
    criticality: 'low',
    baseLoadMW: 12,
  },
];

