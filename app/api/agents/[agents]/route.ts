import { NextApiResponse, NextApiRequest } from 'next';
import WebSocket from 'ws';

// Maintain log streams for each agent
const logStreams = new Map<string, Set<WebSocket>>();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.wsLogServer) {
    const wss = new WebSocketServer({ noServer: true });
    res.socket.server.wsLogServer = wss;

    wss.on('connection', (ws, req) => {
      const agentId = req.url?.split('/')[3]; // Extract agentId from URL
      if (!agentId) {
        ws.close();
        return;
      }

      // Add to log stream set
      if (!logStreams.has(agentId)) {
        logStreams.set(agentId, new Set());
      }
      logStreams.get(agentId)?.add(ws);

      ws.on('close', () => {
        logStreams.get(agentId)?.delete(ws);
      });
    });
  }

  // Handle upgrade
  res.socket.server.wsLogServer.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    res.socket.server.wsLogServer.emit('connection', ws, req);
  });
}

// Function to broadcast logs to all connected clients
export function broadcastLogs(agentId: string, logData: any) {
  const streams = logStreams.get(agentId);
  if (!streams) return;

  for (const ws of streams) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(logData));
    }
  }
}
