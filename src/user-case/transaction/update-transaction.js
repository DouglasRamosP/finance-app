export class UpdateTransactionUseCase {
    constructor(postgresUpdateTransactionRepository) {
        this.postgresUpdateTransactionRepository =
            postgresUpdateTransactionRepository
    }
    async execute(transactionId, updateTransactionParams) {
        const updateTransaction = await
            this.postgresUpdateTransactionRepository.execute(
                transactionId,
                updateTransactionParams,
            )

        return updateTransaction
    }
}
