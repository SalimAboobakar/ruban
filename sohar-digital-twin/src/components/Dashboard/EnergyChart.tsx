import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { PortStatus } from '../../types';
import { Card } from '../UI/Card';
import { format } from 'date-fns';

interface EnergyChartProps {
  historicalData: PortStatus[];
}

export function EnergyChart({ historicalData }: EnergyChartProps) {
  // Prepare line chart data (power over time)
  const lineChartData = historicalData.slice(-20).map((status) => ({
    time: format(new Date(status.timestamp), 'HH:mm'),
    power: status.total_power_mw,
    capacity: status.capacity_mw,
    utilization: status.utilization_percent,
  }));

  // Prepare bar chart data (top companies)
  const getTopCompanies = () => {
    if (historicalData.length === 0) return [];
    
    const latest = historicalData[historicalData.length - 1];
    return latest.companies
      .sort((a, b) => b.current_power_mw - a.current_power_mw)
      .slice(0, 10)
      .map((company) => ({
        name: company.company_name.split(' ').slice(0, 2).join(' '), // Shorten name
        power: company.current_power_mw,
        status: company.status,
      }));
  };

  const barChartData = getTopCompanies();

  return (
    <div className="grid grid-cols-2 gap-4 px-6 py-4">
      {/* Line Chart: Power Over Time */}
      <Card title="Power Consumption Trend" subtitle="Last 10 hours">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
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
            <Legend 
              wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}
            />
            <Line
              type="monotone"
              dataKey="power"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={false}
              name="Power (MW)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Bar Chart: Top Companies */}
      <Card title="Top 10 Energy Consumers" subtitle="Current consumption">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              style={{ fontSize: '10px' }}
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
            <Bar 
              dataKey="power" 
              fill="#0ea5e9"
              name="Power (MW)"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

