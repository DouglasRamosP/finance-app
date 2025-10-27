import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserRepository {
    async execute(userId) {
        return await prisma.users.findUnique({
            where: {
                id: userId,
            },
        })
    }
}
