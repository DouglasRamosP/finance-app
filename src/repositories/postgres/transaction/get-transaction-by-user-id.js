import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionByUserIdRepository {
    async execute(userId) {
        return await prisma.transactions.findMany({
            where: {
                user_id: userId,
            },
        })
    }
}
