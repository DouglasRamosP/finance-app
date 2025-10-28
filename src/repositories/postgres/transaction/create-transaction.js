import { prisma } from '../../../../prisma/prisma.js'

export class PostgresCreateTransactionRepository {
    async execute(createTransactionParams) {
        return await prisma.transactions.create ({
            data: createTransactionParams,
        })
    }
}
