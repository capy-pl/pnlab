import dotenv from 'dotenv';
import http from 'http';
import open from 'open';

import app from './App';
import dbConnect from './core/db';

// Inject environment variable from .env
dotenv.config();

const server = http.createServer(app);

server.listen(process.env.PORT, async () => {
  await dbConnect();
  console.log(`Server is available on 127.0.0.1:${process.env.PORT}`);
});

server.on('error', (err) => {
  console.error(err);
});
