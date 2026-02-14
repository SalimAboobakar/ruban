import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Card } from '../UI/Card';
import { COMPANIES_LOCATIONS, SOHAR_PORT_CENTER } from '../../data/companiesLocations';
import type { PortStatus } from '../../types';
import { formatPower } from '../../utils/formatters';

// Custom marker icons based on status
const createStatusIcon = (status: 'normal' | 'medium' | 'high' | 'idle') => {
  const color = 
    status === 'high' ? '#ef4444' : 
    status === 'medium' ? '#f59e0b' : 
    status === 'idle' ? '#6b7280' : 
    '#10b981';
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

interface PortMapProps {
  portStatus: PortStatus | null;
}

function MapCenter({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [map, center]);
  return null;
}

export function PortMap({ portStatus }: PortMapProps) {
  // Get company statuses from portStatus
  const companyStatuses = useMemo(() => {
    if (!portStatus) return new Map<string, 'normal' | 'medium' | 'high' | 'idle'>();
    
    const statusMap = new Map<string, 'normal' | 'medium' | 'high' | 'idle'>();
    portStatus.companies.forEach((company) => {
      statusMap.set(company.company_name, company.status);
    });
    return statusMap;
  }, [portStatus]);

  // Count companies by status
  const statusCounts = useMemo(() => {
    const counts = {
      healthy: 0,
      warning: 0,
      caution: 0,
      critical: 0,
    };

    COMPANIES_LOCATIONS.forEach((company) => {
      const status = companyStatuses.get(company.name) || 'normal';
      if (status === 'normal') counts.healthy++;
      else if (status === 'medium') counts.warning++;
      else if (status === 'high') counts.critical++;
      else counts.caution++;
    });

    return counts;
  }, [companyStatuses]);

  // Get current power for each company
  const getCompanyPower = (companyName: string): number => {
    if (!portStatus) return 0;
    const company = portStatus.companies.find(c => c.company_name === companyName);
    return company?.current_power_mw || 0;
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">خريطة الميناء</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-gray-300">سليم: {statusCounts.healthy}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-gray-300">تحذير: {statusCounts.warning}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-danger" />
              <span className="text-gray-300">حرج: {statusCounts.critical}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative" style={{ height: '500px', width: '100%' }}>
        <MapContainer
          center={[SOHAR_PORT_CENTER.lat, SOHAR_PORT_CENTER.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          scrollWheelZoom={true}
        >
          <MapCenter center={[SOHAR_PORT_CENTER.lat, SOHAR_PORT_CENTER.lng]} />
          
          {/* Satellite Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Satellite: <a href="https://www.mapbox.com/">Mapbox</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          
          {/* Add markers for each company */}
          {COMPANIES_LOCATIONS.map((company) => {
            const status = companyStatuses.get(company.name) || 'normal';
            const currentPower = getCompanyPower(company.name);
            const icon = createStatusIcon(status);
            
            return (
              <Marker
                key={company.id}
                position={[company.lat, company.lng]}
                icon={icon}
              >
                <Popup>
                  <div className="text-sm">
                    <h4 className="font-bold text-gray-900 mb-2">{company.name}</h4>
                    <div className="space-y-1">
                      <p className="text-gray-600">
                        <span className="font-medium">الصناعة:</span> {company.industry}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">الطاقة الحالية:</span>{' '}
                        <span className={status === 'high' ? 'text-danger' : status === 'medium' ? 'text-warning' : 'text-success'}>
                          {formatPower(currentPower || company.baseLoadMW)}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">الحالة:</span>{' '}
                        <span className={
                          status === 'high' ? 'text-danger' :
                          status === 'medium' ? 'text-warning' :
                          'text-success'
                        }>
                          {status === 'high' ? 'حرج' : status === 'medium' ? 'تحذير' : 'سليم'}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">الأهمية:</span> {company.criticality === 'high' ? 'عالية' : company.criticality === 'medium' ? 'متوسطة' : 'منخفضة'}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </Card>
  );
}

