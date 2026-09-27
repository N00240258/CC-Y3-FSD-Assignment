import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { getMovie } from '../controllers/movie.controller.js';

const router = express.Router();

router.get('/', asyncHandler(getWelcome));

router.post(
    "/",
    authorize("admin"),
    validate({ body: createMovieSchema }),
    movieController.createMovie,
)

router.patch(
    "/"
)

router.get(
    "/:id",
)

router.delete(
    
)
export default router;
