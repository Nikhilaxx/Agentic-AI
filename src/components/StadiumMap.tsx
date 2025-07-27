import React from 'react';
import { motion } from 'framer-motion';
import { Person, Zone } from '../types';

interface StadiumMapProps {
  people: Person[];
  zones: Zone[];
}

export function StadiumMap({ people, zones }: StadiumMapProps) {
  // Define the stadium layout with 6 distinct zones
  const zoneLayout = [
    { id: 1, name: 'North State', x: 150, y: 50, width: 300, height: 100, isEntryExit: true },
    { id: 2, name: 'Central Field', x: 200, y: 160, width: 200, height: 100 },
    { id: 3, name: 'East Stand', x: 50, y: 160, width: 140, height: 200 },
    { id: 4, name: 'West Stand', x: 410, y: 160, width: 140, height: 200 },
    { id: 5, name: 'South Stand', x: 150, y: 270, width: 300, height: 100 },
    { id: 6, name: 'VIP Area', x: 250, y: 180, width: 100, height: 80 }
  ];

  return (
    <div className="w-full h-full bg-gray-900 relative overflow-hidden rounded-lg">
      {/* Stadium Background with defined zones */}
      <svg width="100%" height="100%" viewBox="0 0 600 500" className="absolute inset-0">
        {/* Zone boundaries */}
        {zoneLayout.map(zone => {
          const isStampedeZone = zones.some(z => z.id === zone.id && z.isStampedeZone);
          return (
            <g key={zone.id}>
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                fill={isStampedeZone ? 'rgba(239, 68, 68, 0.3)' : 'rgba(74, 222, 128, 0.2)'}
                stroke={isStampedeZone ? '#ef4444' : '#22c55e'}
                strokeWidth="2"
                rx="8"
              />
              <text
                x={zone.x + zone.width / 2}
                y={zone.y + 20}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                {zone.name}
              </text>
              <text
                x={zone.x + zone.width / 2}
                y={zone.y + 35}
                textAnchor="middle"
                fill="white"
                fontSize="10"
              >
                Zone {zone.id} {zone.isEntryExit ? '(Entry/Exit)' : ''}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* People dots - now constrained to their zones */}
      <div className="absolute inset-0">
        {people.map((person) => {
          const personZone = zoneLayout.find(z => z.id === person.zoneId);
          if (!personZone) return null;

          // Calculate position relative to zone boundaries
          const xInZone = person.x * personZone.width;
          const yInZone = person.y * personZone.height;
          const absoluteX = personZone.x + xInZone;
          const absoluteY = personZone.y + yInZone;

          return (
            <motion.div
              key={person.id}
              className={`absolute w-2 h-2 rounded-full ${
                person.isInStampede ? 'bg-red-500' : 'bg-blue-400'
              } ${person.isPanicking ? 'animate-pulse' : ''}`}
              animate={{
                x: absoluteX,
                y: absoluteY,
              }}
              transition={{
                duration: 0.5,
                ease: "linear"
              }}
              style={{
                left: 0,
                top: 0,
                transform: `translate(${absoluteX}px, ${absoluteY}px)`
              }}
            />
          );
        })}
      </div>
      
      {/* Zone statistics overlay */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 p-3 rounded-lg text-white text-sm backdrop-blur-sm">
        <div className="font-bold mb-2 border-b border-gray-600 pb-1">Live Stats</div>
        <div>Total People: {people.length.toLocaleString()}</div>
        <div>Active Zones: {zones.filter(z => !z.isStampedeZone).length}/6</div>
        <div className="text-red-400">
          Stampede Zones: {zones.filter(z => z.isStampedeZone).length}
        </div>
      </div>
    </div>
  );
}