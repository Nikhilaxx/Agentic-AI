import React from 'react';
import { StadiumMap } from './components/StadiumMap';
import { Dashboard } from './components/Dashboard';
import { useSimulation } from './hooks/useSimulation';
import { useAgent } from './hooks/useAgent';

function App() {
  const {
    people,
    zones,
    isRunning,
    stampedeCondition,
    startSimulation,
    stopSimulation,
    resetSimulation,
    createStampede,
    updateZones
  } = useSimulation();

  const {
    alerts,
    isAgentActive,
    checkInterval,
    lastCheckTime,
    setCheckInterval,
    toggleAgent
  } = useAgent(zones, people, isRunning);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Panel - Stadium Map */}
      <div className="flex-1 p-6">
        <div className="h-full">
          <StadiumMap people={people} zones={zones} />
        </div>
      </div>
      
      {/* Right Panel - Dashboard */}
      <Dashboard
        people={people}
        zones={zones}
        alerts={alerts}
        isRunning={isRunning}
        isAgentActive={isAgentActive}
        checkInterval={checkInterval}
        lastCheckTime={lastCheckTime}
        stampedeCondition={stampedeCondition}
        onStart={startSimulation}
        onStop={stopSimulation}
        onReset={resetSimulation}
        onCreateStampede={createStampede}
        onToggleAgent={toggleAgent}
        onIntervalChange={setCheckInterval}
      />
    </div>
  );
}

export default App;