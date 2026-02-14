import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { EnergyChart } from '../components/Dashboard/EnergyChart';
import { PredictionsView } from '../components/Analytics/PredictionsView';
import { generatePredictions } from '../data/predictions';
import { Card } from '../components/UI/Card';
import { TrendingUp, TrendingDown, DollarSign, Zap, BarChart3, Activity, Target } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { calculateCost } from '../utils/calculations';
import { CurrencySymbol } from '../components/UI/CurrencySymbol';

export function AnalyticsPage() {
  const { currentStatus, historicalData } = useRealTimeData();
  
  const predictions = useMemo(() => {
    if (!currentStatus) return [];
    return generatePredictions(currentStatus);
  }, [currentStatus]);

  // Advanced analytics calculations
  const analytics = useMemo(() => {
    if (!currentStatus || historicalData.length === 0) return null;

    const peakPower = Math.max(...historicalData.map(d => d.total_power_mw));
    const minPower = Math.min(...historicalData.map(d => d.total_power_mw));
    const avgPower = historicalData.reduce((sum, d) => sum + d.total_power_mw, 0) / historicalData.length;
    
    // Improved trend calculation - compare recent vs older data
    let trend: 'up' | 'down' | 'stable' = 'stable';
    let trendPercent = 0;
    
    if (historicalData.length >= 10) {
      // Compare last 25% of data with previous 25%
      const recentCount = Math.max(5, Math.floor(historicalData.length * 0.25));
      const recent = historicalData.slice(-recentCount);
      const older = historicalData.slice(-recentCount * 2, -recentCount);
      
      if (older.length > 0) {
        const recentAvg = recent.reduce((sum, d) => sum + d.total_power_mw, 0) / recent.length;
        const olderAvg = older.reduce((sum, d) => sum + d.total_power_mw, 0) / older.length;
        trendPercent = ((recentAvg - olderAvg) / olderAvg) * 100;
        
        if (Math.abs(trendPercent) < 2) {
          trend = 'stable';
        } else {
          trend = trendPercent > 0 ? 'up' : 'down';
        }
      }
    } else {
      // Fallback to simple comparison if not enough data
      trend = currentStatus.total_power_mw > avgPower ? 'up' : 'down';
      trendPercent = ((currentStatus.total_power_mw - avgPower) / avgPower) * 100;
    }
    
    // Calculate costs in Omani Rial
    // Using official Oman industrial tariff: 20 ر.ع/MWh (0.020 ر.ع/kWh)
    // Source: OPWP (Oman Power and Water Procurement Company) - Industrial Large Consumer Rate
    const costPerHour = calculateCost(currentStatus.total_power_mw, 20);
    const dailyCost = costPerHour * 24;
    const monthlyCost = dailyCost * 30.44; // Average days per month (365.25 / 12)
    
    // Calculate efficiency metrics
    const efficiency = Math.min(100, (currentStatus.total_power_mw / currentStatus.capacity_mw) * 100);
    const peakEfficiency = Math.min(100, (peakPower / currentStatus.capacity_mw) * 100);
    
    // Calculate variance and standard deviation
    const variance = historicalData.reduce((sum, d) => {
      const diff = d.total_power_mw - avgPower;
      return sum + (diff * diff);
    }, 0) / historicalData.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Calculate cost trends
    const costs = historicalData.map(d => calculateCost(d.total_power_mw, 20));
    const avgCost = costs.reduce((sum, c) => sum + c, 0) / costs.length;
    const peakCost = Math.max(...costs);
    
    return {
      peakPower,
      minPower,
      avgPower,
      trend,
      trendPercent,
      costPerHour,
      dailyCost,
      monthlyCost,
      efficiency,
      peakEfficiency,
      standardDeviation,
      avgCost,
      peakCost,
    };
  }, [currentStatus, historicalData]);

  if (!currentStatus || !analytics) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">جاري تحميل البيانات...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-dark p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <BarChart3 className="text-primary" size={32} />
              التحليلات المتقدمة والتوقعات
            </h1>
            <p className="text-gray-400">
              تحليل شامل للأداء والاتجاهات والتنبؤات الذكية
            </p>
          </div>
        </div>

        {/* Advanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Zap className="text-primary" size={20} />
              </div>
              {analytics.trend === 'up' ? (
                <TrendingUp className="text-success" size={20} />
              ) : (
                <TrendingDown className="text-danger" size={20} />
              )}
            </div>
            <p className="text-gray-400 text-sm mb-1">الذروة (24 ساعة)</p>
            <p className="text-2xl font-bold text-white">{analytics.peakPower.toFixed(1)} MW</p>
            <p className="text-gray-500 text-xs mt-1">
              الأدنى: {analytics.minPower.toFixed(1)} MW
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/30">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <Activity className="text-success" size={20} />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">المتوسط (24 ساعة)</p>
            <p className="text-2xl font-bold text-white">{analytics.avgPower.toFixed(1)} MW</p>
            <p className="text-gray-500 text-xs mt-1">
              الانحراف: ±{analytics.standardDeviation.toFixed(1)} MW
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-warning/20 to-warning/5 border-warning/30">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <DollarSign className="text-warning" size={20} />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">التكلفة الشهرية</p>
            <p className="text-2xl font-bold text-white flex items-center gap-1">
              {formatCurrency(analytics.monthlyCost)}
              <CurrencySymbol size={20} />
            </p>
            <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
              بالساعة: {formatCurrency(analytics.costPerHour)}
              <CurrencySymbol size={10} />
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-danger/20 to-danger/5 border-danger/30">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-danger/20 rounded-lg flex items-center justify-center">
                <Target className="text-danger" size={20} />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">الكفاءة الحالية</p>
            <p className="text-2xl font-bold text-white">
              {analytics.efficiency.toFixed(1)}%
            </p>
            <p className="text-gray-500 text-xs mt-1">
              ذروة الكفاءة: {analytics.peakEfficiency.toFixed(1)}%
            </p>
          </Card>
        </div>

        {/* Cost Analysis Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 border-blue-500/30">
            <p className="text-gray-400 text-sm mb-2">متوسط التكلفة اليومية</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(analytics.dailyCost)}</p>
            <p className="text-gray-500 text-xs mt-2">بناءً على متوسط الاستهلاك</p>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-500/10 border-purple-500/30">
            <p className="text-gray-400 text-sm mb-2">تكلفة الذروة (ساعة)</p>
            <p className="text-3xl font-bold text-white flex items-center gap-1">
              {formatCurrency(analytics.peakCost)}
              <CurrencySymbol size={24} />
            </p>
            <p className="text-gray-500 text-xs mt-2">أعلى تكلفة في 24 ساعة</p>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-600/20 to-green-500/10 border-green-500/30">
            <p className="text-gray-400 text-sm mb-2">متوسط التكلفة (ساعة)</p>
            <p className="text-3xl font-bold text-white flex items-center gap-1">
              {formatCurrency(analytics.avgCost)}
              <CurrencySymbol size={24} />
            </p>
            <p className="text-gray-500 text-xs mt-2">متوسط 24 ساعة</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6">
          <EnergyChart 
            historicalData={historicalData}
          />
        </div>

        {/* AI Predictions */}
        <PredictionsView predictions={predictions} />

        {/* Advanced Analytics Insights */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="text-primary" size={20} />
            تحليل الاتجاهات والأنماط
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-primary" size={18} />
                <p className="text-white font-medium">اتجاه الاستهلاك</p>
              </div>
              <p className="text-gray-300 text-sm mb-2">
                {analytics.trend === 'up' 
                  ? `الاستهلاك في ارتفاع - زيادة بنسبة ${Math.abs(analytics.trendPercent).toFixed(1)}%`
                  : analytics.trend === 'down'
                  ? `الاستهلاك في انخفاض - انخفاض بنسبة ${Math.abs(analytics.trendPercent).toFixed(1)}%`
                  : 'الاستهلاك مستقر - لا توجد تغييرات كبيرة'
                }
              </p>
              <p className="text-gray-400 text-xs">
                المتوسط: {analytics.avgPower.toFixed(1)} MW | الذروة: {analytics.peakPower.toFixed(1)} MW
              </p>
            </div>

            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="text-success" size={18} />
                <p className="text-white font-medium">استقرار النظام</p>
              </div>
              <p className="text-gray-300 text-sm mb-2">
                الانحراف المعياري: {analytics.standardDeviation.toFixed(1)} MW
              </p>
              <p className="text-gray-400 text-xs">
                {analytics.standardDeviation < 50 
                  ? 'نظام مستقر - تقلبات منخفضة'
                  : analytics.standardDeviation < 100
                  ? 'نظام متقلب - يحتاج مراقبة'
                  : 'نظام غير مستقر - يحتاج تدخل'
                }
              </p>
            </div>

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-warning" size={18} />
                <p className="text-white font-medium">تحليل التكاليف</p>
              </div>
              <p className="text-gray-300 text-sm mb-2 flex items-center gap-1">
                الفرق بين الذروة والمتوسط: {formatCurrency(analytics.peakCost - analytics.avgCost)}
                <CurrencySymbol size={12} />
              </p>
              <p className="text-gray-400 text-xs">
                فرصة توفير محتملة من تحسين جدولة الأحمال
              </p>
            </div>

            <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="text-danger" size={18} />
                <p className="text-white font-medium">الكفاءة التشغيلية</p>
              </div>
              <p className="text-gray-300 text-sm mb-2">
                الكفاءة الحالية: {analytics.efficiency.toFixed(1)}% من السعة
              </p>
              <p className="text-gray-400 text-xs">
                {analytics.efficiency > 90 
                  ? 'تحذير: قريب من الحد الأقصى'
                  : analytics.efficiency > 75
                  ? 'في النطاق الآمن'
                  : 'هناك مجال للتوسع'
                }
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

