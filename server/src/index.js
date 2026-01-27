const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const app = require('./server');
const { connectToDatabase } = require('./lib/db');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectToDatabase(process.env.MONGO_URI);
    const server = http.createServer(app);
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

start(); // Force restart


