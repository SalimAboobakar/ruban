import { Brain, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';
import type { Prediction } from '../../types';
import { Card } from '../UI/Card';

interface PredictionsViewProps {
  predictions: Prediction[];
}

export function PredictionsView({ predictions }: PredictionsViewProps) {
  const getIcon = (type: Prediction['type']) => {
    switch (type) {
      case 'peak':
        return <TrendingUp size={16} className="text-primary" />;
      case 'anomaly':
        return <AlertCircle size={16} className="text-warning" />;
      case 'recommendation':
        return <Lightbulb size={16} className="text-success" />;
      default:
        return <Brain size={16} className="text-gray-400" />;
    }
  };

  const getTypeColor = (type: Prediction['type']) => {
    switch (type) {
      case 'peak':
        return 'border-l-primary';
      case 'anomaly':
        return 'border-l-warning';
      case 'recommendation':
        return 'border-l-success';
      default:
        return 'border-l-gray-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return 'text-success';
    if (confidence >= 0.75) return 'text-warning';
    return 'text-gray-400';
  };

  return (
    <Card title="AI Predictions & Insights" subtitle="Machine learning forecasts">
      <div className="space-y-2 max-h-[250px] overflow-y-auto">
        {predictions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Brain size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Analyzing data...</p>
            <p className="text-xs text-gray-600">Predictions will appear soon</p>
          </div>
        ) : (
          predictions.map((prediction) => (
            <div
              key={prediction.id}
              className={`border-l-4 ${getTypeColor(prediction.type)} bg-gray-800/50 p-3 rounded-r hover:bg-gray-800 transition-colors`}
            >
              <div className="flex items-start gap-2">
                {getIcon(prediction.type)}
                <div className="flex-1">
                  <p className="text-sm text-white">{prediction.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500 capitalize">
                      {prediction.type}
                    </span>
                    <span className={`text-xs font-semibold ${getConfidenceColor(prediction.confidence)}`}>
                      {(prediction.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

