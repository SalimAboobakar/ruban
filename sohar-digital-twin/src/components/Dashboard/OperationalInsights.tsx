import { motion } from 'framer-motion';
import { Card } from '../UI/Card';
import { Lightbulb, TrendingUp, AlertCircle, Target, Zap, Clock } from 'lucide-react';
import type { OperationsKPIs } from '../../utils/operationsAnalytics';

interface OperationalInsightsProps {
  kpis: OperationsKPIs;
}

/**
 * Operational Insights Component
 * Provides AI-powered insights and recommendations
 */
export function OperationalInsights({ kpis }: OperationalInsightsProps) {
  const insights = [];
  
  // Generate insights based on KPIs
  if (kpis.ships.berthUtilization > 85) {
    insights.push({
      type: 'warning',
      icon: AlertCircle,
      title: 'استخدام عالي للأرصفة',
      message: `استخدام الأرصفة ${kpis.ships.berthUtilization.toFixed(0)}% - قد تحتاج لتفعيل رصيف إضافي قريباً`,
      action: 'مراجعة جدولة السفن',
    });
  }
  
  if (kpis.cranes.overallUtilization < 60) {
    insights.push({
      type: 'opportunity',
      icon: TrendingUp,
      title: 'فرصة لتحسين الكفاءة',
      message: `استخدام الرافعات ${kpis.cranes.overallUtilization.toFixed(0)}% - يمكن زيادة الإنتاجية`,
      action: 'تفعيل رافعات إضافية',
    });
  }
  
  if (kpis.efficiency.energyPerContainer > 0.5) {
    insights.push({
      type: 'optimization',
      icon: Zap,
      title: 'تحسين استهلاك الطاقة',
      message: `الطاقة لكل حاوية ${kpis.efficiency.energyPerContainer.toFixed(2)} MW - أعلى من المتوسط`,
      action: 'مراجعة جدولة العمليات',
    });
  }
  
  if (kpis.ships.avgDwellTime > 20) {
    insights.push({
      type: 'warning',
      icon: Clock,
      title: 'وقت رسو طويل',
      message: `متوسط وقت الرسو ${kpis.ships.avgDwellTime.toFixed(1)} ساعة - يحتاج تحسين`,
      action: 'تحسين عمليات التحميل/التفريغ',
    });
  }
  
  if (kpis.efficiency.operationalIndex > 80) {
    insights.push({
      type: 'success',
      icon: Target,
      title: 'أداء ممتاز',
      message: `مؤشر الأداء ${kpis.efficiency.operationalIndex.toFixed(0)}/100 - العمليات تعمل بكفاءة عالية`,
      action: 'الحفاظ على الأداء الحالي',
    });
  }
  
  // Default insight if no specific insights
  if (insights.length === 0) {
    insights.push({
      type: 'info',
      icon: Lightbulb,
      title: 'العمليات طبيعية',
      message: 'جميع المؤشرات ضمن النطاق الطبيعي - لا توجد توصيات حالياً',
      action: 'متابعة المراقبة',
    });
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="text-warning" size={20} />
        <h4 className="text-white font-bold">رؤى وتوصيات ذكية</h4>
      </div>
      
      <div className="space-y-3">
        {insights.slice(0, 4).map((insight, index) => {
          const Icon = insight.icon;
          const colorMap = {
            warning: 'danger',
            opportunity: 'success',
            optimization: 'primary',
            success: 'success',
            info: 'primary',
          };
          const color = colorMap[insight.type as keyof typeof colorMap] || 'primary';
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                color === 'danger'
                  ? 'bg-danger/10 border-danger/30'
                  : color === 'success'
                  ? 'bg-success/10 border-success/30'
                  : 'bg-primary/10 border-primary/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  color === 'danger'
                    ? 'bg-danger/20'
                    : color === 'success'
                    ? 'bg-success/20'
                    : 'bg-primary/20'
                }`}>
                  <Icon className={
                    color === 'danger'
                      ? 'text-danger'
                      : color === 'success'
                      ? 'text-success'
                      : 'text-primary'
                  } size={20} />
                </div>
                <div className="flex-1">
                  <h5 className="text-white font-bold mb-1">{insight.title}</h5>
                  <p className="text-gray-300 text-sm mb-2">{insight.message}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    color === 'danger'
                      ? 'bg-danger/20 text-danger'
                      : color === 'success'
                      ? 'bg-success/20 text-success'
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {insight.action}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

