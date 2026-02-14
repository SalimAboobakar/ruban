import { motion } from 'framer-motion';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { 
  Zap, 
  Sun, 
  Wind, 
  Battery, 
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { Card } from '../components/UI/Card';

interface EnergySource {
  id: string;
  name: string;
  nameAr: string;
  icon: any;
  capacity: number;
  current: number;
  color: string;
  gradient: string;
  type: 'renewable' | 'conventional';
  co2Saving?: number;
}

export function EnergySourcesPage() {
  const { currentStatus } = useRealTimeData();

  if (!currentStatus) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">جاري تحميل البيانات...</p>
      </div>
    </div>;
  }

  // Realistic energy sources data for Sohar Industrial Port (2024)
  // Total capacity: 1,100 MW (matching PORT_CAPACITY_MW)
  const totalPower = currentStatus.total_power_mw;
  
  // Calculate time-based solar/wind efficiency
  const hour = new Date().getHours();
  const solarEfficiency = (hour >= 6 && hour <= 18) ? 0.75 : 0.0; // Peak 6AM-6PM
  const windEfficiency = 0.80; // Wind relatively constant in Oman
  
  // Battery storage usage (for load balancing and peak support)
  // Only used when renewable energy is available or during peak demand
  const batteryUsage = solarEfficiency > 0 
    ? Math.min(totalPower * 0.02, 15) // Charge/discharge during solar hours (up to 50%)
    : Math.min(totalPower * 0.01, 10); // Minimal usage at night (up to 33%)
  
  // Green Hydrogen for clean backup power (Vision 2040)
  // Activated during peak demand or when renewable energy is insufficient
  const isHighDemand = totalPower > 1000; // Above 1000 MW = high demand
  const hydrogenUsage = isHighDemand 
    ? Math.min(totalPower * 0.06, 50) // Emergency support (up to 25%)
    : 0; // Zero usage during normal operation - standby mode
  
  const energySources: EnergySource[] = [
    {
      id: 'grid',
      name: 'Main Grid (Natural Gas)',
      nameAr: 'الشبكة الكهربائية الرئيسية (غاز طبيعي)',
      icon: Zap,
      capacity: 750, // 68% of total capacity
      current: Math.min(totalPower * 0.68, 750), // 68% from grid, max 750 MW
      color: '#3b82f6',
      gradient: 'from-blue-500/20 to-blue-500/5',
      type: 'conventional',
    },
    {
      id: 'solar',
      name: 'Solar Panels',
      nameAr: 'الألواح الشمسية',
      icon: Sun,
      capacity: 60, // Realistic for 2024
      current: Math.min(totalPower * 0.06, 60) * solarEfficiency, // 6% from solar (daytime only), max 60 MW
      color: '#fbbf24',
      gradient: 'from-yellow-500/20 to-yellow-500/5',
      type: 'renewable',
      co2Saving: 216000, // kg CO2/day (60 MW × 8h × 0.45 ton/MWh = 216 ton/day)
    },
    {
      id: 'wind',
      name: 'Wind Turbines',
      nameAr: 'توربينات الرياح',
      icon: Wind,
      capacity: 40, // Realistic for coastal Oman
      current: Math.min(totalPower * 0.04, 40) * windEfficiency, // 4% from wind, max 40 MW
      color: '#10b981',
      gradient: 'from-green-500/20 to-green-500/5',
      type: 'renewable',
      co2Saving: 216000, // kg CO2/day (40 MW × 12h × 0.45 ton/MWh = 216 ton/day)
    },
    {
      id: 'storage',
      name: 'Battery Storage',
      nameAr: 'أنظمة التخزين (بطاريات)',
      icon: Battery,
      capacity: 30, // 30 MW / 120 MWh storage
      current: batteryUsage, // Dynamic usage based on renewable energy availability
      color: '#8b5cf6',
      gradient: 'from-purple-500/20 to-purple-500/5',
      type: 'renewable',
      co2Saving: 0, // Already counted in solar/wind
    },
    {
      id: 'hydrogen',
      name: 'Green Hydrogen',
      nameAr: 'الهيدروجين الأخضر',
      icon: Zap,
      capacity: 200, // 200 MW clean backup (Vision 2040)
      current: hydrogenUsage, // Clean backup for emergencies
      color: '#06b6d4',
      gradient: 'from-cyan-500/20 to-cyan-500/5',
      type: 'renewable',
      co2Saving: 0, // Zero emissions!
    },
  ];

  const totalRenewable = energySources
    .filter(s => s.type === 'renewable')
    .reduce((sum, s) => sum + s.current, 0);
  
  const renewablePercentage = (totalRenewable / totalPower) * 100;
  
  const totalCO2Saving = energySources
    .filter(s => s.type === 'renewable')
    .reduce((sum, s) => sum + (s.co2Saving || 0), 0);

  const getTrend = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage > 80) return { icon: TrendingUp, color: 'text-success', text: 'مرتفع' };
    if (percentage < 30) return { icon: TrendingDown, color: 'text-danger', text: 'منخفض' };
    return { icon: Minus, color: 'text-warning', text: 'مستقر' };
  };

  return (
    <div className="min-h-screen bg-dark p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            مصادر الطاقة
          </h1>
          <p className="text-gray-400">
            مراقبة مصادر الطاقة المختلفة للميناء
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Zap className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">إجمالي الإنتاج</p>
                  <p className="text-2xl font-bold text-white">
                    {totalPower.toFixed(1)} MW
                  </p>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              من قدرة كلية: <span className="text-white font-semibold">1,100 MW</span>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                  <Battery className="text-success" size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">طاقة متجددة</p>
                  <p className="text-2xl font-bold text-white">
                    {renewablePercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {totalRenewable.toFixed(1)} MW من مصادر نظيفة
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🌱</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">توفير CO₂</p>
                  <p className="text-2xl font-bold text-white">
                    {(totalCO2Saving / 1000).toFixed(1)} طن
                  </p>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              يومياً من الطاقة المتجددة
            </div>
          </Card>
        </div>

        {/* Energy Sources Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {energySources.map((source, index) => {
            const Icon = source.icon;
            const percentage = (source.current / source.capacity) * 100;
            const trend = getTrend(source.current, source.capacity);
            const TrendIcon = trend.icon;

            return (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-gradient-to-br ${source.gradient} border-opacity-30`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${source.color}20` }}
                      >
                        <Icon size={32} style={{ color: source.color }} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {source.nameAr}
                        </h3>
                        <p className="text-gray-400 text-sm">{source.name}</p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 ${trend.color}`}>
                      <TrendIcon size={20} />
                      <span className="text-sm font-medium">{trend.text}</span>
                    </div>
                  </div>

                  {/* Power Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">الحالي</p>
                      <p className="text-white text-lg font-bold">
                        {source.current.toFixed(1)} MW
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">القدرة</p>
                      <p className="text-white text-lg font-bold">
                        {source.capacity} MW
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">الاستخدام</p>
                      <p className="text-white text-lg font-bold">
                        {percentage.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="absolute h-full rounded-full"
                      style={{ 
                        backgroundColor: source.color,
                        boxShadow: `0 0 20px ${source.color}40`
                      }}
                    />
                  </div>

                  {/* Additional Info */}
                  {source.type === 'renewable' && source.co2Saving && source.co2Saving > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-2xl">🌱</span>
                      <div>
                        <span className="text-gray-400">توفير CO₂: </span>
                        <span className="text-success font-semibold">
                          {(source.co2Saving / 1000).toFixed(1)} طن/يوم
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {source.id === 'storage' && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">🔋</span>
                      <div className="text-gray-400">
                        <span className="font-semibold text-purple-400">تخزين ذكي:</span> تشحن من الطاقة المتجددة وتفرغ عند الذروة
                      </div>
                    </div>
                  )}
                  
                  {source.id === 'hydrogen' && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">🌊</span>
                      <div className="text-gray-400">
                        <span className="font-semibold text-cyan-400">احتياطي نظيف:</span> طاقة نظيفة 100% - صفر انبعاثات - رؤية 2040
                      </div>
                    </div>
                  )}

                  {source.type === 'conventional' && source.id === 'grid' && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-lg">⚡</span>
                      <span>مصدر رئيسي</span>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Technical Specifications */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4">
            المواصفات الفنية والكفاءة
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-blue-400 text-xs font-semibold mb-1">الغاز الطبيعي</p>
              <p className="text-white text-sm">الكفاءة: <span className="font-bold">40%</span></p>
              <p className="text-gray-400 text-xs">معامل السعة: 85%</p>
            </div>
            
            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <p className="text-yellow-400 text-xs font-semibold mb-1">الطاقة الشمسية</p>
              <p className="text-white text-sm">الكفاءة: <span className="font-bold">18%</span></p>
              <p className="text-gray-400 text-xs">معامل السعة: 22% (8h/day)</p>
            </div>
            
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-green-400 text-xs font-semibold mb-1">طاقة الرياح</p>
              <p className="text-white text-sm">الكفاءة: <span className="font-bold">35%</span></p>
              <p className="text-gray-400 text-xs">معامل السعة: 35% (رياح متوسطة)</p>
            </div>
            
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <p className="text-purple-400 text-xs font-semibold mb-1">أنظمة التخزين (بطاريات)</p>
              <p className="text-white text-sm">الكفاءة: <span className="font-bold">90%</span></p>
              <p className="text-gray-400 text-xs">سعة: 30 MW / 120 MWh</p>
              <p className="text-purple-300 text-xs mt-1">🔋 للتخزين وموازنة الأحمال</p>
            </div>
            
            <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <p className="text-cyan-400 text-xs font-semibold mb-1">الهيدروجين الأخضر</p>
              <p className="text-white text-sm">الكفاءة: <span className="font-bold">50-60%</span></p>
              <p className="text-gray-400 text-xs">سعة: 200 MW احتياطي نظيف</p>
              <p className="text-cyan-300 text-xs mt-1">🌊 صفر انبعاثات - رؤية 2040</p>
            </div>
            
            <div className="p-3 bg-gray-500/10 rounded-lg border border-gray-500/20">
              <p className="text-gray-400 text-xs font-semibold mb-1">كفاءة النظام الكلية</p>
              <p className="text-white text-sm">النظام: <span className="font-bold">92-95%</span></p>
              <p className="text-gray-400 text-xs">خسائر النقل: 2-5%</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
              <p className="text-info text-sm">
                <span className="font-semibold">ℹ️ ملاحظة:</span> جميع الأرقام والكفاءات مبنية على معايير 
                IEEE و IRENA للأنظمة الصناعية. الطاقة الشمسية تعمل فقط أثناء النهار (6 صباحاً - 6 مساءً).
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-purple-400 text-xs font-semibold mb-1">🔋 البطاريات (التخزين)</p>
                <p className="text-gray-300 text-xs">
                  تشحن أثناء توفر الطاقة المتجددة وتفرغ عند الذروة أو غياب الشمس/الرياح. 
                  <span className="text-purple-300 font-semibold"> الاستخدام: 0-50%</span> حسب الحاجة.
                </p>
              </div>
              
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                <p className="text-cyan-400 text-xs font-semibold mb-1">🌊 الهيدروجين الأخضر</p>
                <p className="text-gray-300 text-xs">
                  احتياطي نظيف بدون انبعاثات. يعمل فقط عند الأحمال العالية أو الطوارئ. 
                  <span className="text-cyan-300 font-semibold"> الاستخدام: 0% عادياً</span>، 
                  <span className="text-cyan-300 font-semibold"> حتى 25% بالطوارئ</span>. مستقبل الطاقة النظيفة!
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Renewable Energy Goals - Oman Vision 2040 */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4">
            أهداف الطاقة المتجددة - رؤية عُمان 2040
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">الهدف 2024: 10% طاقة متجددة</span>
                <span className="text-white font-semibold">{renewablePercentage.toFixed(1)}%</span>
              </div>
              <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-success rounded-full"
                  style={{ width: `${Math.min((renewablePercentage / 10) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">الهدف 2030: 20% طاقة متجددة</span>
                <span className="text-white font-semibold">{(renewablePercentage / 2).toFixed(1)}%</span>
              </div>
              <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-warning rounded-full"
                  style={{ width: `${(renewablePercentage / 20) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">الهدف 2040: 30% طاقة متجددة</span>
                <span className="text-white font-semibold">{(renewablePercentage / 3).toFixed(1)}%</span>
              </div>
              <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-info rounded-full"
                  style={{ width: `${(renewablePercentage / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
            <p className="text-success text-sm flex items-center gap-2">
              <span>🎯</span>
              <span>
                نحو أهدافنا! حققنا {renewablePercentage.toFixed(1)}% من الطاقة المتجددة في 2024، 
                ونسير على الطريق الصحيح لتحقيق رؤية عُمان 2040.
              </span>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

