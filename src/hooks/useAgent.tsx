import { useState, useEffect, useCallback } from 'react';
import { Zone, StampedeAlert, Person } from '../types';
import { predictStampede, calculateZoneStats } from '../utils/agentLogic';

export function useAgent(zones: Zone[], people: Person[], isSimulationRunning: boolean) {
  const [alerts, setAlerts] = useState<StampedeAlert[]>([]);
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [checkInterval, setCheckInterval] = useState(10); // seconds
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  
  const runAgentCheck = useCallback(async () => {
    if (!isSimulationRunning || people.length === 0) return;
    
    try {
      // Calculate current zone statistics
      const updatedZones = calculateZoneStats(people, zones);
      
      // Call prediction model (placeholder)
      const newAlerts = await predictStampede(updatedZones);
      
      // Add new alerts and keep recent ones
      setAlerts(currentAlerts => {
        const recentAlerts = currentAlerts.filter(
          alert => Date.now() - alert.timestamp.getTime() < 60000 // Keep alerts for 1 minute
        );
        return [...recentAlerts, ...newAlerts];
      });
      
      setLastCheckTime(new Date());
    } catch (error) {
      console.error('Agent check failed:', error);
    }
  }, [zones, people, isSimulationRunning]);
  
  // Start/stop agent
  const toggleAgent = useCallback(() => {
    setIsAgentActive(!isAgentActive);
  }, [isAgentActive]);
  
  // Agent interval effect
  useEffect(() => {
    if (!isAgentActive || !isSimulationRunning) return;
    
    const interval = setInterval(runAgentCheck, checkInterval * 1000);
    return () => clearInterval(interval);
  }, [isAgentActive, isSimulationRunning, checkInterval, runAgentCheck]);
  
  // Clear alerts when simulation stops
  useEffect(() => {
    if (!isSimulationRunning) {
      setAlerts([]);
      setIsAgentActive(false);
    }
  }, [isSimulationRunning]);
  
  return {
    alerts,
    isAgentActive,
    checkInterval,
    lastCheckTime,
    setCheckInterval,
    toggleAgent,
    runAgentCheck
  };
}