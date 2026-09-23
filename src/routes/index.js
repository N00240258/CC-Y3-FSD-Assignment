// Aggregates one express.Router() per resource, same as the support desk
// case study. Mount your own resources here as you add them.
import express from 'express';
import welcomeRoutes from './welcome.routes.js';

const router = express.Router();

router.use('/welcome', welcomeRoutes);

export default router;
