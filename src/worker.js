// The background worker — a second, separate Node process from the API
// (src/server.js), started on its own (`npm run worker`) and never imported
// by app.js or server.js. Same split as the support desk case study's
// src/worker.js: the app stops being one process once there's a worker to
// run alongside it, so anything that shouldn't block a request/response
// cycle (sending email, processing a queued job, ...) happens here instead.
//
// Nothing wired up yet — no domain events, no job queue. Once your case
// study has both, this file should end up looking like the support desk
// project's worker.js:
//
//   import './events/index.js';   // side-effect import, same idiom as
//                                  // app.js — an EventEmitter's listeners
//                                  // only exist in the process that
//                                  // registered them, so this process
//                                  // needs its own copy registered too.
//   import { Worker } from 'bullmq';
//   import connection from './config/redis.js';
//   import { QUEUE_NAME } from './jobs/yourJob.queue.js';
//   import processYourJob from './jobs/yourJob.job.js';
//
//   const worker = new Worker(QUEUE_NAME, processYourJob, { connection });
//
//   worker.on('completed', (job) => console.log(`[worker] ${job.name} completed.`));
//   worker.on('failed', (job, err) => console.error(`[worker] ${job?.name ?? 'job'} failed:`, err));
console.log('Worker started — no jobs or events wired up yet.');

// Nothing above keeps Node's event loop alive, so without this the process
// would exit right after logging — and docker-compose.yml's
// `restart: unless-stopped` would then restart the container in a loop. A
// real BullMQ `Worker` (see the comment above) keeps the event loop alive
// on its own via its Redis connection, making this unnecessary once you
// add one.
setInterval(() => {}, 1 << 30);
