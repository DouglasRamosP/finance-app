import { prisma } from '../../../../prisma/prisma.js'
import { buildInclusiveDateRange } from '../../../utils/date-range.js'
import { serializeTransactions } from '../../../utils/serialize-transaction.js'

export class PostgresGetTransactionByUserIdRepository {
    async execute(userId, from, to) {
        const transactions = await prisma.transactions.findMany({
            where: {
                user_id: userId,
                date: buildInclusiveDateRange(from, to),
            },
            orderBy: {
                date: 'desc',
            },
        })

        return serializeTransactions(transactions)
    }
}
