import React from 'react';
import { Users, Activity, TrendingUp } from 'lucide-react';
import { Zone, Person } from '../types';
import { calculateZoneStats } from '../utils/agentLogic';

interface ZoneDashboardProps {
  zones: Zone[];
  people: Person[];
}

export function ZoneDashboard({ zones, people }: ZoneDashboardProps) {
  const zoneStats = calculateZoneStats(people, zones);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
        <Activity size={24} />
        <span>Zone Analytics</span>
      </h2>
      
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {zoneStats.map((zone) => (
          <div
            key={zone.id}
            className={`p-4 rounded-lg border-2 ${
              zone.isStampedeZone 
                ? 'border-red-300 bg-red-50' 
                : 'border-green-300 bg-green-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">{zone.name}</h3>
              <div className={`px-2 py-1 rounded text-xs font-bold ${
                zone.isStampedeZone 
                  ? 'bg-red-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                {zone.isStampedeZone ? 'DANGER' : 'SAFE'}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="flex items-center space-x-1">
                <Users size={16} className="text-blue-500" />
                <div>
                  <div className="font-medium">{zone.peopleCount}</div>
                  <div className="text-xs text-gray-500">People</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Activity size={16} className="text-purple-500" />
                <div>
                  <div className="font-medium">{(zone.density * 100).toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Density</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <TrendingUp size={16} className="text-orange-500" />
                <div>
                  <div className="font-medium">{zone.averageSpeed.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">Avg Speed</div>
                </div>
              </div>
            </div>
            
            {/* Density bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    zone.density > 0.8 ? 'bg-red-500' : 
                    zone.density > 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(zone.density * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}