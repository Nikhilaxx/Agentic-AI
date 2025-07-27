import { useState, useCallback, useRef } from 'react';
import { Person, Zone, StampedeCondition } from '../types/index';
import { initializePeople, updatePersonPosition, ZONES } from '../utils/simulationEngine';

export function useSimulation() {
  const [people, setPeople] = useState<Person[]>([]);
  const [zones, setZones] = useState<Zone[]>(ZONES);
  const [isRunning, setIsRunning] = useState(false);
  const [stampedeCondition, setStampedeCondition] = useState<StampedeCondition | null>(null);
  const animationFrameRef = useRef<number>();
  
  const startSimulation = useCallback(() => {
    if (!isRunning) {
      const initialPeople = initializePeople(10000);
      setPeople(initialPeople);
      setIsRunning(true);
      
      const animate = () => {
        setPeople(currentPeople => 
          currentPeople.map(person => 
            updatePersonPosition(person, zones, stampedeCondition || undefined)
          )
        );
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      animate();
    }
  }, [isRunning, zones, stampedeCondition]);
  
  const stopSimulation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsRunning(false);
  }, []);
  
  const resetSimulation = useCallback(() => {
    stopSimulation();
    setPeople([]);
    setStampedeCondition(null);
    setZones(ZONES.map(zone => ({ ...zone, isStampedeZone: false, isSafeZone: true })));
  }, [stopSimulation]);
  
  const createStampede = useCallback((condition: StampedeCondition) => {
    setStampedeCondition(condition);
    
    // Mark the target zone as stampede zone
    setZones(currentZones => currentZones.map(zone => ({
      ...zone,
      isStampedeZone: zone.id === condition.targetZone,
      isSafeZone: zone.id !== condition.targetZone
    })));
  }, []);
  
  const updateZones = useCallback((newZones: Zone[]) => {
    setZones(newZones);
  }, []);
  
  return {
    people,
    zones,
    isRunning,
    stampedeCondition,
    startSimulation,
    stopSimulation,
    resetSimulation,
    createStampede,
    updateZones
  };
}