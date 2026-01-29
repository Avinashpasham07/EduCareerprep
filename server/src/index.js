const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const { Server } = require("socket.io");
const app = require('./server');
const { connectToDatabase } = require('./lib/db');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectToDatabase(process.env.MONGO_URI);
    const server = http.createServer(app);

    // Initialize Socket.io
    const io = new Server(server, {
      cors: {
        origin: "*", // Allow all for dev, restrict in prod
        methods: ["GET", "POST"]
      }
    });

    io.on("connection", (socket) => {
      console.log('User connected:', socket.id);

      socket.emit("me", socket.id);

      socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });
    });

    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

start();


