'use client';
import { useEffect, useRef } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function LogViewer() {
  const { logs } = useWebSocket();
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className='h-[70vh] overflow-y-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100'>
      <div className='space-y-1'>
        {logs.map((log, index) => (
          <div key={index} className='flex'>
            <span className='w-40 shrink-0 text-gray-500'>
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className='mr-2 text-gray-400'>[{log.agentId}]</span>
            {log.context?.container_id && (
              <span className='mr-2 text-blue-400'>{log.context.container_id.substring(0, 6)}</span>
            )}
            <span className={`${log.type === 'error' ? 'text-red-400' : 'text-gray-200'}`}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
