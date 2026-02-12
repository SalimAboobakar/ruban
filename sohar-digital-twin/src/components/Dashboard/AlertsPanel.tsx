import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import type { CompanyReading } from '../../types';
import { Card } from '../UI/Card';
import { formatTime } from '../../utils/formatters';

interface AlertsPanelProps {
  companies: CompanyReading[];
}

export function AlertsPanel({ companies }: AlertsPanelProps) {
  // Generate alerts from company data
  const alerts = companies
    .filter((c) => c.status === 'high' || c.status === 'medium')
    .map((company) => ({
      id: company.meter_id,
      type: company.status === 'high' ? 'critical' : 'warning',
      company: company.company_name,
      message:
        company.status === 'high'
          ? `High power consumption: ${company.current_power_mw.toFixed(1)} MW`
          : `Medium load detected: ${company.current_power_mw.toFixed(1)} MW`,
      timestamp: company.timestamp,
    }));

  // Add a general info alert if utilization is high
  const highUtilization = companies.filter((c) => c.status === 'high').length > 3;
  if (highUtilization) {
    alerts.unshift({
      id: 'general-alert',
      type: 'info',
      company: 'System',
      message: 'Multiple companies showing high consumption. Monitor closely.',
      timestamp: new Date().toISOString(),
    });
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle size={16} className="text-danger" />;
      case 'warning':
        return <AlertCircle size={16} className="text-warning" />;
      default:
        return <Info size={16} className="text-primary" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-danger';
      case 'warning':
        return 'border-l-warning';
      default:
        return 'border-l-primary';
    }
  };

  return (
    <Card title="Active Alerts" subtitle={`${alerts.length} alerts`}>
      <div className="space-y-2 max-h-[250px] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Info size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active alerts</p>
            <p className="text-xs text-gray-600">All systems operating normally</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 ${getAlertColor(alert.type)} bg-gray-800/50 p-3 rounded-r`}
            >
              <div className="flex items-start gap-2">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{alert.company}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(alert.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

