import {NextApiRequest, NextApiResponse} from "next"

import WebSocket from 'ws'

import {verifyMessage} from "../../../lib/crypto.ts"




interface AgentConnection {
  socket: WebSocket;
  agentId: string;
  lastSeen: Date;
}

const agentConnections = new Map<string, AgentConnection>();

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
        lastSeen: new Date()
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
          
          // Handle message types
          switch (msg.type) {
            case 'event':
              handleAgentEvent(msg);
              break;
            case 'log':
              broadcastLogs(msg);
              break;
            case 'status':
              updateAgentStatus(msg);
              break;
          }
        } catch (err) {
          console.error('Message processing error:', err);
        }
      });

      ws.on('close', () => {
        agentConnections.delete(agentId);
      });
    });
  }

  // Handle upgrade
  res.socket.server.wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    res.socket.server.wss.emit('connection', ws, req);
  });
}

function handleAgentEvent(msg: any) {
  // Store event in database
  // Notify connected clients via Socket.IO or other real-time channel
}

function broadcastLogs(msg: any) {
  // Broadcast logs to all dashboard clients watching this agent
}

function updateAgentStatus(msg: any) {
  // Update agent status in database
}
