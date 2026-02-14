import type { EquipmentStatus } from '../types';

// Status color definitions based on load percentage
// Engineering standards: Normal 0-75%, Warning 75-90%, Critical 90-100%+
export const STATUS_COLORS = {
  normal: '#10b981',   // Green (0-75% - safe operating range)
  medium: '#f59e0b',   // Yellow/Orange (75-90% - requires monitoring)
  high: '#ef4444',     // Red (90-100%+ - critical/overload risk)
  idle: '#6b7280',     // Gray (0% or offline)
} as const;

/**
 * Get status based on current load vs base load
 * @param currentMW - Current power consumption in MW
 * @param baseMW - Base/normal power consumption in MW
 * @returns Equipment status
 * 
 * Engineering standards:
 * - Normal: 0-75% (Safe operating range)
 * - Medium: 75-90% (Requires monitoring, approaching limits)
 * - High: 90%+ (Critical - overload risk, immediate action required)
 */
export function getStatus(currentMW: number, baseMW: number): EquipmentStatus {
  if (currentMW <= 0.01) return 'idle';
  
  const loadPercentage = (currentMW / baseMW) * 100;
  
  if (loadPercentage >= 90) return 'high';     // Critical/overload
  if (loadPercentage >= 75) return 'medium';   // Warning
  return 'normal';                              // Safe
}

/**
 * Get color for a given status
 * @param status - Equipment status
 * @returns Hex color code
 */
export function getStatusColor(status: EquipmentStatus): string {
  return STATUS_COLORS[status];
}

/**
 * Get status from utilization percentage directly
 * @param percentage - Utilization percentage (0-100)
 * @returns Equipment status
 */
export function getStatusFromPercentage(percentage: number): EquipmentStatus {
  if (percentage <= 0) return 'idle';
  if (percentage >= 90) return 'high';     // Critical
  if (percentage >= 75) return 'medium';   // Warning
  return 'normal';                          // Safe
}

