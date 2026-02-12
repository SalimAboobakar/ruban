import { useState, useEffect, useCallback } from 'react';
import type { PortStatus } from '../types';
import { generatePortStatus, generateHistoricalData } from '../data/namaApiSimulator';

interface UseRealTimeDataOptions {
  updateInterval?: number; // milliseconds
  autoStart?: boolean;
}

interface UseRealTimeDataReturn {
  currentStatus: PortStatus | null;
  historicalData: PortStatus[];
  isRunning: boolean;
  currentTime: Date;
  speedMultiplier: number;
  start: () => void;
  pause: () => void;
  setSpeed: (multiplier: number) => void;
  jumpTime: (hours: number) => void;
}

/**
 * Hook for consuming real-time simulated port data
 * Provides current status, historical data, and playback controls
 */
export function useRealTimeData(
  options: UseRealTimeDataOptions = {}
): UseRealTimeDataReturn {
  const {
    updateInterval = 5000, // 5 seconds default
    autoStart = true,
  } = options;

  const [currentStatus, setCurrentStatus] = useState<PortStatus | null>(null);
  const [historicalData, setHistoricalData] = useState<PortStatus[]>([]);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [simulatedTime, setSimulatedTime] = useState(new Date());

  // Initialize with historical data
  useEffect(() => {
    const initialHistory = generateHistoricalData(24, 30);
    setHistoricalData(initialHistory);
    
    // Set current status
    const initialStatus = generatePortStatus(simulatedTime);
    setCurrentStatus(initialStatus);
  }, []);

  // Update current status at interval
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Advance simulated time based on speed
      const timeIncrement = (updateInterval / 1000) * speedMultiplier; // seconds
      const newTime = new Date(simulatedTime.getTime() + timeIncrement * 1000);
      setSimulatedTime(newTime);

      // Generate new status
      const newStatus = generatePortStatus(newTime);
      setCurrentStatus(newStatus);

      // Add to historical data (keep last 50 points)
      setHistoricalData((prev) => {
        const updated = [...prev, newStatus];
        return updated.slice(-50);
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [isRunning, updateInterval, speedMultiplier, simulatedTime]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const setSpeed = useCallback((multiplier: number) => {
    setSpeedMultiplier(multiplier);
  }, []);

  const jumpTime = useCallback((hours: number) => {
    const newTime = new Date(simulatedTime.getTime() + hours * 60 * 60 * 1000);
    setSimulatedTime(newTime);
    
    // Generate new data for the jumped time
    const newStatus = generatePortStatus(newTime);
    setCurrentStatus(newStatus);
    
    // Regenerate historical data
    const newHistory = generateHistoricalData(24, 30);
    setHistoricalData(newHistory);
  }, [simulatedTime]);

  return {
    currentStatus,
    historicalData,
    isRunning,
    currentTime: simulatedTime,
    speedMultiplier,
    start,
    pause,
    setSpeed,
    jumpTime,
  };
}

