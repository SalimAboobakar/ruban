import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Equipment, CompanyReading } from '../../types';
import { formatPower } from '../../utils/formatters';
import { getStatusColor } from '../../utils/statusColors';

interface InteractionPanelProps {
  equipment: Equipment | null;
  companyReading: CompanyReading | null;
  onClose: () => void;
}

/**
 * Panel showing details when equipment is clicked
 */
export function InteractionPanel({ equipment, companyReading, onClose }: InteractionPanelProps) {
  const statusColor = equipment ? getStatusColor(equipment.status) : '#6b7280';

  return (
    <AnimatePresence>
      {equipment && companyReading && (
        <motion.div
          initial={{ opacity: 0, x: -20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-20 left-6 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-4 w-80 z-10"
        >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{equipment.name}</h3>
          <p className="text-sm text-gray-400">{companyReading.company_name}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: statusColor + '20',
            color: statusColor,
            border: `1px solid ${statusColor}`,
          }}
        >
          {equipment.status.toUpperCase()}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-400 mb-1">Current Power</p>
          <p className="text-2xl font-bold text-white">
            {formatPower(companyReading.current_power_mw)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">Type</p>
            <p className="text-sm font-semibold text-white">{equipment.type}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-400 mb-1">Trend</p>
            <p className="text-sm font-semibold text-white flex items-center gap-1">
              {companyReading.trend === 'increasing' && '↗'}
              {companyReading.trend === 'decreasing' && '↘'}
              {companyReading.trend === 'stable' && '→'}
              <span className="capitalize">{companyReading.trend}</span>
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-1">Position</p>
          <p className="text-xs font-mono text-gray-300">
            X: {equipment.position.x.toFixed(0)} | 
            Y: {equipment.position.y.toFixed(0)} | 
            Z: {equipment.position.z.toFixed(0)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-1">Last Updated</p>
          <p className="text-xs text-gray-300">
            {new Date(companyReading.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

