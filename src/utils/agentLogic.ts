// src/utils/agentLogic.ts
import { Zone, StampedeAlert, Person } from '../types';

const SAFETY_THRESHOLD = 0.3; // 30% of zone capacity considered safe

interface PredictionResponse {
  is_stampede: boolean;
  prediction?: number;
  safe_zones?: number[];
}

/**
 * Enhanced stampede prediction with safe zone suggestions
 */
export async function predictStampede(zones: Zone[], allZones: Zone[]): Promise<StampedeAlert[]> {
  const alerts: StampedeAlert[] = [];

  for (const zone of zones) {
    try {
      const payload = {
        zone_id: zone.id,
        density: zone.density,
        average_speed: zone.averageSpeed,
        people_count: zone.peopleCount,
        is_entry_exit: zone.isEntryExit,
        adjacent_zones: getAdjacentZones(zone.id, allZones).map(z => z.id)
      };

      // Simulate model prediction (replace with actual API call)
      const result: PredictionResponse = await simulateModelPrediction(payload);

      if (result.is_stampede) {
        const safeZone = findSafestZone(zone.id, allZones);
        alerts.push({
          id: crypto.randomUUID(),
          zoneId: zone.id,
          zoneName: zone.name,
          severity: result.prediction ? getSeverity(result.prediction) : 'high',
          timestamp: new Date(),
          prediction: result.prediction ?? 0.9, // Default high risk if no prediction score
          suggestedSafeZone: safeZone?.id,
          suggestedSafeZoneName: safeZone?.name,
          redirectMessage: getRedirectMessage(zone, safeZone)
        });
      }
    } catch (err) {
      console.error(`Prediction error for zone ${zone.id}:`, err);
    }
  }

  return alerts;
}

/**
 * Find safest adjacent zone for redirection
 */
function findSafestZone(currentZoneId: number, allZones: Zone[]): Zone | undefined {
  const currentZone = allZones.find(z => z.id === currentZoneId);
  if (!currentZone) return undefined;

  // Prefer non-entry/exit zones to avoid congestion
  const safeZones = allZones
    .filter(zone => 
      zone.id !== currentZoneId &&
      !zone.isStampedeZone &&
      (zone.peopleCount / (zone.width * zone.height)) < SAFETY_THRESHOLD
    )
    .sort((a, b) => a.density - b.density);

  return safeZones[0];
}

/**
 * Generate human-readable redirect message
 */
function getRedirectMessage(dangerZone: Zone, safeZone?: Zone): string {
  if (!safeZone) return `Evacuate ${dangerZone.name} immediately!`;
  
  const directions = getDirection(dangerZone, safeZone);
  return `Move ${directions} to ${safeZone.name} (${Math.round((1 - safeZone.density) * 100)}% capacity available)`;
}

/**
 * Get relative direction between zones
 */
function getDirection(from: Zone, to: Zone): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'east' : 'west';
  } else {
    return dy > 0 ? 'south' : 'north';
  }
}

/**
 * Get zones physically adjacent to the current zone
 */
function getAdjacentZones(zoneId: number, allZones: Zone[]): Zone[] {
  // Simplified adjacency - implement proper spatial checks based on your layout
  const adjacencyMap: Record<number, number[]> = {
    1: [2, 3, 4],  // North State connected to Central, East, West
    2: [1, 3, 4, 5, 6], // Central Field connected to most zones
    3: [1, 2, 5],   // East Stand
    4: [1, 2, 5],   // West Stand
    5: [2, 3, 4, 6], // South Stand
    6: [2, 5]       // VIP Area
  };

  return (adjacencyMap[zoneId] || [])
    .map(id => allZones.find(z => z.id === id))
    .filter(Boolean) as Zone[];
}

function getSeverity(prediction: number): 'low' | 'medium' | 'high' {
  if (prediction < 0.4) return 'low';
  if (prediction < 0.7) return 'medium';
  return 'high';
}

/**
 * Mock model prediction - replace with actual API call
 */
async function simulateModelPrediction(payload: any): Promise<PredictionResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Simple heuristic: high density + speed indicates danger
  const isDanger = payload.density > 0.6 && payload.average_speed > 0.005;
  
  return {
    is_stampede: isDanger,
    prediction: isDanger ? 0.8 + Math.random() * 0.2 : 0.1 + Math.random() * 0.3,
    safe_zones: isDanger ? [5, 6] : undefined // Suggest South Stand or VIP as safe
  };
}

/**
 * Calculate real-time zone statistics
 */
export function calculateZoneStats(people: Person[], zones: Zone[]): Zone[] {
  return zones.map(zone => {
    const zonePeople = people.filter(p => p.zoneId === zone.id);
    const stampeding = zonePeople.filter(p => p.isInStampede).length;
    
    return {
      ...zone,
      peopleCount: zonePeople.length,
      density: zonePeople.length / (zone.width * zone.height),
      averageSpeed: zonePeople.reduce((sum, p) => sum + p.speed, 0) / (zonePeople.length || 1),
      isStampedeZone: stampeding > zonePeople.length * 0.3 // >30% panicking
    };
  });
}