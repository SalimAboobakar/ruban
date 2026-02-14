import { motion } from 'framer-motion';
import { Card } from '../UI/Card';
import { Clock, Ship, Boxes, Activity } from 'lucide-react';
import type { PortStatus } from '../../types';
import { format } from 'date-fns';

interface OperationsTimelineProps {
  historicalData: PortStatus[];
}

/**
 * Operations Timeline Component
 * Shows operational activities over time
 */
export function OperationsTimeline({ historicalData }: OperationsTimelineProps) {
  // Generate timeline events based on historical data
  const timelineEvents = historicalData.slice(-10).map((status, index) => {
    const timestamp = new Date(status.timestamp);
    const hour = timestamp.getHours();
    
    // Simulate operational events based on power consumption patterns
    const isPeakHour = hour >= 8 && hour <= 17;
    const operations = {
      ships: isPeakHour ? 4 + Math.floor(Math.random() * 2) : 2 + Math.floor(Math.random() * 2),
      cranes: isPeakHour ? 7 + Math.floor(Math.random() * 2) : 4 + Math.floor(Math.random() * 2),
      containers: isPeakHour ? 200 + Math.floor(Math.random() * 100) : 100 + Math.floor(Math.random() * 50),
    };
    
    return {
      time: format(timestamp, 'HH:mm'),
      date: format(timestamp, 'MMM dd'),
      ships: operations.ships,
      cranes: operations.cranes,
      containers: operations.containers,
      power: status.total_power_mw,
      utilization: Math.min(100, status.utilization_percent), // Cap at 100% for display
    };
  });

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-primary" size={20} />
        <h4 className="text-white font-bold">الجدول الزمني للعمليات</h4>
      </div>
      
      <div className="space-y-4">
        {timelineEvents.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {/* Time */}
            <div className="flex flex-col items-center min-w-[60px]">
              <span className="text-white font-bold text-sm">{event.time}</span>
              <span className="text-gray-500 text-xs">{event.date}</span>
            </div>
            
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 bg-primary rounded-full" />
              {index < timelineEvents.length - 1 && (
                <div className="w-0.5 h-8 bg-gray-700" />
              )}
            </div>
            
            {/* Operations Data */}
            <div className="flex-1 grid grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Ship className="text-blue-400" size={16} />
                <div>
                  <p className="text-white text-sm font-medium">{event.ships}</p>
                  <p className="text-gray-500 text-xs">سفن</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Boxes className="text-orange-400" size={16} />
                <div>
                  <p className="text-white text-sm font-medium">{event.cranes}</p>
                  <p className="text-gray-500 text-xs">رافعات</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Activity className="text-green-400" size={16} />
                <div>
                  <p className="text-white text-sm font-medium">{event.containers}</p>
                  <p className="text-gray-500 text-xs">حاوية/ساعة</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div>
                  <p className="text-white text-sm font-medium">{event.power.toFixed(0)} MW</p>
                  <p className="text-gray-500 text-xs">{event.utilization.toFixed(0)}% استخدام</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

