"use client";
import { useEffect, useState, useCallback } from 'react';

export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  const connect = useCallback(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/api/ws';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
      // Attempt reconnect after delay
      setTimeout(connect, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message:', data);

      switch (data.type) {
        case 'agent_status':
          setAgents(prev => updateAgentStatus(prev, data));
          break;
        case 'log':
          setLogs(prev => [...prev.slice(-1000), data]); // Keep last 1000 logs
          break;
        case 'metrics':
          // Handle metrics update
          break;
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  const sendCommand = useCallback((command: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(command));
    }
  }, [socket, isConnected]);

  return { isConnected, agents, logs, sendCommand };
}

function updateAgentStatus(agents: any[], update: any): any[] {
  const existing = agents.find(a => a.id === update.agentId);
  if (existing) {
    return agents.map(a => a.id === update.agentId ? { ...a, ...update } : a);
  }
  return [...agents, { id: update.agentId, ...update }];
}
