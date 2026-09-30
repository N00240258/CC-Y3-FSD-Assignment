import { id } from "zod/v4/locales"
import prisma from "../config/db.js"

export const getAllMovies = async ({sortBy, order, page, pageSize}) => {
    const [movies, total] = await Promise.all([
        prisma.movie.findMany({
            where, 
            orderBy: {[sortBy]: order},
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.movie.count({ where })
    ])
    
    return {movie, total}
}
    

export const getMovieById = async (id) =>
    prisma.movie.findUnique({
        where: { id },
    })

export const createMovie = async ({image, title, runtime, overview, price, release_date}) =>
    prisma.movie.create({
        data : {image, title, runtime, overview, price, release_date},
    })

export const updateMovie = async (id, changes) =>
    prisma.movie.update({
        where: {id},
        data: changes, 
    })

export const deleteMovie = async (id) => prisma.movie.delete({where: {id}});