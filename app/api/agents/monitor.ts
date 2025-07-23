import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/db';
import { WebSocketServer } from 'ws';

// Track last seen timestamps
const agentStatus = new Map<string, { lastSeen: Date; status: string }>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Return current agent statuses
    const agents = await db.agent.findMany();
    const statuses = agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      status: agentStatus.get(agent.id)?.status || 'offline',
      lastSeen: agentStatus.get(agent.id)?.lastSeen || null,
    }));

    return res.status(200).json(statuses);
  }

  // WebSocket for real-time updates
  if (!res.socket.server.wsMonitor) {
    const wss = new WebSocketServer({ noServer: true });
    res.socket.server.wsMonitor = wss;

    wss.on('connection', (ws) => {
      // Send initial status
      ws.send(JSON.stringify(Array.from(agentStatus.entries())));

      // Handle ping/pong for connection health
      ws.on('pong', () => {
        // Connection is alive
      });
    });

    // Check agent status periodically
    setInterval(() => {
      const now = new Date();
      for (const [agentId, data] of agentStatus.entries()) {
        const minutesSinceLastSeen = (now.getTime() - data.lastSeen.getTime()) / (1000 * 60);

        if (minutesSinceLastSeen > 5 && data.status !== 'offline') {
          agentStatus.set(agentId, { ...data, status: 'offline' });
          broadcastStatusUpdate(agentId, 'offline');
          checkForAlerts(agentId);
        }
      }
    }, 60000); // Check every minute
  }

  // Handle upgrade
  res.socket.server.wsMonitor.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    res.socket.server.wsMonitor.emit('connection', ws, req);
  });
}

function broadcastStatusUpdate(agentId: string, status: string) {
  // Broadcast to all connected dashboard clients
  const wss = getWebSocketServer();
  if (!wss) return;

  const message = JSON.stringify({
    type: 'status_update',
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

function checkForAlerts(agentId: string) {
  // Implement alert logic (email, Slack, etc.)
  console.log(`Alert: Agent ${agentId} is offline`);
}
