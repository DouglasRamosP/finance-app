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

        const _totalEarnings = totalEarnings || 0
        const _totalExpenses = totalExpenses || 0
        const _totalIvestments = totalIvestments || 0

        const balance = _totalEarnings - _totalExpenses - _totalIvestments

        return {
            earnings: Number(_totalEarnings),
            expenses: Number(_totalExpenses),
            investments: Number(_totalIvestments),
            balance,
        }
    }
}
