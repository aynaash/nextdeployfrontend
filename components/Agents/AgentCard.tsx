"use client";
import { useState } from 'react';

export default function AgentCard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Static agent data
  const agent = {
    id: 'agent-001',
    name: 'Primary Server',
    vpsIp: '192.168.1.100',
    status: 'online',
    lastSeen: Date.now(),
  };

  // Mock command handler
  const onCommand = (agentId: string, command: string) => { 
    console.log(`Command "${command}" sent to agent ${agentId}`);
    setIsMenuOpen(false);
    // Add your actual command logic here
  };

  const statusColor = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    warning: 'bg-yellow-500',
  }[agent.status] || 'bg-gray-500';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{agent.name}</h3>
          <p className="text-gray-600 text-sm">{agent.id}</p>
          <p className="text-gray-600">{agent.vpsIp}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-block w-3 h-3 rounded-full ${statusColor}`}></span>
          <span className="text-sm capitalize">{agent.status}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Last seen: {new Date(agent.lastSeen).toLocaleString()}
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Agent actions menu"
          >
            ⋮
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button 
                  onClick={() => onCommand(agent.id, 'restart')}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Restart Agent
                </button>
                <button 
                  onClick={() => onCommand(agent.id, 'update')}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Update Agent
                </button>
                <button 
                  onClick={() => onCommand(agent.id, 'logs')}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  View Logs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
