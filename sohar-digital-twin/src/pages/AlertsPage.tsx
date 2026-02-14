import { motion } from 'framer-motion';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { AlertsPanel } from '../components/Dashboard/AlertsPanel';
import { Card } from '../components/UI/Card';
import { AlertTriangle, CheckCircle, Clock, Bell } from 'lucide-react';

export function AlertsPage() {
  const { currentStatus } = useRealTimeData();

  if (!currentStatus) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">جاري تحميل البيانات...</p>
      </div>
    </div>;
  }

  const criticalAlerts = currentStatus.companies.filter(c => c.status === 'high').length;
  const warningAlerts = currentStatus.companies.filter(c => c.status === 'medium').length;
  const normalCount = currentStatus.companies.filter(c => c.status === 'normal').length;

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
            التنبيهات والإشعارات
          </h1>
          <p className="text-gray-400">
            مراقبة جميع التنبيهات والحالات الحرجة
          </p>
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-danger/20 to-danger/5 border-danger/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-danger/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-danger" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">تنبيهات حرجة</p>
                <p className="text-3xl font-bold text-white">{criticalAlerts}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-warning/20 to-warning/5 border-warning/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                <Clock className="text-warning" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">تحذيرات</p>
                <p className="text-3xl font-bold text-white">{warningAlerts}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-success" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">حالات طبيعية</p>
                <p className="text-3xl font-bold text-white">{normalCount}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Bell className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">إجمالي الإشعارات</p>
                <p className="text-3xl font-bold text-white">{criticalAlerts + warningAlerts}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Alerts Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AlertsPanel currentStatus={currentStatus} />
          </div>

          <div className="space-y-4">
            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-bold text-white mb-4">إجراءات سريعة</h3>
              <div className="space-y-2">
                <button className="w-full p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all text-sm font-medium">
                  إرسال تنبيه لجميع الشركات
                </button>
                <button className="w-full p-3 bg-danger/10 hover:bg-danger/20 text-danger rounded-lg transition-all text-sm font-medium">
                  تفعيل وضع الطوارئ
                </button>
                <button className="w-full p-3 bg-success/10 hover:bg-success/20 text-success rounded-lg transition-all text-sm font-medium">
                  إيقاف جميع التنبيهات
                </button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <h3 className="text-lg font-bold text-white mb-4">نشاط حديث</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2 bg-danger/5 rounded-lg">
                  <div className="w-2 h-2 bg-danger rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-white text-sm">Vale Oman</p>
                    <p className="text-gray-400 text-xs">استهلاك عالي - 95 MW</p>
                    <p className="text-gray-500 text-xs mt-1">منذ 5 دقائق</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 bg-warning/5 rounded-lg">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-white text-sm">Jindal Shadeed</p>
                    <p className="text-gray-400 text-xs">استهلاك متوسط - 115 MW</p>
                    <p className="text-gray-500 text-xs mt-1">منذ 12 دقيقة</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 bg-success/5 rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-white text-sm">Sohar Aluminum</p>
                    <p className="text-gray-400 text-xs">عودة للحالة الطبيعية</p>
                    <p className="text-gray-500 text-xs mt-1">منذ 20 دقيقة</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

