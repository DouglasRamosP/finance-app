import { Decimal } from '@prisma/client/runtime/library'
import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const {
            _sum: { amount: totalExpenses },
        } = await prisma.transactions.aggregate({
            where: {
                user_id: userId,
                type: 'EXPENSES',
            },
            _sum: {
                amount: true,
            },
        })

        const {
            _sum: { amount: totalEarnings },
        } = await prisma.transactions.aggregate({
            where: {
                user_id: userId,
                type: 'EARNINGS',
            },
            _sum: {
                amount: true,
            },
        })

        const {
            _sum: { amount: totalIvestments },
        } = await prisma.transactions.aggregate({
            where: {
                user_id: userId,
                type: 'INVESTMENTS',
            },
            _sum: {
                amount: true,
            },
        })

        const _totalEarnings = totalEarnings || new Decimal(0)
        const _totalExpenses = totalExpenses || new Decimal(0)
        const _totalIvestments = totalIvestments || new Decimal(0)

        const balance = new Decimal(
            _totalEarnings - _totalExpenses - _totalIvestments,
        )

        return {
            earnings: _totalEarnings,
            expenses: _totalExpenses,
            investments: totalIvestments,
            balance,
        }
    }
}
