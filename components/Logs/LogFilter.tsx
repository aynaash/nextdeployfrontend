'use client';
import { useState } from 'react';

interface LogFilterProps {
  agents: any[];
  onFilterChange: (filters: any) => void;
}

export default function LogFilter({ agents, onFilterChange }: LogFilterProps) {
  const [filters, setFilters] = useState({
    agentId: '',
    search: '',
    level: 'all',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className='mb-4 rounded-lg bg-white p-4 shadow-sm'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Agent</label>
          <select
            name='agentId'
            value={filters.agentId}
            onChange={handleChange}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          >
            <option value=''>All Agents</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Log Level</label>
          <select
            name='level'
            value={filters.level}
            onChange={handleChange}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          >
            <option value='all'>All Levels</option>
            <option value='info'>Info</option>
            <option value='warning'>Warning</option>
            <option value='error'>Error</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Search</label>
          <input
            type='text'
            name='search'
            value={filters.search}
            onChange={handleChange}
            placeholder='Search logs...'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          />
        </div>
      </div>
    </div>
  );
}
