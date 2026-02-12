import { format } from 'date-fns';

/**
 * Format power value with unit
 * @param mw - Power in megawatts
 * @returns Formatted string (e.g., "145.5 MW")
 */
export function formatPower(mw: number): string {
  return `${mw.toFixed(1)} MW`;
}

/**
 * Format percentage
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places
 * @returns Formatted string (e.g., "85.5%")
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format currency
 * @param value - Dollar amount
 * @returns Formatted string (e.g., "$12,345.67")
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format timestamp
 * @param date - Date to format
 * @param formatStr - Format string (default: "HH:mm:ss")
 * @returns Formatted time string
 */
export function formatTime(date: Date | string, formatStr: string = 'HH:mm:ss'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format date and time
 * @param date - Date to format
 * @returns Formatted date-time string
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm:ss');
}

/**
 * Format large numbers with abbreviation
 * @param value - Number to format
 * @returns Formatted string (e.g., "1.2K", "3.4M")
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}

