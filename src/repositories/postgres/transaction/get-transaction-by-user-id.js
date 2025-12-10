import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionByUserIdRepository {
    async execute(userId, from, to) {
        return await prisma.transactions.findMany({
            where: {
                user_id: userId,
                date: {
                    gte: from,
                    lte: to,
                },
            },
        })
    }
}
