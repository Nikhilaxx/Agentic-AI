import React from 'react';
import { AgentStatus } from './AgentStatus';
import { AlertsPanel } from './AlertsPanel';
import { ZoneDashboard } from './ZoneDashboard';
import { ControlPanel } from './ControlPanel';
import { Person, Zone, StampedeAlert, StampedeCondition } from '../types';

interface DashboardProps {
  people: Person[];
  zones: Zone[];
  alerts: StampedeAlert[];
  isRunning: boolean;
  isAgentActive: boolean;
  checkInterval: number;
  lastCheckTime: Date | null;
  stampedeCondition: StampedeCondition | null;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onCreateStampede: (condition: StampedeCondition) => void;
  onToggleAgent: () => void;
  onIntervalChange: (interval: number) => void;
}

export function Dashboard({
  people,
  zones,
  alerts,
  isRunning,
  isAgentActive,
  checkInterval,
  lastCheckTime,
  stampedeCondition,
  onStart,
  onStop,
  onReset,
  onCreateStampede,
  onToggleAgent,
  onIntervalChange,
}: DashboardProps) {
  return (
    <div className="w-96 h-full bg-gray-50 p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Stadium Crowd Simulation
      </h1>
      
      <ControlPanel
        isRunning={isRunning}
        onStart={onStart}
        onStop={onStop}
        onReset={onReset}
        onCreateStampede={onCreateStampede}
        stampedeCondition={stampedeCondition}
      />
      
      <AgentStatus
        isAgentActive={isAgentActive}
        checkInterval={checkInterval}
        lastCheckTime={lastCheckTime}
        onToggleAgent={onToggleAgent}
        onIntervalChange={onIntervalChange}
      />
      
      <div className="mb-6">
        <AlertsPanel alerts={alerts} zones={zones} />
      </div>
      
      <ZoneDashboard zones={zones} people={people} />
    </div>
  );
}