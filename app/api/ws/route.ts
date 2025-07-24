import { NextApiRequest, NextApiResponse } from 'next';
import { WebSocket, WebSocketServer } from 'ws';
import { z } from 'zod';
import { verifyMessage } from '../../../lib/crypto';

interface AgentConnection {
  socket: WebSocket;
  agentId: string;
  lastSeen: Date;
}

const agentConnections = new Map<string, AgentConnection>();

// Message schemas
const BaseMessageSchema = z.object({
  type: z.string(),
});

const HeartbeatMessageSchema = BaseMessageSchema.extend({
  type: z.literal('heartbeat'),
  agentId: z.string(),
});

const LogMessageSchema = BaseMessageSchema.extend({
  type: z.literal('log'),
  message: z.any(),
  agentId: z.string().optional(),
});

const MetricsMessageSchema = BaseMessageSchema.extend({
  type: z.literal('metrics'),
  metrics: z.any(),
  agentId: z.string().optional(),
});

type IncomingMessage =
  | z.infer<typeof HeartbeatMessageSchema>
  | z.infer<typeof LogMessageSchema>
  | z.infer<typeof MetricsMessageSchema>;

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
        const raw = message.toString().trim();
        if (!raw || raw === 'undefined' || raw === 'null') {
          console.warn(`Invalid message from ${agentId}: "${raw}"`);
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
          return;
        }

        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch (err) {
          console.error(`Malformed JSON from ${agentId}:`, raw);
          ws.send(JSON.stringify({ error: 'Malformed JSON' }));
          return;
        }

        // Validate against known schemas
        let msg: IncomingMessage;
        if (HeartbeatMessageSchema.safeParse(parsed).success) {
          msg = parsed as z.infer<typeof HeartbeatMessageSchema>;
        } else if (LogMessageSchema.safeParse(parsed).success) {
          msg = parsed as z.infer<typeof LogMessageSchema>;
        } else if (MetricsMessageSchema.safeParse(parsed).success) {
          msg = parsed as z.infer<typeof MetricsMessageSchema>;
        } else {
          console.warn(`Unknown message schema from ${agentId}:`, parsed);
          ws.send(JSON.stringify({ error: 'Unknown message schema' }));
          return;
        }

        if (!verifyMessage(msg)) {
          console.warn(`Failed signature verification from ${agentId}`);
          ws.close();
          return;
        }

        connection.lastSeen = new Date();

        processMessage(agentId, msg);
      });

      ws.on('close', () => {
        agentConnections.delete(agentId);
        broadcastAgentStatus(agentId, 'offline');
      });

      // Send initial config after connection
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
  // TODO: Replace with real verification logic
  return true;
}

function processMessage(agentId: string, msg: IncomingMessage) {
  switch (msg.type) {
    case 'heartbeat':
      updateAgentStatus(agentId, 'online');
      break;
    case 'log':
      broadcastLogs(agentId, msg);
      break;
    case 'metrics':
      broadcastMetrics(agentId, msg);
      break;
    default:
      console.warn(`Unhandled message type from ${agentId}: ${msg.type}`);
  }
}

function broadcastAgentStatus(agentId: string, status: 'online' | 'offline') {
  const wss = getWebSocketServer();
  if (!wss) return;

  const message = JSON.stringify({
    type: 'agent_status',
    agentId,
    status,
    timestamp: new Date().toISOString(),
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastLogs(agentId: string, logData: any) {
  const wss = getWebSocketServer();
  if (!wss) return;

  const message = JSON.stringify({
    type: 'log',
    agentId,
    ...logData,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastMetrics(agentId: string, metricsData: any) {
  const wss = getWebSocketServer();
  if (!wss) return;

  const message = JSON.stringify({
    type: 'metrics',
    agentId,
    ...metricsData,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function updateAgentStatus(agentId: string, status: 'online' | 'offline') {
  // TODO: Persist agent status in DB or cache
  console.log(`Agent ${agentId} is now ${status}`);
}

function getWebSocketServer(): WebSocketServer | null {
  // Return the current WebSocketServer instance
  // You need to implement this depending on your server setup
  // Example (if stored globally):
  // return globalThis.wss || null;
  return null;
}
