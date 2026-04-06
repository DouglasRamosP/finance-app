import { prisma } from '../../../../prisma/prisma.js'

export class PostgresCreateTransactionRepository {
    async execute(createTransactionParams) {
        const { user_id: userId, ...transactionData } = createTransactionParams

        return await prisma.transactions.create({
            data: {
                ...transactionData,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        })
    }
}
