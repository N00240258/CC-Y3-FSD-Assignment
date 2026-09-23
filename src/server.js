import http from 'node:http';
import app from './app.js';
import env from './config/env.js';

// An explicit http.Server, same as the support desk case study's
// server.js — app.listen() below would create one internally anyway, but
// keeping a reference to it here is what lets you later attach Socket.io
// (initSocket(httpServer)) or schedule a repeatable BullMQ job
// (scheduleSlaScan()) before the server starts listening, the same way
// that file does.
const httpServer = http.createServer(app);

httpServer.listen(env.PORT, () => {
  console.log(`Student assignment API listening on http://localhost:${env.PORT}`);
});
