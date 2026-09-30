import prisma from "../config/db.js";

export const getReviewsByMovieId = async (movie_id) =>
    prisma.review.findMany({
        where: {movie_id},
        orderBy: {createdAt: "asc"},
    })

export const getReviewsByUserId = async (user_id) =>
    prisma.review.findMany({
        where: {user_id},
        orderBy: {createdAt: "asc"},
    })

export const getReviewById = async (movie_id, id) =>
    prisma.review.findFirst({
        where: {id, movie_id},
    })

export const createReview = async (movie_id, {review_text, rating, user_id}) =>
    prisma.review.create({
        data: { review_text, rating, user_id}
    })

export const updateReview = async (id, changes) =>
    prisma.review.update({
        where: {id},
        data: changes
    })

export const deleteReview = async (id)