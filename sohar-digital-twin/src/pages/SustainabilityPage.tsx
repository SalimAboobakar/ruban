import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { Card } from '../components/UI/Card';
import { calculateSustainabilityMetrics } from '../utils/sustainability';
import {
  Leaf,
  TrendingUp,
  Target,
  CheckCircle,
  XCircle,
  Cloud,
  Zap,
  DollarSign,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { CurrencySymbol } from '../components/UI/CurrencySymbol';

export function SustainabilityPage() {
  const { currentStatus } = useRealTimeData();

  const sustainability = useMemo(() => {
    if (!currentStatus) return null;
    return calculateSustainabilityMetrics(currentStatus);
  }, [currentStatus]);

  if (!currentStatus || !sustainability) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

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
            لوحة تحكم الاستدامة
          </h1>
          <p className="text-gray-400">
            تتبع الأداء البيئي والتقدم نحو Vision 2040
          </p>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Carbon Footprint */}
          <Card className="bg-gradient-to-br from-danger/20 to-danger/5 border-danger/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-danger/20 rounded-lg flex items-center justify-center">
                <Cloud className="text-danger" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm">البصمة الكربونية</p>
                <p className="text-2xl font-bold text-white">
                  {sustainability.carbonFootprint.current.toLocaleString()} طن/شهر
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">الهدف</span>
                <span className="text-white text-sm font-medium">
                  {sustainability.carbonFootprint.target.toLocaleString()} طن/شهر
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-danger rounded-full h-2 transition-all"
                  style={{
                    width: `${Math.min(
                      (sustainability.carbonFootprint.reductionPercentage / 100) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-success text-xs mt-2">
                تخفيض متوقع: {sustainability.carbonFootprint.reduction.toLocaleString()} طن/شهر
              </p>
            </div>
          </Card>

          {/* Renewable Energy */}
          <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <Leaf className="text-success" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm">الطاقة المتجددة</p>
                <p className="text-2xl font-bold text-white">
                  {sustainability.renewableEnergy.current.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">الهدف (Vision 2040)</span>
                <span className="text-white text-sm font-medium">
                  {sustainability.renewableEnergy.target}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-success rounded-full h-2 transition-all"
                  style={{
                    width: `${sustainability.renewableEnergy.progress}%`,
                  }}
                />
              </div>
              <p className="text-success text-xs mt-2">
                التقدم: {sustainability.renewableEnergy.progress.toFixed(1)}% من الهدف
              </p>
            </div>
          </Card>

          {/* Cost Savings */}
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <DollarSign className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm">توفير التكاليف</p>
                <p className="text-2xl font-bold text-white flex items-center gap-1">
                  {formatCurrency(sustainability.costSavings.total)}
                  <CurrencySymbol size={20} />
                  <span className="text-sm text-gray-400">/شهر</span>
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">من الطاقة المتجددة</span>
                <span className="text-success flex items-center gap-1">
                  {formatCurrency(sustainability.costSavings.fromRenewables)}
                  <CurrencySymbol size={12} />
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">من التحسينات</span>
                <span className="text-primary flex items-center gap-1">
                  {formatCurrency(sustainability.costSavings.fromOptimization)}
                  <CurrencySymbol size={12} />
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Certifications */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="text-primary" size={20} />
            الشهادات والمعايير
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-lg border ${
                sustainability.certifications.iso14001
                  ? 'bg-success/10 border-success/30'
                  : 'bg-gray-800 border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">ISO 14001</span>
                {sustainability.certifications.iso14001 ? (
                  <CheckCircle className="text-success" size={24} />
                ) : (
                  <XCircle className="text-gray-500" size={24} />
                )}
              </div>
              <p className="text-gray-400 text-sm">
                {sustainability.certifications.iso14001
                  ? 'متوافق مع معايير إدارة البيئة'
                  : 'يتطلب 10%+ طاقة متجددة'}
              </p>
            </div>

            <div
              className={`p-4 rounded-lg border ${
                sustainability.certifications.carbonNeutral
                  ? 'bg-success/10 border-success/30'
                  : 'bg-gray-800 border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">محايد كربونياً</span>
                {sustainability.certifications.carbonNeutral ? (
                  <CheckCircle className="text-success" size={24} />
                ) : (
                  <XCircle className="text-gray-500" size={24} />
                )}
              </div>
              <p className="text-gray-400 text-sm">
                {sustainability.certifications.carbonNeutral
                  ? 'محايد كربونياً بالكامل'
                  : 'يتطلب 100% طاقة متجددة'}
              </p>
            </div>
          </div>
        </Card>

        {/* Progress Towards Vision 2040 */}
        <Card className="bg-gradient-to-br from-primary/10 to-success/10 border-primary/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-success" size={20} />
            التقدم نحو Vision 2040
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">الطاقة المتجددة</span>
                <span className="text-white font-bold">
                  {sustainability.renewableEnergy.current.toFixed(1)}% /{' '}
                  {sustainability.renewableEnergy.target}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-success to-primary rounded-full h-4 transition-all flex items-center justify-end pr-2"
                  style={{
                    width: `${sustainability.renewableEnergy.progress}%`,
                  }}
                >
                  <span className="text-xs text-white font-bold">
                    {sustainability.renewableEnergy.progress.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">الحالي (2024)</p>
                <p className="text-2xl font-bold text-white">
                  {sustainability.renewableEnergy.current.toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">الهدف (2030)</p>
                <p className="text-2xl font-bold text-primary">20%</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">الهدف (2040)</p>
                <p className="text-2xl font-bold text-success">
                  {sustainability.renewableEnergy.target}%
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Environmental Impact */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4">الأثر البيئي</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-danger/10 border border-danger/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="text-danger" size={20} />
                <span className="text-white font-medium">انبعاثات CO₂ الحالية</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {sustainability.carbonFootprint.current.toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mt-1">طن/شهر</p>
            </div>

            <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="text-success" size={20} />
                <span className="text-white font-medium">التخفيض المتوقع</span>
              </div>
              <p className="text-3xl font-bold text-success">
                {sustainability.carbonFootprint.reduction.toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                طن/شهر ({sustainability.carbonFootprint.reductionPercentage.toFixed(1)}%)
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

