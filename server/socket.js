import { Server } from 'socket.io';

let io = null;

export function initSocket(httpServer) {
  if (io) return io;
  io = new Server(httpServer, {
    path: '/api/monitor/socket.io',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.io not initialized. Call initSocket(httpServer) first.');
  return io;
}
