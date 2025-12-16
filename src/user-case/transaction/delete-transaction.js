export class DeleteTransactionUseCase {
    constructor(
        postgresDeleteTransactionRepository,
        getTransactionByIdRepository,
    ) {
        this.postgresDeleteTransactionRepository =
            postgresDeleteTransactionRepository
        this.getTransactionByIdRepository = getTransactionByIdRepository
    }
    async execute(transactionId, userId) {
        const transaction = await this.getTransactionByIdRepository.execute(
            transactionId,
            userId,
        )

        if (!transaction) {
            throw new Error('Transaction not found')
        }

        if (transaction.user_id !== userId) {
            throw new Error('Unauthorized')
        }

        const deleteTransaction =
            await this.postgresDeleteTransactionRepository.execute(
                transactionId,
            )

        return deleteTransaction
    }
}
