import { Decimal } from '@prisma/client/runtime/library'
import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserBalanceRepository {
    async execute(userId, from, to) {
        const [
            {
                _sum: { amount: totalExpenses },
            },
            {
                _sum: { amount: totalEarnings },
            },
            {
                _sum: { amount: totalInvestments },
            },
        ] = await Promise.all([
            prisma.transactions.aggregate({
                where: {
                    user_id: userId,
                    type: 'EXPENSES',
                    date: { gte: from, lte: to },
                },
                _sum: { amount: true },
            }),
            prisma.transactions.aggregate({
                where: {
                    user_id: userId,
                    type: 'EARNINGS',
                    date: { gte: from, lte: to },
                },
                _sum: { amount: true },
            }),
            prisma.transactions.aggregate({
                where: {
                    user_id: userId,
                    type: 'INVESTMENTS',
                    date: { gte: from, lte: to },
                },
                _sum: { amount: true },
            }),
        ])

        const _totalEarnings = totalEarnings ?? new Decimal(0)
        const _totalExpenses = totalExpenses ?? new Decimal(0)
        const _totalInvestments = totalInvestments ?? new Decimal(0)

        const total = _totalEarnings
            .plus(_totalExpenses)
            .plus(_totalInvestments)

        const balance = _totalEarnings
            .minus(_totalExpenses)
            .minus(_totalInvestments)

        const earningsPercentage = total.equals(0)
            ? 0
            : _totalEarnings.dividedBy(total).times(100).toNumber()

        const expensesPercentage = total.equals(0)
            ? 0
            : _totalExpenses.dividedBy(total).times(100).toNumber()

        const investmentsPercentage = total.equals(0)
            ? 0
            : _totalInvestments.dividedBy(total).times(100).toNumber()

        return {
            earnings: _totalEarnings,
            expenses: _totalExpenses,
            investments: _totalInvestments,
            earningsPercentage,
            expensesPercentage,
            investmentsPercentage,
            balance,
        }
    }
}
