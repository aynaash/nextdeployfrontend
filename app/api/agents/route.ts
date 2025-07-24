import { NextApiRequest, NextApiResponse } from 'next';
import WebSocket from 'ws';
import { z } from 'zod';

import { verifyMessage } from '../../../lib/crypto';

type MessageType = 'event' | 'log' | 'status';

interface AgentConnection {
  socket: WebSocket;
  agentId: string;
  lastSeen: Date;
}

const agentConnections = new Map<string, AgentConnection>();

// Runtime validation for incoming messages
const MessageSchema = z.object({
  type: z.enum(['event', 'log', 'status']),
  payload: z.unknown(),
  signature: z.string()
});

type IncomingMessage = z.infer<typeof MessageSchema>;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.wss) {
    const wss = new WebSocket.Server({ noServer: true });
    res.socket.server.wss = wss;

    wss.on('connection', (ws, req) => {
      const agentId = req.headers['x-agent-id'] as string;

      if (!agentId) {
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
          console.warn(`Received invalid message from ${agentId}: "${raw}"`);
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
          return;
        }

        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch (err) {
          console.error(`Failed to parse JSON from ${agentId}:`, raw);
          ws.send(JSON.stringify({ error: 'Malformed JSON' }));
          return;
        }

        const result = MessageSchema.safeParse(parsed);
        if (!result.success) {
          console.error(`Schema validation failed for ${agentId}:`, result.error.issues);
          ws.send(JSON.stringify({ error: 'Invalid message schema' }));
          return;
        }

        const msg: IncomingMessage = result.data;

        if (!verifyMessage(msg)) {
          console.warn(`Message signature verification failed from ${agentId}`);
          ws.close();
          return;
        }

        connection.lastSeen = new Date();
        handleMessage(agentId, msg);
      });

      ws.on('close', () => {
        agentConnections.delete(agentId);
      });
    });
  }

  // Upgrade HTTP connection to WebSocket
  res.socket.server.wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    res.socket.server.wss.emit('connection', ws, req);
  });
}

function handleMessage(agentId: string, msg: IncomingMessage) {
  switch (msg.type) {
    case 'event':
      handleAgentEvent(agentId, msg.payload);
      break;
    case 'log':
      broadcastLogs(agentId, msg.payload);
      break;
    case 'status':
      updateAgentStatus(agentId, msg.payload);
      break;
    default:
      console.warn(`Unknown message type from ${agentId}: ${msg.type}`);
  }
}

function handleAgentEvent(agentId: string, payload: unknown) {
  // TODO: Store event in DB, notify dashboards, etc.
  console.log(`[${agentId}] event`, payload);
}

function broadcastLogs(agentId: string, payload: unknown) {
  // TODO: Broadcast logs to dashboards
  console.log(`[${agentId}] log`, payload);
}

function updateAgentStatus(agentId: string, payload: unknown) {
  // TODO: Update status in DB
  console.log(`[${agentId}] status`, payload);
}
