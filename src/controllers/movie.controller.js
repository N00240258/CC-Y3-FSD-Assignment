import * as movieService from "../services/movie.service.js"
import asyncHandler from "../middleware/asyncHandler.js";
import { number } from "zod/v4";

export const getAllMovies = asyncHandler(async (req, res) => {
  const movies = await movieService.getAllMovies();
  res.json(movies)
});

export const getMovieById  = asyncHandler(async(req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: {message: "id must be a number"}});
  }

  const movie = await movieService.getMovieById(id);

  if (!movie) {
    return res.status(404).json({error: {message: `Movie ${id} not found`}})
  }

  res.json(movie)
})

export const createMovie = asyncHandler(async( req, res) => {
  const { image, title, runtime, overview, price, release_date} = req.body;

  if(!title || !runtime || !overview || !price || !release_date) {
    return res
      .status(400)
      .json({ error: { message: 'missing required fields' } });
  }

  const movie = await movieService.createMovie({
    image, 
    title, 
    runtime: Number(runtime), 
    overview, 
    price: Number(price),
    release_date: Date(release_date)
  })
  res.status(201).json(movie);
})