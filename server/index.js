import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const PORT = 3001;
const CLIENT_URL = 'http://localhost:5173';

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('send_message', (data) => {
    if (data && data.message && data.message.trim()) {
      console.log(`Message from ${socket.id}: ${data.message}`);
      socket.broadcast.emit('receive_message', data);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  socket.on('error', (error) => {
    console.error(`Socket error from ${socket.id}:`, error);
  });
});

server
  .listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
  })
  .on('error', (err) => {
    console.error('Server failed to start:', err);
  });
