import prisma from "../config/db.js"



export const getAllMovies = async () =>
    prisma.movie.findMany({
        orderBy: {id:"asc"}
    });

export const getMovieById = async (id) =>
    prisma.movie.findUnique({
        where: { id },
    })

export const createMovie = async ({image, title, runtime, overview, price, release_date}) =>
    prisma.movie.create({
        data : {image, title, runtime, overview, price, release_date},
    })