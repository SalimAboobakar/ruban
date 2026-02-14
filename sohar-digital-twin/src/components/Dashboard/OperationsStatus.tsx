import { motion } from 'framer-motion';
import { Card } from '../UI/Card';
import { Ship, Boxes, Anchor, Truck, Activity, AlertCircle } from 'lucide-react';
import type { PortStatus } from '../../types';

interface OperationsStatusProps {
  portStatus: PortStatus;
}

/**
 * Operations Status Component
 * Shows real-time port operations status
 */
export function OperationsStatus({ portStatus }: OperationsStatusProps) {
  // Simulate operations data based on port status
  const operations = {
    ships: {
      total: 5,
      docked: 4,
      loading: 3,
      unloading: 2,
      status: 'normal' as const,
    },
    cranes: {
      sts: { total: 5, active: 4, idle: 1 },
      rtg: { total: 4, active: 3, idle: 1 },
      total: 9,
      active: 7,
    },
    containers: {
      total: 12500,
      loaded: 3200,
      unloaded: 2800,
      inYard: 6500,
    },
    berths: {
      total: 3,
      occupied: 2,
      available: 1,
    },
    trucks: {
      total: 5,
      active: 4,
      idle: 1,
    },
  };

  // Calculate utilization
  const craneUtilization = (operations.cranes.active / operations.cranes.total) * 100;
  const berthUtilization = (operations.berths.occupied / operations.berths.total) * 100;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">حالة العمليات</h3>
      
      {/* Main Operations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ships */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 border border-blue-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Ship className="text-blue-400" size={24} />
            </div>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              operations.ships.status === 'normal' 
                ? 'bg-success/20 text-success' 
                : 'bg-danger/20 text-danger'
            }`}>
              نشط
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">السفن</p>
          <p className="text-2xl font-bold text-white">{operations.ships.docked}</p>
          <p className="text-gray-500 text-xs mt-1">
            {operations.ships.loading} تحميل • {operations.ships.unloading} تفريغ
          </p>
        </motion.div>

        {/* Cranes */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-600/20 to-orange-500/10 border border-orange-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Boxes className="text-orange-400" size={24} />
            </div>
            <span className="text-xs text-gray-400">{craneUtilization.toFixed(0)}%</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">الرافعات النشطة</p>
          <p className="text-2xl font-bold text-white">{operations.cranes.active}/{operations.cranes.total}</p>
          <p className="text-gray-500 text-xs mt-1">
            STS: {operations.cranes.sts.active} • RTG: {operations.cranes.rtg.active}
          </p>
        </motion.div>

        {/* Containers */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-600/20 to-green-500/10 border border-green-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Boxes className="text-green-400" size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">الحاويات في الساحة</p>
          <p className="text-2xl font-bold text-white">
            {operations.containers.inYard.toLocaleString()}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            محملة: {operations.containers.loaded.toLocaleString()} • مفروغة: {operations.containers.unloaded.toLocaleString()}
          </p>
        </motion.div>

        {/* Berths */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-600/20 to-purple-500/10 border border-purple-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Anchor className="text-purple-400" size={24} />
            </div>
            <span className="text-xs text-gray-400">{berthUtilization.toFixed(0)}%</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">الأرصفة</p>
          <p className="text-2xl font-bold text-white">
            {operations.berths.occupied}/{operations.berths.total}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            متاح: {operations.berths.available}
          </p>
        </motion.div>
      </div>

      {/* Operations Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Operations */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-primary" size={20} />
            <h4 className="text-white font-bold">العمليات النشطة</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2">
                <Ship className="text-blue-400" size={18} />
                <span className="text-white text-sm">تحميل السفن</span>
              </div>
              <span className="text-blue-400 font-bold">{operations.ships.loading} سفينة</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="flex items-center gap-2">
                <Boxes className="text-orange-400" size={18} />
                <span className="text-white text-sm">رافعات STS نشطة</span>
              </div>
              <span className="text-orange-400 font-bold">{operations.cranes.sts.active}/{operations.cranes.sts.total}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-2">
                <Truck className="text-green-400" size={18} />
                <span className="text-white text-sm">شاحنات نشطة</span>
              </div>
              <span className="text-green-400 font-bold">{operations.trucks.active}/{operations.trucks.total}</span>
            </div>
          </div>
        </Card>

        {/* Equipment Status */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-warning" size={20} />
            <h4 className="text-white font-bold">حالة المعدات</h4>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">الرافعات</span>
                <span className="text-white font-medium">{operations.cranes.active}/{operations.cranes.total}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-orange-500 rounded-full h-2 transition-all"
                  style={{ width: `${craneUtilization}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">الأرصفة</span>
                <span className="text-white font-medium">{operations.berths.occupied}/{operations.berths.total}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 rounded-full h-2 transition-all"
                  style={{ width: `${berthUtilization}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">السفن</span>
                <span className="text-white font-medium">{operations.ships.docked}/{operations.ships.total}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 rounded-full h-2 transition-all"
                  style={{ width: `${(operations.ships.docked / operations.ships.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

