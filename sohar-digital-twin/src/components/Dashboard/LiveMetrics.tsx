import { TrendingUp, TrendingDown, Zap, Activity, DollarSign, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PortStatus } from '../../types';
import { formatPower, formatPercentage, formatCurrency } from '../../utils/formatters';
import { Card } from '../UI/Card';

interface LiveMetricsProps {
  currentStatus: PortStatus | null;
}

export function LiveMetrics({ currentStatus }: LiveMetricsProps) {
  if (!currentStatus) {
    return (
      <div className="grid grid-cols-4 gap-4 px-6 py-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-20 bg-gray-800 rounded" />
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Power',
      value: formatPower(currentStatus.total_power_mw),
      icon: Zap,
      color: '#0ea5e9',
      trend: currentStatus.total_power_mw > 450 ? 'up' : 'stable',
    },
    {
      label: 'Capacity Utilization',
      value: formatPercentage(Math.min(100, currentStatus.utilization_percent)), // Cap at 100% for display
      icon: Activity,
      color: currentStatus.utilization_percent > 100 ? '#ef4444' : currentStatus.utilization_percent > 85 ? '#ef4444' : currentStatus.utilization_percent > 70 ? '#f59e0b' : '#10b981',
      trend: currentStatus.utilization_percent > 100 ? 'up' : currentStatus.utilization_percent > 80 ? 'up' : 'stable',
    },
    {
      label: 'Cost per Hour',
      value: formatCurrency(currentStatus.cost_per_hour),
      icon: DollarSign,
      color: '#f59e0b',
      trend: 'stable',
    },
    {
      label: 'Active Alerts',
      value: currentStatus.active_alerts.toString(),
      icon: AlertTriangle,
      color: currentStatus.active_alerts > 0 ? '#ef4444' : '#10b981',
      trend: currentStatus.active_alerts > 0 ? 'up' : 'stable',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 px-6 py-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:scale-105 transition-transform duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: metric.color + '20' }}
                >
                  <Icon size={20} color={metric.color} />
                </div>
              </div>
              
              {metric.trend !== 'stable' && (
                <div className="mt-2 flex items-center gap-1 text-xs">
                  {metric.trend === 'up' ? (
                    <>
                      <TrendingUp size={14} className="text-danger" />
                      <span className="text-danger">Increasing</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown size={14} className="text-success" />
                      <span className="text-success">Decreasing</span>
                    </>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

