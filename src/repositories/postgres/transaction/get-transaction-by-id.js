import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionByIdRepository {
    async execute(transactionId) {
        const transaction = await prisma.transactions.findUnique({
            where: {
                id: transactionId,
            },
        })
        return transaction
    }
}
