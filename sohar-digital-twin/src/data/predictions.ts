import type { Prediction, PortStatus } from '../types';
import { COMPANIES } from './companies';

/**
 * Generate AI predictions based on current port status
 */
export function generatePredictions(portStatus: PortStatus): Prediction[] {
  const predictions: Prediction[] = [];
  const currentHour = new Date(portStatus.timestamp).getHours();

  // Prediction 1: Peak load forecast
  if (currentHour < 14) {
    const peakTime = 14;
    const predictedPeak = portStatus.total_power_mw * 1.15;
    predictions.push({
      id: 'pred-peak',
      type: 'peak',
      message: `Peak expected at ${peakTime}:00 - ${predictedPeak.toFixed(0)} MW`,
      confidence: 0.87,
      timestamp: portStatus.timestamp,
    });
  }

  // Prediction 2: High consumption anomaly detection
  const highConsumers = portStatus.companies.filter((c) => c.status === 'high');
  if (highConsumers.length > 0) {
    const company = highConsumers[0];
    const companyData = COMPANIES.find((c) => c.id === company.meter_id);
    if (companyData) {
      const percentAboveNormal = ((company.current_power_mw - companyData.base_load_mw) / companyData.base_load_mw) * 100;
      predictions.push({
        id: 'pred-anomaly',
        type: 'anomaly',
        message: `${company.company_name} consumption ${percentAboveNormal.toFixed(0)}% above normal`,
        confidence: 0.92,
        timestamp: portStatus.timestamp,
      });
    }
  }

  // Prediction 3: Capacity recommendation
  if (portStatus.utilization_percent > 80) {
    predictions.push({
      id: 'pred-capacity',
      type: 'recommendation',
      message: 'High utilization detected. Consider load balancing or capacity expansion.',
      confidence: 0.85,
      timestamp: portStatus.timestamp,
    });
  }

  // Prediction 4: Cost optimization
  if (currentHour >= 8 && currentHour <= 17) {
    const potentialSavings = Math.round(portStatus.cost_per_hour * 0.15);
    predictions.push({
      id: 'pred-cost',
      type: 'recommendation',
      message: `جدولة خارج الذروة يمكن أن توفر ~${potentialSavings} ر.ع/ساعة`,
      confidence: 0.78,
      timestamp: portStatus.timestamp,
    });
  }

  // Prediction 5: Equipment maintenance alert
  const mediumLoadEquipment = portStatus.companies.filter((c) => c.status === 'medium');
  if (mediumLoadEquipment.length >= 3) {
    predictions.push({
      id: 'pred-maintenance',
      type: 'recommendation',
      message: `${mediumLoadEquipment.length} companies at medium load. Schedule maintenance checks.`,
      confidence: 0.81,
      timestamp: portStatus.timestamp,
    });
  }

  // Prediction 6: Future load forecast (next 6 hours)
  const futureLoad = portStatus.total_power_mw * (currentHour < 14 ? 1.1 : 0.9);
  predictions.push({
    id: 'pred-future',
    type: 'peak',
    message: `Next 6h average: ${futureLoad.toFixed(0)} MW (${currentHour < 14 ? 'increasing' : 'decreasing'} trend)`,
    confidence: 0.83,
    timestamp: portStatus.timestamp,
  });

  return predictions;
}

