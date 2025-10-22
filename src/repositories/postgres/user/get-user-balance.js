import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const userBalance = await PostgresHelper.query(
            `
            SELECT
            SUM(CASE WHEN type = 'EARNINGS' THEN amount ELSE 0 END) AS earnings,
            SUM(CASE WHEN type = 'EXPENSES' THEN amount ELSE 0 END) AS expenses,
            SUM(CASE WHEN type = 'INVESTMENTS' THEN amount ELSE 0 END) AS investiments,
            (
            SUM(CASE WHEN type = 'EARNINGS' THEN amount ELSE 0 END)
            - SUM(CASE WHEN type = 'EXPENSES' THEN amount ELSE 0 END)
            - SUM(CASE WHEN type = 'INVESTMENTS' THEN amount ELSE 0 END)
            ) AS  balance
             FROM transactions
             WHERE user_id = $1;
            `,
            [userId],
        )

        return {
            userId,
            ...userBalance[0],
        }
    }
}
