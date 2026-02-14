import { motion } from 'framer-motion';
import { PortScene } from '../components/DigitalTwin/PortScene';
import { TimeControl } from '../components/UI/TimeControl';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { Maximize2, Info, Activity, Building2, Zap, TrendingUp, Leaf, Database } from 'lucide-react';
import { useMemo } from 'react';
import { formatPower } from '../utils/formatters';

export function DigitalTwinPage() {
  const dataHook = useRealTimeData();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Calculate stats for judges panel
  const stats = useMemo(() => {
    if (!dataHook.currentStatus) return null;
    
    const totalPower = dataHook.currentStatus.total_power_mw;
    const utilization = dataHook.currentStatus.utilization_percent;
    const companies = dataHook.currentStatus.companies?.length || 0;
    const alerts = dataHook.currentStatus.active_alerts || 0;
    
    // Count active equipment (equipment with status !== 'idle')
    const activeEquipment = dataHook.currentStatus.companies?.filter(
      c => c.status !== 'idle'
    ).length || 0;
    
    // Clean energy calculation (Solar + Wind)
    const cleanEnergyMW = 45; // 25 MW solar + 20 MW wind
    const cleanEnergyPercent = (cleanEnergyMW / totalPower) * 100;
    
    // CO2 emission factor for natural gas: ~0.45 ton CO2/MWh (Oman uses natural gas)
    // CO2 savings = clean energy power × emission factor
    const co2EmissionFactor = 0.45; // ton CO2/MWh for natural gas
    const co2Saved = cleanEnergyMW * co2EmissionFactor; // tons per hour
    
    return {
      activeEquipment,
      totalPower,
      utilization,
      companies,
      alerts,
      cleanEnergyMW,
      cleanEnergyPercent,
      co2Saved
    };
  }, [dataHook.currentStatus]);

  return (
    <div className="h-screen bg-dark flex flex-col">
      {/* Header */}
      <div className="bg-dark-secondary border-b border-primary/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              التوأم الرقمي ثلاثي الأبعاد
            </h1>
            <p className="text-gray-400 text-sm">
              عرض تفاعلي لميناء صحار الصناعي
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Time Controls */}
            <TimeControl
              isRunning={dataHook.isRunning}
              currentTime={dataHook.currentTime}
              speedMultiplier={dataHook.speedMultiplier}
              onPlayPause={() => dataHook.isRunning ? dataHook.pause() : dataHook.start()}
              onSpeedChange={dataHook.setSpeed}
              onJumpTime={dataHook.jumpTime}
            />
            
            {/* Fullscreen Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all"
            >
              <Maximize2 size={18} />
              <span className="hidden md:block text-sm">ملء الشاشة</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="flex-1 relative">
        <PortScene portStatus={dataHook.currentStatus} className="w-full h-full" />
        
        {/* Stats Panel for Judges - Top Left */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 left-4 bg-dark-secondary/95 backdrop-blur-lg border border-primary/20 rounded-xl p-4 max-w-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity className="text-primary" size={20} />
              <h3 className="text-white font-bold text-lg">نتائج التوأم الرقمي</h3>
            </div>
            
            <div className="space-y-3">
              {/* Total Power */}
              <div className="flex items-center justify-between bg-primary/10 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Zap className="text-primary" size={16} />
                  </div>
                  <span className="text-gray-400 text-sm">إجمالي الطاقة</span>
                </div>
                <span className="text-white font-bold text-lg">{formatPower(stats.totalPower)}</span>
              </div>

              {/* Utilization */}
              <div className="flex items-center justify-between bg-success/10 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-success" size={16} />
                  </div>
                  <span className="text-gray-400 text-sm">معدل التشغيل</span>
                </div>
                <span className="text-white font-bold text-lg">{stats.utilization.toFixed(1)}%</span>
              </div>

              {/* Active Equipment */}
              <div className="flex items-center justify-between bg-warning/10 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                    <Database className="text-warning" size={16} />
                  </div>
                  <span className="text-gray-400 text-sm">معدات نشطة</span>
                </div>
                <span className="text-white font-bold text-lg">{stats.activeEquipment}</span>
              </div>

              {/* Companies Monitored */}
              <div className="flex items-center justify-between bg-info/10 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-info/20 rounded-lg flex items-center justify-center">
                    <Building2 className="text-info" size={16} />
                  </div>
                  <span className="text-gray-400 text-sm">شركات مراقبة</span>
                </div>
                <span className="text-white font-bold text-lg">{stats.companies}</span>
              </div>

              {/* Clean Energy */}
              <div className="flex items-center justify-between bg-success/10 rounded-lg p-3 border border-success/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                    <Leaf className="text-success" size={16} />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block">طاقة نظيفة</span>
                    <span className="text-success text-xs font-medium">{stats.cleanEnergyPercent.toFixed(1)}% من الإجمالي</span>
                  </div>
                </div>
                <span className="text-white font-bold text-lg">{stats.cleanEnergyMW} MW</span>
              </div>

              {/* CO2 Savings */}
              <div className="bg-gradient-to-r from-success/20 to-primary/20 rounded-lg p-3 border border-success/30">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-xs">توفير CO₂ (طن/ساعة)</span>
                  <span className="text-success font-bold">{stats.co2Saved.toFixed(1)} طن</span>
                </div>
              </div>
            </div>

            {/* Real-time indicator */}
            <div className="mt-4 pt-3 border-t border-gray-700 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-gray-400 text-xs">تحديث مباشر • Real-time</span>
            </div>
          </motion.div>
        )}
        
        {/* Info Panel - Top Right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-4 bg-dark-secondary/95 backdrop-blur-lg border border-primary/20 rounded-xl p-4 max-w-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <Info className="text-primary" size={18} />
            <h3 className="text-white font-bold">إرشادات التحكم</h3>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">تدوير العرض:</span>
              <span className="text-white">اسحب بالماوس</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">تكبير/تصغير:</span>
              <span className="text-white">عجلة الماوس</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">اختيار عنصر:</span>
              <span className="text-white">انقر عليه</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">إعادة الموضع:</span>
              <span className="text-white">نقر مزدوج</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-success rounded-full" />
                <span className="text-gray-400">عادي</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-warning rounded-full" />
                <span className="text-gray-400">متوسط</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-danger rounded-full" />
                <span className="text-gray-400">عالي</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-500 rounded-full" />
                <span className="text-gray-400">متوقف</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

