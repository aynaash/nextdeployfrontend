
"use client"
import { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import AgentCard from './AgentCard';
import RegisterAgentModal from './RegisterAgentModal';

export default function AgentList() {
  const { agents, sendCommand } = useWebSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCommand = (agentId: string, command: string) => {
    sendCommand({
      type: 'command',
      target: 'agent',
      agentId,
      command,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Managed Agents</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Register New Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => (
          <AgentCard 
            key={agent.id} 
            agent={agent} 
            onCommand={handleCommand}
          />
        ))}
      </div>

      <RegisterAgentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
