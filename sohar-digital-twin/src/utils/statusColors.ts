import type { EquipmentStatus } from '../types';

// Status color definitions based on load percentage
export const STATUS_COLORS = {
  normal: '#10b981',   // Green (0-70%)
  medium: '#f59e0b',   // Yellow/Orange (70-85%)
  high: '#ef4444',     // Red (85-100%)
  idle: '#6b7280',     // Gray (0% or offline)
} as const;

/**
 * Get status based on current load vs base load
 * @param currentMW - Current power consumption in MW
 * @param baseMW - Base/normal power consumption in MW
 * @returns Equipment status
 */
export function getStatus(currentMW: number, baseMW: number): EquipmentStatus {
  if (currentMW <= 0.01) return 'idle';
  
  const loadPercentage = (currentMW / baseMW) * 100;
  
  if (loadPercentage >= 85) return 'high';
  if (loadPercentage >= 70) return 'medium';
  return 'normal';
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
  if (percentage >= 85) return 'high';
  if (percentage >= 70) return 'medium';
  return 'normal';
}

