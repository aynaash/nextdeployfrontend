'use client';
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
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Managed Agents</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
        >
          Register New Agent
        </button>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onCommand={handleCommand} />
        ))}
      </div>

      <RegisterAgentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
