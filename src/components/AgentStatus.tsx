import React from 'react';
import { Bot, Activity, Clock, Settings } from 'lucide-react';

interface AgentStatusProps {
  isAgentActive: boolean;
  checkInterval: number;
  lastCheckTime: Date | null;
  onToggleAgent: () => void;
  onIntervalChange: (interval: number) => void;
}

export function AgentStatus({ 
  isAgentActive, 
  checkInterval, 
  lastCheckTime, 
  onToggleAgent, 
  onIntervalChange 
}: AgentStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
        <Bot size={24} />
        <span>AI Agent Status</span>
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity size={20} className={isAgentActive ? 'text-green-500' : 'text-gray-400'} />
            <span className="font-medium">
              Status: {isAgentActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <button
            onClick={onToggleAgent}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isAgentActive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isAgentActive ? 'Stop Agent' : 'Start Agent'}
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <Settings size={20} className="text-gray-500" />
          <div className="flex-1">
            <label htmlFor="interval" className="block text-sm font-medium text-gray-700 mb-1">
              Check Interval (seconds)
            </label>
            <input
              id="interval"
              type="number"
              min="1"
              max="60"
              value={checkInterval}
              onChange={(e) => onIntervalChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {lastCheckTime && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>Last Check: {lastCheckTime.toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}