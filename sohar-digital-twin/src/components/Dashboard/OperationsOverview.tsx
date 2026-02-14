import { motion } from 'framer-motion';
import { Card } from '../UI/Card';
import {
  Ship,
  Boxes,
  Anchor,
  Truck,
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  Target,
} from 'lucide-react';
import type { OperationsKPIs } from '../../utils/operationsAnalytics';
import { formatCurrency } from '../../utils/formatters';
import { CurrencySymbol } from '../UI/CurrencySymbol';

interface OperationsOverviewProps {
  kpis: OperationsKPIs;
  trends?: {
    shipsTrend: 'up' | 'down' | 'stable';
    cranesTrend: 'up' | 'down' | 'stable';
    containersTrend: 'up' | 'down' | 'stable';
    efficiencyTrend: 'up' | 'down' | 'stable';
  };
}

/**
 * Comprehensive Operations Overview Component
 * Shows real-time port operations with KPIs
 */
export function OperationsOverview({ kpis, trends }: OperationsOverviewProps) {
  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="text-success" size={16} />;
    if (trend === 'down') return <TrendingDown className="text-danger" size={16} />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Main Operations KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ship Operations */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 border border-blue-500/30 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Ship className="text-blue-400" size={24} />
            </div>
            {trends && <TrendIcon trend={trends.shipsTrend} />}
          </div>
          <p className="text-gray-400 text-sm mb-1">عمليات السفن</p>
          <p className="text-2xl font-bold text-white">{kpis.ships.docked}/{kpis.ships.total}</p>
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">قيد التحميل</span>
              <span className="text-blue-400 font-medium">{kpis.ships.loading}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">متوسط وقت الرسو</span>
              <span className="text-gray-400">{kpis.ships.avgDwellTime.toFixed(1)} ساعة</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
              <div
                className="bg-blue-500 rounded-full h-1.5 transition-all"
                style={{ width: `${Math.min(100, kpis.ships.berthUtilization)}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Crane Operations */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-600/20 to-orange-500/10 border border-orange-500/30 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Boxes className="text-orange-400" size={24} />
            </div>
            {trends && <TrendIcon trend={trends.cranesTrend} />}
          </div>
          <p className="text-gray-400 text-sm mb-1">الرافعات النشطة</p>
          <p className="text-2xl font-bold text-white">{kpis.cranes.active}/{kpis.cranes.total}</p>
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">STS</span>
              <span className="text-orange-400 font-medium">{kpis.cranes.sts.active}/{kpis.cranes.sts.total}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">RTG</span>
              <span className="text-orange-400 font-medium">{kpis.cranes.rtg.active}/{kpis.cranes.rtg.total}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-gray-500">الإنتاجية</span>
              <span className="text-white font-medium">{kpis.cranes.avgThroughput.toFixed(0)} حاوية/ساعة</span>
            </div>
          </div>
        </motion.div>

        {/* Container Throughput */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-600/20 to-green-500/10 border border-green-500/30 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Truck className="text-green-400" size={24} />
            </div>
            {trends && <TrendIcon trend={trends.containersTrend} />}
          </div>
          <p className="text-gray-400 text-sm mb-1">إنتاجية الحاويات</p>
          <p className="text-2xl font-bold text-white">{kpis.containers.throughput.toFixed(0)}</p>
          <p className="text-gray-500 text-xs mt-1">حاوية/ساعة</p>
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">في الساحة</span>
              <span className="text-green-400 font-medium">{kpis.containers.inYard.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
              <div
                className="bg-green-500 rounded-full h-1.5 transition-all"
                style={{ width: `${Math.min(100, kpis.containers.yardUtilization)}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Operational Efficiency */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-600/20 to-purple-500/10 border border-purple-500/30 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Target className="text-purple-400" size={24} />
            </div>
            {trends && <TrendIcon trend={trends.efficiencyTrend} />}
          </div>
          <p className="text-gray-400 text-sm mb-1">الكفاءة التشغيلية</p>
          <p className="text-2xl font-bold text-white">{kpis.efficiency.overall.toFixed(1)}%</p>
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">مؤشر الأداء</span>
              <span className="text-purple-400 font-medium">{kpis.efficiency.operationalIndex.toFixed(0)}/100</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">الطاقة/حاوية</span>
              <span className="text-gray-400">{kpis.efficiency.energyPerContainer.toFixed(2)} MW</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Operations Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Berth Utilization */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Anchor className="text-blue-400" size={20} />
            <h4 className="text-white font-bold">استخدام الأرصفة</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">المشغولة</span>
              <span className="text-white font-bold">{kpis.berths.occupied}/{kpis.berths.total}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-500 rounded-full h-3 transition-all flex items-center justify-end pr-2"
                style={{ width: `${Math.min(100, kpis.berths.utilization)}%` }}
              >
                <span className="text-xs text-white font-bold">{Math.min(100, kpis.berths.utilization).toFixed(0)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>متوسط وقت الرسو</span>
              <span>{kpis.berths.avgTurnaroundTime.toFixed(1)} ساعة</span>
            </div>
          </div>
        </Card>

        {/* Energy-Operations Correlation */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-primary" size={20} />
            <h4 className="text-white font-bold">الطاقة والعمليات</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">الطاقة التشغيلية</span>
              <span className="text-white font-bold">{kpis.energyCorrelation.operationalLoad.toFixed(1)}%</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-400">
                <span>الطاقة/سفينة</span>
                <span className="text-white">{kpis.energyCorrelation.powerPerShip.toFixed(1)} MW</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>الطاقة/رافعة</span>
                <span className="text-white">{kpis.energyCorrelation.powerPerCrane.toFixed(1)} MW</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>الطاقة/حاوية</span>
                <span className="text-white">{kpis.energyCorrelation.powerPerContainer.toFixed(3)} MW</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Cost Efficiency */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-success" size={20} />
            <h4 className="text-white font-bold">كفاءة التكلفة</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">التكلفة/حاوية</span>
              <span className="text-white font-bold flex items-center gap-1">
                {formatCurrency(kpis.efficiency.costPerContainer)}
                <CurrencySymbol size={14} />
              </span>
            </div>
            <div className="pt-3 border-t border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>مؤشر الأداء</span>
                <span className="text-success">{kpis.efficiency.operationalIndex.toFixed(0)}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-success rounded-full h-2 transition-all"
                  style={{ width: `${kpis.efficiency.operationalIndex}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

