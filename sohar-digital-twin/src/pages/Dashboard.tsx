import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { getAllCompanyProfiles } from '../data/companyEnergyProfiles';
import { 
  Zap, Activity, TrendingUp, AlertTriangle, Info, 
  BarChart3, Target, Leaf, Building2, Gauge,
  ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { formatPower } from '../utils/formatters';

export function Dashboard() {
  const { currentStatus, historicalData, isRunning } = useRealTimeData();
  const profiles = getAllCompanyProfiles();

  // Calculate Port Level Metrics
  const portMetrics = useMemo(() => {
    if (!currentStatus) return null;

    const totalLoad = currentStatus.total_power_mw;
    const companies = currentStatus.companies || [];
    
    // Sort companies by power
    const sortedCompanies = [...companies].sort((a, b) => b.current_power_mw - a.current_power_mw);
    
    // Top 1 and Top 5 concentration
    const top1Load = sortedCompanies[0]?.current_power_mw || 0;
    const top5Load = sortedCompanies.slice(0, 5).reduce((sum, c) => sum + c.current_power_mw, 0);
    const top1Concentration = (top1Load / totalLoad) * 100;
    const top5Concentration = (top5Load / totalLoad) * 100;

    // Monthly Maximum Demand (simulated - using current peak)
    const monthlyMaxDemand = Math.max(...historicalData.map(d => d.total_power_mw));

    // Load Factor calculation (average / peak)
    const avgLoad = historicalData.length > 0 
      ? historicalData.reduce((sum, d) => sum + d.total_power_mw, 0) / historicalData.length
      : totalLoad;
    const loadFactor = (avgLoad / monthlyMaxDemand) * 100;

    // Coincidence Indicator (simplified - check if peak is during 10:00-16:00)
    const currentHour = new Date().getHours();
    const isPeakWindow = currentHour >= 10 && currentHour <= 16;
    const coincidenceLevel = isPeakWindow ? 'High' : currentHour >= 8 && currentHour <= 18 ? 'Medium' : 'Low';

    // Month-over-Month Growth (simulated)
    const monthOverMonthGrowth = 2.3; // Realistic 2-3% growth

    // Concentration Index (Herfindahl-style simplified)
    const concentrationIndex = companies.reduce((sum, c) => {
      const share = (c.current_power_mw / totalLoad) * 100;
      return sum + (share * share);
    }, 0) / 100; // Normalized

    // Diversity Factor (simplified)
    const diversityFactor = companies.length > 0 ? 1 / concentrationIndex : 1;

    // Coincidence Factor (simplified - based on peak overlap)
    const coincidenceFactor = top5Concentration > 60 ? 0.85 : top5Concentration > 40 ? 0.70 : 0.55;

    // Base Load (minimum load from historical data)
    const baseLoad = historicalData.length > 0 
      ? Math.min(...historicalData.map(d => d.total_power_mw))
      : totalLoad * 0.85;

    // Idle Load Ratio
    const idleLoadRatio = ((baseLoad / avgLoad) * 100);

    // Load Factor Trend
    const recentAvg = historicalData.slice(-10).reduce((sum, d) => sum + d.total_power_mw, 0) / Math.min(10, historicalData.length);
    const olderAvg = historicalData.slice(-20, -10).length > 0
      ? historicalData.slice(-20, -10).reduce((sum, d) => sum + d.total_power_mw, 0) / historicalData.slice(-20, -10).length
      : recentAvg;
    const loadFactorTrend = recentAvg > olderAvg * 1.02 ? 'improving' : recentAvg < olderAvg * 0.98 ? 'declining' : 'stable';

    return {
      totalLoad,
      monthlyMaxDemand,
      loadFactor,
      top1Concentration,
      top5Concentration,
      coincidenceLevel,
      monthOverMonthGrowth,
      concentrationIndex,
      diversityFactor,
      coincidenceFactor,
      baseLoad,
      idleLoadRatio,
      loadFactorTrend,
      top10Contributors: sortedCompanies.slice(0, 10),
      top1Company: sortedCompanies[0],
    };
  }, [currentStatus, historicalData]);

  // Generate 24-hour load curve data
  const loadCurve24H = useMemo(() => {
    const data = [];
    for (let hour = 0; hour < 24; hour++) {
      // Simulate realistic load curve with peak around 12:00-14:00
      const baseLoad = portMetrics?.baseLoad || 1000;
      const peakMultiplier = hour >= 10 && hour <= 16 ? 1.15 : hour >= 8 && hour <= 18 ? 1.05 : 0.95;
      const load = baseLoad * peakMultiplier * (0.95 + Math.random() * 0.1);
      
      data.push({
        hour: `${String(hour).padStart(2, '0')}:00`,
        load: Math.round(load),
        average: baseLoad * 1.05,
        baseline: baseLoad,
      });
    }
    return data;
  }, [portMetrics]);

  // Generate 7-day trend data
  const trend7Days = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      day,
      peak: portMetrics?.monthlyMaxDemand ? portMetrics.monthlyMaxDemand * (0.92 + Math.random() * 0.08) : 1200,
      average: portMetrics?.totalLoad || 1150,
    }));
  }, [portMetrics]);

  // Generate monthly peak trend
  const monthlyPeakTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month) => ({
      month,
      peak: portMetrics?.monthlyMaxDemand ? portMetrics.monthlyMaxDemand * (0.90 + Math.random() * 0.15) : 1200,
    }));
  }, [portMetrics]);

  // Growth modeling state
  const [growthRate, setGrowthRate] = useState(4.5);

  // Calculate 2030 projection
  const projection2030 = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsTo2030 = 2030 - currentYear;
    const currentPeak = portMetrics?.monthlyMaxDemand || 1200;
    const projectedPeak = currentPeak * Math.pow(1 + growthRate / 100, yearsTo2030);
    const capacityMargin = projectedPeak * 0.15; // 15% reserve margin
    return {
      projectedPeak: projectedPeak,
      capacityMargin,
    };
  }, [growthRate, portMetrics]);

  // Scenario simulation state
  const [topTenantChange, setTopTenantChange] = useState(0);

  // Calculate scenario impact
  const scenarioImpact = useMemo(() => {
    if (!portMetrics?.top1Company) return null;
    const currentTop1Load = portMetrics.top1Company.current_power_mw;
    const newTop1Load = currentTop1Load * (1 + topTenantChange / 100);
    const changeInLoad = newTop1Load - currentTop1Load;
    const newTotalPeak = (portMetrics.monthlyMaxDemand || 1200) + changeInLoad;
    return {
      newTotalPeak,
      changeInLoad,
    };
  }, [topTenantChange, portMetrics]);

  if (!currentStatus || !portMetrics) {
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
        className="max-w-[1600px] mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Building2 className="text-primary" size={36} />
              <span>
                Port Level Dashboard
                <span className="text-2xl text-gray-400 block mt-1">لوحة تحكم مستوى الميناء</span>
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Sohar Smart Port – Load Governance & Energy Intelligence Platform
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Entire port ecosystem (approx. 1200 MW current load) • Electricity supplied by Nama
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-dark-secondary px-4 py-2 rounded-lg border border-primary/20">
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-success animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-sm text-gray-300">
                {isRunning ? 'Live' : 'Paused'}
              </span>
            </div>
          </div>
        </div>

        {/* 1️⃣ Executive Overview Section */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-primary" size={24} />
            <h2 className="text-2xl font-bold text-white">
              Executive Overview
              <span className="text-lg text-gray-400 block">نظرة تنفيذية</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {/* Current Total Load */}
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-primary" size={18} />
                <span className="text-gray-400 text-xs">Current Total Load</span>
                <Info className="text-gray-500" size={14} />
              </div>
              <p className="text-2xl font-bold text-white">{formatPower(portMetrics.totalLoad)}</p>
              <p className="text-xs text-gray-500 mt-1">Real-time port consumption</p>
            </div>

            {/* Monthly Maximum Demand */}
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-warning" size={18} />
                <span className="text-gray-400 text-xs">Monthly Max Demand</span>
                <Info className="text-gray-500" size={14} />
              </div>
              <p className="text-2xl font-bold text-white">{formatPower(portMetrics.monthlyMaxDemand)}</p>
              <p className="text-xs text-gray-500 mt-1">Highest peak this month</p>
            </div>

            {/* Port Load Factor */}
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="text-success" size={18} />
                <span className="text-gray-400 text-xs">Port Load Factor</span>
                <Info className="text-gray-500" size={14} />
              </div>
              <p className="text-2xl font-bold text-white">{portMetrics.loadFactor.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Average / Peak ratio</p>
            </div>

            {/* Top 1 Concentration */}
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="text-danger" size={18} />
                <span className="text-gray-400 text-xs">Top 1 Concentration</span>
                <Info className="text-gray-500" size={14} />
              </div>
              <p className="text-2xl font-bold text-white">{portMetrics.top1Concentration.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">% of peak</p>
            </div>

            {/* Top 5 Concentration */}
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="text-primary" size={18} />
                <span className="text-gray-400 text-xs">Top 5 Concentration</span>
                <Info className="text-gray-500" size={14} />
              </div>
              <p className="text-2xl font-bold text-white">{portMetrics.top5Concentration.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">% of peak</p>
            </div>

            {/* Coincidence Indicator */}
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="text-warning" size={18} />
                <span className="text-gray-400 text-xs">Coincidence</span>
                <Info className="text-gray-500" size={14} />
              </div>
              <p className="text-2xl font-bold text-white">{portMetrics.coincidenceLevel}</p>
              <p className="text-xs text-gray-500 mt-1">Peak overlap indicator</p>
            </div>

            {/* Month-over-Month Growth */}
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                {portMetrics.monthOverMonthGrowth > 0 ? (
                  <ArrowUpRight className="text-success" size={18} />
                ) : (
                  <ArrowDownRight className="text-danger" size={18} />
                )}
                <span className="text-gray-400 text-xs">MoM Growth</span>
                <Info className="text-gray-500" size={14} />
              </div>
              <p className="text-2xl font-bold text-white">{portMetrics.monthOverMonthGrowth.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Load growth rate</p>
            </div>
          </div>
        </Card>

        {/* 2️⃣ Port Load Curve Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 24-Hour Port Load Curve */}
          <Card title="24-Hour Port Load Curve (MW)" subtitle="نموذج الحمل اليومي" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={loadCurve24H}>
                <defs>
                  <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} label={{ value: 'MW', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="load"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#loadGradient)"
                  name="Load (MW)"
                />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#10b981"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Average"
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="#6b7280"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                  name="Baseline"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Peak hour highlight</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-success"></div>
                <span>Average line</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-gray-500 border-dashed"></div>
                <span>Baseline band</span>
              </div>
            </div>
          </Card>

          {/* 7-Day Trend */}
          <Card title="7-Day Trend" subtitle="اتجاه أسبوعي">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trend7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} label={{ value: 'MW', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line type="monotone" dataKey="peak" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} name="Peak (MW)" />
                <Line type="monotone" dataKey="average" stroke="#10b981" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Average" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Monthly Peak Trend */}
        <Card title="Monthly Peak Trend" subtitle="اتجاه الذروة الشهرية">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyPeakTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '11px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} label={{ value: 'MW', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line type="monotone" dataKey="peak" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} name="Peak (MW)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* 3️⃣ Peak Contribution Analysis */}
        <Card title="Peak Contribution Analysis" subtitle="تحليل مساهمة الذروة">
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-4">
              Maximum Demand impacts transmission and load-related charges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 10 Contributors */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Top 10 Contributors to Current Maximum Demand</h3>
              <div className="space-y-2">
                {portMetrics.top10Contributors.map((company, index) => {
                  const contribution = (company.current_power_mw / portMetrics.monthlyMaxDemand) * 100;
                  return (
                    <div key={company.meter_id} className="flex items-center gap-3 bg-dark-secondary/50 rounded-lg p-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{company.company_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${Math.min(contribution, 100)}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-xs">{contribution.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{formatPower(company.current_power_mw)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sensitivity Analysis */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Sensitivity Analysis</h3>
              <div className="bg-dark-secondary/50 rounded-lg p-4 mb-4">
                <p className="text-gray-400 text-sm mb-2">If Top 1 reduces peak by 3%:</p>
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                  <p className="text-gray-400 text-sm">Current Port Peak</p>
                  <p className="text-2xl font-bold text-white mb-2">{formatPower(portMetrics.monthlyMaxDemand)}</p>
                  <p className="text-gray-400 text-sm">New Estimated Port Peak</p>
                  <p className="text-2xl font-bold text-success">
                    {formatPower(portMetrics.monthlyMaxDemand * 0.97)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Reduction: {formatPower(portMetrics.monthlyMaxDemand * 0.03)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 4️⃣ Load Concentration & Risk Panel */}
        <Card title="Load Concentration & Risk Panel" subtitle="لوحة التركيز والمخاطر">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metrics */}
            <div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
                  <p className="text-gray-400 text-sm mb-2">Concentration Index</p>
                  <p className="text-2xl font-bold text-white">{portMetrics.concentrationIndex.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">Herfindahl-style metric</p>
                </div>
                <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
                  <p className="text-gray-400 text-sm mb-2">Dependence on Largest Tenant</p>
                  <p className="text-2xl font-bold text-white">{portMetrics.top1Concentration.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500 mt-1">Port peak dependency</p>
                </div>
              </div>
              
              <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
                <p className="text-gray-400 text-sm mb-2">Risk Level</p>
                <div className="flex items-center gap-2">
                  {portMetrics.top1Concentration > 50 ? (
                    <>
                      <AlertTriangle className="text-danger" size={20} />
                      <span className="text-danger text-xl font-bold">High</span>
                    </>
                  ) : portMetrics.top1Concentration > 30 ? (
                    <>
                      <AlertTriangle className="text-warning" size={20} />
                      <span className="text-warning text-xl font-bold">Medium</span>
                    </>
                  ) : (
                    <>
                      <Info className="text-success" size={20} />
                      <span className="text-success text-xl font-bold">Low</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Based on concentration and dependency metrics
                </p>
              </div>
            </div>

            {/* Scenario Simulation */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Scenario Simulation</h3>
              <div className="bg-dark-secondary/50 rounded-lg p-4">
                <label className="block text-gray-400 text-sm mb-3">
                  Increase/decrease top tenant load: {topTenantChange > 0 ? '+' : ''}{topTenantChange.toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  step="0.5"
                  value={topTenantChange}
                  onChange={(e) => setTopTenantChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  <span>-15%</span>
                  <span>0%</span>
                  <span>+15%</span>
                </div>
                
                {scenarioImpact && (
                  <div className="mt-4 bg-primary/10 rounded-lg p-4 border border-primary/20">
                    <p className="text-gray-400 text-sm mb-2">Effect on Total Peak:</p>
                    <p className="text-2xl font-bold text-white">
                      {formatPower(scenarioImpact.newTotalPeak)}
                    </p>
                    <p className={`text-sm mt-2 ${scenarioImpact.changeInLoad > 0 ? 'text-danger' : 'text-success'}`}>
                      {scenarioImpact.changeInLoad > 0 ? '+' : ''}{formatPower(scenarioImpact.changeInLoad)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* 5️⃣ Coincidence & Diversity Analysis */}
        <Card title="Coincidence & Diversity Analysis" subtitle="تحليل التزامن والتنوع">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <p className="text-gray-400 text-sm mb-2">Diversity Factor</p>
              <p className="text-3xl font-bold text-white">{portMetrics.diversityFactor.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">Higher = more diverse load distribution</p>
            </div>
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <p className="text-gray-400 text-sm mb-2">Coincidence Factor</p>
              <p className="text-3xl font-bold text-white">{portMetrics.coincidenceFactor.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">Peak overlap between top 5 tenants</p>
            </div>
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <p className="text-gray-400 text-sm mb-2">Peak Overlap</p>
              <p className="text-lg font-bold text-white mb-2">
                {portMetrics.coincidenceLevel}
              </p>
              <p className="text-xs text-gray-500">
                High coincidence increases system stress even within fixed tariff peak window.
              </p>
            </div>
          </div>
        </Card>

        {/* 6️⃣ Idle Load & Efficiency Overview */}
        <Card title="Idle Load & Efficiency Overview (Aggregated)" subtitle="نظرة عامة على الحمل الخامل والكفاءة">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <p className="text-gray-400 text-sm mb-2">Estimated Port Base Load</p>
              <p className="text-3xl font-bold text-white">{formatPower(portMetrics.baseLoad)}</p>
              <p className="text-xs text-gray-500 mt-2">Minimum steady-state load</p>
            </div>
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <p className="text-gray-400 text-sm mb-2">Idle Load Ratio</p>
              <p className="text-3xl font-bold text-white">{portMetrics.idleLoadRatio.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-2">% of average load</p>
            </div>
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <p className="text-gray-400 text-sm mb-2">Load Factor Trend</p>
              <div className="flex items-center gap-2 mt-2">
                {portMetrics.loadFactorTrend === 'improving' ? (
                  <>
                    <ArrowUpRight className="text-success" size={24} />
                    <span className="text-success text-xl font-bold">Improving</span>
                  </>
                ) : portMetrics.loadFactorTrend === 'declining' ? (
                  <>
                    <ArrowDownRight className="text-danger" size={24} />
                    <span className="text-danger text-xl font-bold">Declining</span>
                  </>
                ) : (
                  <>
                    <Minus className="text-gray-400" size={24} />
                    <span className="text-gray-400 text-xl font-bold">Stable</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* 7️⃣ 2030 Growth Modeling Section */}
        <Card title="2030 Growth Modeling Section" subtitle="نموذج النمو لعام 2030">
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-4">
              This supports planning, not grid control.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm mb-3">
                Annual growth rate: {growthRate.toFixed(1)}%
              </label>
              <input
                type="range"
                min="2"
                max="8"
                step="0.1"
                value={growthRate}
                onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                <span>2%</span>
                <span>5%</span>
                <span>8%</span>
          </div>
        </div>

            <div className="bg-primary/10 rounded-lg p-6 border border-primary/20">
              <p className="text-gray-400 text-sm mb-2">Projected Peak for 2030</p>
              <p className="text-3xl font-bold text-white mb-4">
                {formatPower(projection2030.projectedPeak)}
              </p>
              <p className="text-gray-400 text-sm mb-2">Required Capacity Margin Estimate</p>
              <p className="text-2xl font-bold text-warning">
                {formatPower(projection2030.capacityMargin)}
              </p>
              <p className="text-xs text-gray-500 mt-2">15% reserve margin (engineering standard)</p>
            </div>
          </div>
        </Card>

        {/* 8️⃣ Sustainability Snapshot */}
        <Card title="Sustainability Snapshot" subtitle="لقطة الاستدامة">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="text-success" size={20} />
                <p className="text-gray-400 text-sm">Energy Intensity Trend</p>
              </div>
              <p className="text-2xl font-bold text-white mb-2">Normalized</p>
              <p className="text-xs text-gray-500">Improving efficiency metrics</p>
            </div>
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="text-primary" size={20} />
                <p className="text-gray-400 text-sm">Estimated Efficiency Improvement Potential</p>
              </div>
              <p className="text-2xl font-bold text-success">3-7%</p>
              <p className="text-xs text-gray-500 mt-2">Realistic optimization range</p>
            </div>
            <div className="bg-dark-secondary/50 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="text-warning" size={20} />
                <p className="text-gray-400 text-sm">ESG Readiness Indicator</p>
              </div>
              <p className="text-2xl font-bold text-white mb-2">High</p>
              <p className="text-xs text-gray-500">Port-level sustainability readiness</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
