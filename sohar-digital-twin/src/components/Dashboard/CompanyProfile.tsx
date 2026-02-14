import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CompanyEnergyProfile } from '../../types';
import { Card } from '../UI/Card';
import { EnergyHealthScore } from '../UI/EnergyHealthScore';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '../UI/Badge';

interface CompanyProfileProps {
  profile: CompanyEnergyProfile;
  onBack: () => void;
}

export function CompanyProfile({ profile, onBack }: CompanyProfileProps) {
  // Prepare 24h load curve data
  const loadCurveData = profile.loadProfile24H.map(item => ({
    hour: `${String(item.hour).padStart(2, '0')}:00`,
    weekday: item.weekday_mw,
    weekend: item.weekend_mw,
  }));

  // Prepare monthly peak trend data
  const monthlyPeakData = profile.monthlyPeakTrend;

  // Prepare load distribution histogram data
  const loadDistributionData = profile.loadDistributionHistogram;

  const getGrowthTrendIcon = () => {
    switch (profile.growthTrend) {
      case 'Increasing':
        return <TrendingUp className="text-[#10b981]" size={16} />;
      case 'Decreasing':
        return <TrendingDown className="text-[#ef4444]" size={16} />;
      default:
        return <Minus className="text-gray-400" size={16} />;
    }
  };

  const getEnergyIntensityIcon = () => {
    switch (profile.energyIntensityTrend) {
      case 'Improving':
        return <TrendingDown className="text-[#10b981]" size={16} />;
      case 'Worsening':
        return <TrendingUp className="text-[#ef4444]" size={16} />;
      default:
        return <Minus className="text-gray-400" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Companies
          </button>
        </div>

        {/* Executive Summary */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{profile.companyName}</h1>
              <p className="text-gray-400">{profile.sector}</p>
            </div>
            <EnergyHealthScore score={profile.energyHealthScore} size="lg" />
          </div>
          <p className="text-gray-300 leading-relaxed">{profile.executiveSummary}</p>
        </Card>

        {/* Basic Info Section */}
        <Card title="Basic Information">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Connected Voltage</p>
              <p className="text-white font-semibold">{profile.connectedVoltageLevel}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Average Load</p>
              <p className="text-white font-semibold">{profile.averageLoadMW.toFixed(1)} MW</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Peak Load</p>
              <p className="text-white font-semibold">{profile.peakLoadMW.toFixed(1)} MW</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Load Share of Port</p>
              <p className="text-white font-semibold">{profile.loadShareOfPort.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Growth Trend</p>
              <div className="flex items-center gap-2">
                {getGrowthTrendIcon()}
                <span className="text-white font-semibold">{profile.growthTrend}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Base Load</p>
              <p className="text-white font-semibold">{profile.baseLoadMW.toFixed(1)} MW</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Load Factor</p>
              <p className="text-white font-semibold">{profile.loadFactor.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Peak-to-Average Ratio</p>
              <p className="text-white font-semibold">{profile.peakToAverageRatio.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 24h Load Curve */}
          <Card title="24-Hour Load Curve" subtitle="Weekday vs Weekend Pattern">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={loadCurveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#9ca3af"
                  style={{ fontSize: '11px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'MW', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}
                />
                <Line
                  type="monotone"
                  dataKey="weekday"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={false}
                  name="Weekday (MW)"
                />
                <Line
                  type="monotone"
                  dataKey="weekend"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Weekend (MW)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Monthly Peak Trend */}
          <Card title="Monthly Peak Trend" subtitle="Peak demand over 12 months">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPeakData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'MW', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="peak_mw"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 4 }}
                  name="Peak (MW)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Load Distribution Histogram */}
        <Card title="Load Distribution Histogram" subtitle="Frequency distribution of load levels">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={loadDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="range" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                label={{ value: 'Frequency (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar 
                dataKey="frequency" 
                fill="#8b5cf6"
                name="Frequency (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Maximum Demand Impact */}
        <Card title="Maximum Demand Impact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Highest MW This Month</p>
              <p className="text-2xl font-bold text-white">{profile.highestMWThisMonth.toFixed(1)} MW</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Peak Contribution Ranking</p>
              <p className="text-2xl font-bold text-white">#{profile.peakContributionRanking}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Impact of 3% Peak Reduction</p>
              <p className="text-2xl font-bold text-[#10b981]">{profile.estimatedImpactOf3PercentReduction.toFixed(1)} MW</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Coincidence with Tariff Peak</p>
              <div className="flex items-center gap-2 mt-2">
                {profile.coincidenceIndicator ? (
                  <>
                    <CheckCircle className="text-[#10b981]" size={20} />
                    <span className="text-white font-semibold">Yes - Peaks during tariff window</span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-gray-400" size={20} />
                    <span className="text-gray-400 font-semibold">No - Peaks outside tariff window</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Idle Load & Efficiency */}
        <Card title="Idle Load & Efficiency">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Idle Load Ratio</p>
              <p className="text-2xl font-bold text-white">{profile.idleLoadRatio.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Operational Stability Score</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-white">{profile.operationalStabilityScore}</p>
                <span className="text-gray-400">/100</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-400 text-sm mb-2">Night-time Consumption Pattern</p>
              <p className="text-gray-300">{profile.nightTimeConsumptionPattern}</p>
            </div>
          </div>
        </Card>

        {/* Optimization Opportunities */}
        <Card title="Optimization Opportunities">
          <div className="space-y-4">
            {profile.optimizationOpportunities.map((opp, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-white font-medium">{opp.description}</p>
                  <Badge variant={opp.implementationDifficulty === 'easy' ? 'normal' : opp.implementationDifficulty === 'medium' ? 'medium' : 'high'}>
                    {opp.implementationDifficulty}
                  </Badge>
                </div>
                <p className="text-[#10b981] text-sm font-semibold">
                  Expected Savings: {opp.expectedSavingsPercent.toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Risk & Planning Insight */}
        <Card title="Risk & Planning Insight">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Sensitivity (10% Load Increase)</p>
              <p className="text-2xl font-bold text-[#f59e0b]">+{profile.sensitivityIfLoadIncreases10Percent.toFixed(1)} MW</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Risk Level to Port Concentration</p>
              <Badge 
                variant={profile.riskLevelToPortConcentration === 'High' ? 'high' : profile.riskLevelToPortConcentration === 'Medium' ? 'medium' : 'normal'}
                className="mt-2"
              >
                {profile.riskLevelToPortConcentration}
              </Badge>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-400 text-sm mb-2">Growth Forecast to 2030</p>
              <p className="text-gray-300">{profile.growthForecastTo2030}</p>
            </div>
          </div>
        </Card>

        {/* Sustainability Layer */}
        <Card title="Sustainability Layer">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Energy Intensity Trend</p>
              <div className="flex items-center gap-2 mt-2">
                {getEnergyIntensityIcon()}
                <span className="text-white font-semibold">{profile.energyIntensityTrend}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Potential Carbon Reduction</p>
              <p className="text-2xl font-bold text-[#10b981]">{profile.potentialCarbonReductionViaDemandShaping.toLocaleString()}</p>
              <p className="text-gray-400 text-xs mt-1">tons CO₂/year</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">ESG Readiness Indicator</p>
              <Badge 
                variant={profile.esgReadinessIndicator === 'High' ? 'normal' : profile.esgReadinessIndicator === 'Medium' ? 'medium' : 'high'}
                className="mt-2"
              >
                {profile.esgReadinessIndicator}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

