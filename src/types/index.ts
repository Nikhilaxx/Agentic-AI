export interface ZoneLayout {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isEntryExit?: boolean;
}

export interface ZoneStatus {
  id: number;
  isStampedeZone: boolean;
  // Add other runtime zone states here
  // e.g., crowdDensity?: number;
}

export interface Person {
  id: string;
  x: number; // 0-1 relative position
  y: number; // 0-1 relative position
  zoneId: number;
  isInStampede: boolean;
  isPanicking?: boolean;
  // Add movement vectors if needed:
  // dx?: number;
  // dy?: number;
}

// For the props
export interface StadiumMapProps {
  people: Person[];
  zones: ZoneStatus[];
}