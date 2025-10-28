import { prisma } from '../../../../prisma/prisma.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        try {
            return await prisma.transactions.delete({
                where: {
                    id: transactionId,
                },
            })
        } catch (error) {
            return null
        }
    }
}
