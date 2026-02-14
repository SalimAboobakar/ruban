import { Badge } from './Badge';
import type { EquipmentStatus } from '../../types';

interface EnergyHealthScoreProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
}

export function EnergyHealthScore({ score, size = 'md' }: EnergyHealthScoreProps) {
  const getScoreColor = (score: number): EquipmentStatus => {
    if (score >= 80) return 'normal'; // Maps to green/success
    if (score >= 60) return 'medium'; // Maps to yellow/warning
    return 'high'; // Maps to red/danger
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getScoreColor(score)} className={sizeClasses[size]}>
        {score}/100
      </Badge>
      <span className={`text-gray-300 ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`}>
        {getScoreLabel(score)}
      </span>
    </div>
  );
}

