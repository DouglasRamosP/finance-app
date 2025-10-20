import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTrasactionParams) {
    const updateFields = []
    const updateValues = []

        Object.keys(updateTrasactionParams).forEach((key) => {
            updateFields.push(`${key} = $${updateValues.length + 1}`)
            updateValues.push(updateTrasactionParams[key])
        })

        updateValues.push(transactionId)

        const updateQuery = `
        UPDATE transactions SET ${updateFields.join(',')}
        WHERE id = $${updateValues.length}
        RETURNING *
        `

        const updateTransaction = await PostgresHelper.query(
            updateQuery,
            updateValues,
        )

        return updateTransaction[0]
    }
}
