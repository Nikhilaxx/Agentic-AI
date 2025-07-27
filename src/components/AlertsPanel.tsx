import React from 'react';
import { AlertTriangle, Shield, Clock } from 'lucide-react';
import { StampedeAlert, Zone } from '../types';

interface AlertsPanelProps {
  alerts: StampedeAlert[];
  zones: Zone[];
}

export function AlertsPanel({ alerts, zones }: AlertsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 border-red-300';
      case 'medium': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'low': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getZoneName = (zoneId: number) => {
    return zones.find(z => z.id === zoneId)?.name || `Zone ${zoneId}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
        <AlertTriangle size={24} />
        <span>Stampede Alerts</span>
      </h2>
      
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Shield size={48} className="mx-auto mb-3 opacity-50" />
          <p>No active alerts</p>
          <p className="text-sm">All zones are currently safe</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-2 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-bold text-lg">{alert.zoneName}</div>
                  <div className="text-sm opacity-75 flex items-center space-x-1 mt-1">
                    <Clock size={14} />
                    <span>{alert.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm">
                      Prediction Score: <span className="font-mono">{(alert.prediction * 100).toFixed(1)}%</span>
                    </div>
                    <div className="text-sm">
                      Severity: <span className="font-bold uppercase">{alert.severity}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <AlertTriangle size={24} />
                </div>
              </div>
              
              {alert.suggestedSafeZone && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                  <div className="text-sm text-green-800">
                    <strong>Suggested Safe Zone:</strong> {getZoneName(alert.suggestedSafeZone)}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Redirect people from Zone {alert.zoneId} to Zone {alert.suggestedSafeZone}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}