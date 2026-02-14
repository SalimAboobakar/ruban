import type { ReactNode } from 'react';
import type { EquipmentStatus } from '../../types';
import { getStatusColor } from '../../utils/statusColors';

interface BadgeProps {
  children: ReactNode;
  variant?: EquipmentStatus | 'info' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const getColor = () => {
    if (variant === 'info') return '#0ea5e9';
    if (variant === 'default') return '#6b7280';
    return getStatusColor(variant);
  };

  const color = getColor();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
      style={{
        backgroundColor: color + '20',
        color: color,
        border: `1px solid ${color}`,
      }}
    >
      {children}
    </span>
  );
}

