import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserByEmailRepository {
    async execute(email) {
        return await prisma.users.findUnique({
            where: {
                email,
            },
        })
    }
}
