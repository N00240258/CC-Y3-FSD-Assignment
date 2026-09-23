import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { getWelcome } from '../controllers/welcome.controller.js';

const router = express.Router();

router.get('/', asyncHandler(getWelcome));

export default router;
