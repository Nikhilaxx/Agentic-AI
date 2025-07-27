// src/utils/simulationEngine.ts
// Update the import path if the types are located elsewhere, e.g. '../types/index'
import { Person, Zone } from '../types/index';

// Define all 6 zones matching your UI layout
export const ZONES: Zone[] = [
  { 
    id: 1, 
    name: 'North State', 
    x: 150, y: 50, width: 300, height: 100,
    isEntryExit: true,
    isStampedeZone: false
  },
  { 
    id: 2, 
    name: 'Central Field', 
    x: 200, y: 160, width: 200, height: 100,
    isStampedeZone: false 
  },
  { 
    id: 3, 
    name: 'East Stand', 
    x: 50, y: 160, width: 140, height: 200,
    isStampedeZone: false 
  },
  { 
    id: 4, 
    name: 'West Stand', 
    x: 410, y: 160, width: 140, height: 200,
    isStampedeZone: false 
  },
  { 
    id: 5, 
    name: 'South Stand', 
    x: 150, y: 270, width: 300, height: 100,
    isStampedeZone: false 
  },
  { 
    id: 6, 
    name: 'VIP Area', 
    x: 250, y: 180, width: 100, height: 80,
    isStampedeZone: false 
  }
];

type StampedeType = 'exit_rush' | 'zone_incident';

interface StampedeCondition {
  type: StampedeType;
  targetZoneId: number;
  description: string;
}

export function initializePeople(count: number = 10000): Person[] {
  return Array.from({ length: count }, (_, i) => {
    // Distribute people randomly across zones
    const zone = ZONES[Math.floor(Math.random() * ZONES.length)];
    
    return {
      id: i.toString(),
      x: Math.random(), // 0-1 relative to zone width
      y: Math.random(), // 0-1 relative to zone height
      zoneId: zone.id,
      isInStampede: false,
      isPanicking: false,
      speed: 0.002 + Math.random() * 0.003, // Base movement speed
      direction: Math.random() * Math.PI * 2 // Random initial direction
    };
  });
}

export function simulateMovement(
  people: Person[],
  zones: Zone[],
  stampedeCondition?: StampedeCondition
): Person[] {
  return people.map(person => {
    const currentZone = zones.find(z => z.id === person.zoneId) || ZONES[0];
    
    // Handle normal movement
    if (!stampedeCondition || !person.isInStampede) {
      return normalMovement(person, currentZone);
    }
    
    // Handle stampede behavior
    return handleStampedeMovement(person, currentZone, stampedeCondition);
  });
}

function normalMovement(person: Person, zone: Zone): Person {
  // Random walk pattern with zone boundary checks
  let newX = person.x + Math.cos(person.direction) * person.speed;
  let newY = person.y + Math.sin(person.direction) * person.speed;
  
  // Change direction if hitting zone boundaries
  if (newX <= 0 || newX >= 1 || newY <= 0 || newY >= 1) {
    person.direction = Math.random() * Math.PI * 2;
    newX = clamp(newX, 0, 1);
    newY = clamp(newY, 0, 1);
  }
  
  // Occasionally change direction randomly
  if (Math.random() < 0.02) {
    person.direction += (Math.random() - 0.5) * Math.PI/4;
  }
  
  return {
    ...person,
    x: newX,
    y: newY,
    isInStampede: false,
    isPanicking: false
  };
}

function handleStampedeMovement(
  person: Person,
  currentZone: Zone,
  condition: StampedeCondition
): Person {
  if (condition.type === 'exit_rush') {
    // Rush towards nearest exit (North State zone)
    const exitZone = ZONES.find(z => z.isEntryExit)!;
    if (person.zoneId === exitZone.id) {
      // Already in exit zone - move randomly
      return {
        ...person,
        x: clamp(person.x + (Math.random() - 0.5) * 0.1, 0, 1),
        y: clamp(person.y + (Math.random() - 0.5) * 0.1, 0, 1),
        isPanicking: true
      };
    } else {
      // Move towards exit zone
      const targetX = 0.5; // Center of exit zone
      const targetY = 0.5;
      return moveTowardsTarget(person, targetX, targetY, 0.05, true);
    }
  } else {
    // Zone incident - chaotic movement within zone
    if (person.zoneId === condition.targetZoneId) {
      return {
        ...person,
        x: clamp(person.x + (Math.random() - 0.5) * 0.2, 0, 1),
        y: clamp(person.y + (Math.random() - 0.5) * 0.2, 0, 1),
        isPanicking: true
      };
    }
    // People in other zones move normally during zone incident
    return normalMovement(person, currentZone);
  }
}

function moveTowardsTarget(
  person: Person,
  targetX: number,
  targetY: number,
  speedMultiplier: number,
  isPanicking: boolean
): Person {
  const dx = targetX - person.x;
  const dy = targetY - person.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return {
    ...person,
    x: clamp(person.x + (dx / distance) * person.speed * speedMultiplier, 0, 1),
    y: clamp(person.y + (dy / distance) * person.speed * speedMultiplier, 0, 1),
    isPanicking
  };
}

export function triggerStampede(): StampedeCondition {
  const randomType: StampedeType = Math.random() > 0.5 ? 'exit_rush' : 'zone_incident';
  
  if (randomType === 'exit_rush') {
    return {
      type: 'exit_rush',
      targetZoneId: ZONES.find(z => z.isEntryExit)!.id,
      description: 'Panic! People rushing to exits'
    };
  } else {
    // Random zone incident (excluding exit zone)
    const nonExitZones = ZONES.filter(z => !z.isEntryExit);
    const randomZone = nonExitZones[Math.floor(Math.random() * nonExitZones.length)];
    
    return {
      type: 'zone_incident',
      targetZoneId: randomZone.id,
      description: `Incident in ${randomZone.name}!`
    };
  }
}

export function calculateZoneStats(people: Person[]): Zone[] {
  return ZONES.map(zone => {
    const zonePeople = people.filter(p => p.zoneId === zone.id);
    const stampedingCount = zonePeople.filter(p => p.isInStampede).length;
    
    return {
      ...zone,
      peopleCount: zonePeople.length,
      density: zonePeople.length / (zone.width * zone.height),
      isStampedeZone: stampedingCount > zonePeople.length * 0.3, // 30% threshold
      averageSpeed: zonePeople.reduce((sum, p) => sum + p.speed, 0) / (zonePeople.length || 1)
    };
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}