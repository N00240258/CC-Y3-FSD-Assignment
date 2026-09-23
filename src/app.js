// Builds and exports the Express app, but never calls .listen() — that's
// server.js's job. Keeping the two separate lets integration tests import
// `app` directly via supertest without binding a real port, and keeps
// anything that needs real infrastructure (Redis, sockets, ...) out of
// this module — same split as the support desk case study.
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());

app.use(routes);

// Registered last, in order, so they see every route/middleware above them:
// unmatched requests fall through to notFound, and any forwarded/thrown
// error (including from notFound) is handled centrally by errorHandler.
app.use(notFound);
app.use(errorHandler);

export default app;
