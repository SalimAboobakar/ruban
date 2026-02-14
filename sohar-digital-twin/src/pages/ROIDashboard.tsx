import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { Card } from '../components/UI/Card';
import { generateLoadOptimization } from '../utils/loadOptimization';
import { calculateSustainabilityMetrics } from '../utils/sustainability';
import { calculateROIMetrics } from '../utils/roiCalculations';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Leaf,
  Wrench,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { CurrencySymbol } from '../components/UI/CurrencySymbol';

export function ROIDashboard() {
  const { currentStatus } = useRealTimeData();

  const roiMetrics = useMemo(() => {
    if (!currentStatus) return null;

    const loadOptimization = generateLoadOptimization(currentStatus);
    const sustainability = calculateSustainabilityMetrics(currentStatus);
    const roi = calculateROIMetrics(loadOptimization, sustainability);

    return { loadOptimization, sustainability, roi };
  }, [currentStatus]);

  if (!currentStatus || !roiMetrics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  const { roi, loadOptimization, sustainability } = roiMetrics;

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
            <h1 className="text-3xl font-bold text-white mb-2">
              لوحة تحكم العائد على الاستثمار (ROI)
            </h1>
            <p className="text-gray-400">
              تحليل شامل للتوفير والعائد على الاستثمار
            </p>
          </div>
          <div className="flex items-center gap-2 bg-success/10 px-4 py-2 rounded-lg border border-success/30">
            <CheckCircle className="text-success" size={20} />
            <span className="text-success font-bold text-lg">
              ROI: {roi.roi.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Main ROI Card */}
        <Card className="bg-gradient-to-br from-primary/20 via-success/10 to-primary/5 border-2 border-primary/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="text-success" size={32} />
              </div>
              <p className="text-gray-400 text-sm mb-1">التوفير الشهري</p>
              <p className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                {formatCurrency(roi.monthlySavings.total)}
                <CurrencySymbol size={28} variant="bold" />
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="text-primary" size={32} />
              </div>
              <p className="text-gray-400 text-sm mb-1">التوفير السنوي</p>
              <p className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                {formatCurrency(roi.annualSavings)}
                <CurrencySymbol size={28} variant="bold" />
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="text-warning" size={32} />
              </div>
              <p className="text-gray-400 text-sm mb-1">فترة الاسترداد</p>
              <p className="text-3xl font-bold text-white">
                {roi.paybackPeriod.toFixed(1)} شهر
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="text-success" size={32} />
              </div>
              <p className="text-gray-400 text-sm mb-1">العائد على الاستثمار</p>
              <p className="text-3xl font-bold text-white">{roi.roi.toFixed(0)}%</p>
            </div>
          </div>
        </Card>

        {/* Savings Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Zap className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">من تحسين الأحمال</p>
                <p className="text-2xl font-bold text-white flex items-center gap-1">
                  {formatCurrency(roi.monthlySavings.fromLoadOptimization)}
                  <CurrencySymbol size={20} />
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                توفير من جدولة الأحمال وتجنب ساعات الذروة
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <Leaf className="text-success" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">من الطاقة المتجددة</p>
                <p className="text-2xl font-bold text-white flex items-center gap-1">
                  {formatCurrency(roi.monthlySavings.fromRenewableEnergy)}
                  <CurrencySymbol size={20} />
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                توفير من استخدام الطاقة الشمسية وطاقة الرياح
              </p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-warning/20 to-warning/5 border-warning/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                <Wrench className="text-warning" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">من الصيانة التنبؤية</p>
                <p className="text-2xl font-bold text-white flex items-center gap-1">
                  {formatCurrency(roi.monthlySavings.fromPredictiveMaintenance)}
                  <CurrencySymbol size={20} />
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                توفير من منع الأعطال والحد من وقت التوقف
              </p>
            </div>
          </Card>
        </div>

        {/* Daily/Weekly Savings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">التوفير اليومي</p>
                <p className="text-3xl font-bold text-white flex items-center gap-2">
                  {formatCurrency(roi.dailySavings)}
                  <CurrencySymbol size={28} />
                </p>
              </div>
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Calendar className="text-primary" size={32} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">التوفير الأسبوعي</p>
                <p className="text-3xl font-bold text-white flex items-center gap-2">
                  {formatCurrency(roi.weeklySavings)}
                  <CurrencySymbol size={28} />
                </p>
              </div>
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
                <TrendingUp className="text-success" size={32} />
              </div>
            </div>
          </Card>
        </div>

        {/* Optimization Recommendations */}
        {loadOptimization.recommendations.length > 0 && (
          <Card>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ArrowRight className="text-primary" size={20} />
              توصيات تحسين الأحمال
            </h3>
            <div className="space-y-3">
              {loadOptimization.recommendations.slice(0, 5).map((rec) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border ${
                    rec.priority === 'high'
                      ? 'bg-danger/10 border-danger/30'
                      : rec.priority === 'medium'
                      ? 'bg-warning/10 border-warning/30'
                      : 'bg-primary/10 border-primary/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-bold">{rec.companyName}</h4>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            rec.priority === 'high'
                              ? 'bg-danger/20 text-danger'
                              : rec.priority === 'medium'
                              ? 'bg-warning/20 text-warning'
                              : 'bg-primary/20 text-primary'
                          }`}
                        >
                          {rec.priority === 'high' ? 'عالي' : rec.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{rec.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>التكلفة الحالية: {formatCurrency(rec.currentCost)} <CurrencySymbol size={12} />/ساعة</span>
                        <span>التكلفة المحسّنة: {formatCurrency(rec.optimizedCost)} <CurrencySymbol size={12} />/ساعة</span>
                        <span className="text-success font-bold">
                          التوفير: {formatCurrency(rec.savings)} <CurrencySymbol size={12} />/يوم
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-success text-2xl font-bold flex items-center justify-end gap-1">
                        {formatCurrency(rec.savings)}
                        <CurrencySymbol size={20} />
                      </p>
                      <p className="text-gray-400 text-xs mt-1">{rec.timeframe}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* Implementation Cost */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">تكلفة التطبيق (مرة واحدة)</p>
              <p className="text-3xl font-bold text-white flex items-center gap-2">
                {formatCurrency(roi.implementationCost)}
                <CurrencySymbol size={28} />
              </p>
            </div>
            <div className="text-right">
              <p className="text-success text-sm mb-1">العائد السنوي</p>
              <p className="text-2xl font-bold text-success flex items-center justify-end gap-1">
                {formatCurrency(roi.annualSavings)}
                <CurrencySymbol size={20} />
              </p>
              <p className="text-gray-400 text-xs mt-2">
                فترة الاسترداد: {roi.paybackPeriod.toFixed(1)} شهر
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

