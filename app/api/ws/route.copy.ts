// import { WebSocketServer } from 'ws';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { db } from '@/lib/db';
// import { verifyToken } from '@/lib/auth';
//
// // Keep track of connected clients
// const clients = new Map<string, WebSocket>();
//
// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (!res.socket.server.wss) {
//     const wss = new WebSocketServer({ noServer: true });
//     
//     wss.on('connection', (ws, request) => {
//       const token = request.url?.split('token=')[1];
//       const userId = verifyToken(token);
//       
//       if (!userId) {
//         ws.close(1008, 'Unauthorized');
//         return;
//       }
//       
//       clients.set(userId, ws);
//       
//       ws.on('close', () => {
//         clients.delete(userId);
//       });
//       
//       ws.on('message', (message) => {
//         // Handle incoming messages if needed
//       });
//     });
//     
//     res.socket.server.wss = wss;
//   }
//   
//   // Handle upgrade requests
//   res.socket.server.on('upgrade', (req, socket, head) => {
//     res.socket.server.wss.handleUpgrade(req, socket, head, (ws) => {
//       res.socket.server.wss.emit('connection', ws, req);
//     });
//   });
//   
//   res.end();
// }
//
// export function broadcastToUser(userId: string, event: string, data: any) {
//   const ws = clients.get(userId);
//   if (ws && ws.readyState === ws.OPEN) {
//     ws.send(JSON.stringify({ event, data }));
//   }
// }
//
// export function broadcastToTeam(teamId: string, event: string, data: any) {
//   // In a real app, you would get team members from DB
//   // and send to each member's WebSocket connection
// }
