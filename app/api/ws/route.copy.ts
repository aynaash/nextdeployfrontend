import { NextApiRequest, NextApiResponse } from 'next';
import { WebSocketServer } from 'ws';
import { verifyMessage } from '../../../lib/crypto';

interface AgentConnection {
  socket: WebSocket;
  agentId: string;
  lastSeen: Date;
}

const agentConnections = new Map<string, AgentConnection>();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.wss) {
    const wss = new WebSocketServer({ noServer: true });
    res.socket.server.wss = wss;

    wss.on('connection', (ws, req) => {
      const agentId = req.headers['x-agent-id'] as string;

      if (!agentId || !verifyAgent(agentId)) {
        ws.close();
        return;
      }

      const connection: AgentConnection = {
        socket: ws,
        agentId,
        lastSeen: new Date(),
      };

      agentConnections.set(agentId, connection);

      ws.on('message', (message) => {
        try {
          const msg = JSON.parse(message.toString());

          if (!verifyMessage(msg)) {
            ws.close();
            return;
          }

          connection.lastSeen = new Date();
          processMessage(msg);
        } catch (err) {
          console.error('Message processing error:', err);
        }
      });

      ws.on('close', () => {
        agentConnections.delete(agentId);
        broadcastAgentStatus(agentId, 'offline');
      });

      // Send initial configuration
      ws.send(
        JSON.stringify({
          type: 'config',
          heartbeatInterval: 30000,
          logBatchSize: 10,
        })
      );

      broadcastAgentStatus(agentId, 'online');
    });
  }

  res.socket.server.wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    res.socket.server.wss.emit('connection', ws, req);
  });
}

function verifyAgent(agentId: string): boolean {
  // Implement actual agent verification against database
  return true;
}

function processMessage(msg: any) {
  switch (msg.type) {
    case 'heartbeat':
      updateAgentStatus(msg.agentId, 'online');
      break;
    case 'log':
      broadcastLogs(msg);
      break;
    case 'metrics':
      broadcastMetrics(msg);
      break;
  }
}

function broadcastAgentStatus(agentId: string, status: string) {
  const wss = getWebSocketServer();
  if (!wss) return;

  const message = JSON.stringify({
    type: 'agent_status',
    agentId,
    status,
    timestamp: new Date(),
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastLogs(logData: any) {
  const wss = getWebSocketServer();
  if (!wss) return;

  const message = JSON.stringify({
    type: 'log',
    ...logData,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function getWebSocketServer(): WebSocketServer | null {
  // Implementation depends on your setup
  return null;
}
