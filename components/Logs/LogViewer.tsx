
import { useEffect, useRef } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function LogViewer() {
  const { logs } = useWebSocket();
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm h-[70vh] overflow-y-auto">
      <div className="space-y-1">
        {logs.map((log, index) => (
          <div key={index} className="flex">
            <span className="text-gray-500 w-40 shrink-0">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className="text-gray-400 mr-2">[{log.agentId}]</span>
            {log.context?.container_id && (
              <span className="text-blue-400 mr-2">
                {log.context.container_id.substring(0, 6)}
              </span>
            )}
            <span className={`${
              log.type === 'error' ? 'text-red-400' : 'text-gray-200'
            }`}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
