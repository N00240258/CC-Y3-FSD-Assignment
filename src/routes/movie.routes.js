import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import * as movieController from '../controllers/movie.controller.js';

const router = express.Router();

router.get('/', movieController.getAllMovies);
router.post('/', movieController.createMovie);
router.get('/:id', movieController.getMovieById);

// router.post(
//     "/",
//     authorize("admin"),
//     validate({ body: createMovieSchema }),
//     movieController.createMovie,
// )

// router.patch(
//     "/"
// )

// router.get(
//     "/:id",
// )

// router.delete(
    
// )
export default router;
