import React from 'react';
import { Play, Square, RotateCcw, AlertTriangle } from 'lucide-react';
import { StampedeCondition } from '../types';
import { generateStampedeCondition } from '../utils/simulationEngine';

interface ControlPanelProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onCreateStampede: (condition: StampedeCondition) => void;
  stampedeCondition: StampedeCondition | null;
}

export function ControlPanel({ 
  isRunning, 
  onStart, 
  onStop, 
  onReset, 
  onCreateStampede,
  stampedeCondition 
}: ControlPanelProps) {
  const handleCreateStampede = () => {
    const condition = generateStampedeCondition();
    onCreateStampede(condition);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Simulation Controls</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={isRunning ? onStop : onStart}
          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            isRunning 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isRunning ? <Square size={20} /> : <Play size={20} />}
          <span>{isRunning ? 'Stop' : 'Start'} Simulation</span>
        </button>
        
        <button
          onClick={onReset}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>
        
        <button
          onClick={handleCreateStampede}
          disabled={!isRunning}
          className={`col-span-2 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            isRunning 
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <AlertTriangle size={20} />
          <span>Create Stampede</span>
        </button>
      </div>
      
      {stampedeCondition && (
        <div className="mt-4 p-3 bg-orange-100 border border-orange-300 rounded-lg">
          <div className="font-medium text-orange-800">Active Stampede Condition:</div>
          <div className="text-sm text-orange-700 mt-1">{stampedeCondition.description}</div>
          <div className="text-xs text-orange-600 mt-1">Target Zone: {stampedeCondition.targetZone}</div>
        </div>
      )}
    </div>
  );
}