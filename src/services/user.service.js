import prisma from "../config/db.js";

export const getAllUsers = async ({sortBy, order, page, pageSize}) => {

    const[users, total] = await Promise.all([
        prisma.user.findMany({
            where, 
            orderBy: {[sortBy]: order},
            skip: (page - 1) * pageSize, 
            take: pageSize,
            include: {}
        }),
        prisma.user.count({ where })
    ])
    return {users, total}
}

export const getUsereById = async (id) =>
    prisma.user.findUnique({
        where: { id },
    })

export const createUser = async ({username, email, password, user_type}) =>
    prisma.user.create({
        data: {username, email, password, user_type},
    })

export const updateUser = async (id, changes) =>
    prisma.user.update({
        where: {id},
        data: changes,
    })

export const deleteUser = async (id) => prisma.user.delete({ where: {id}});