export class UpdateTransactionUsecase {
    constructor(postgresUpdateTransactionRepository) {
        this.postgresUpdateTransactionRepository =
            postgresUpdateTransactionRepository
    }
    async execute(transactionId, updateTransactionParams) {
        const updateTransaction =
            this.postgresUpdateTransactionRepository.execute(
                transactionId,
                updateTransactionParams,
            )

        return updateTransaction
    }
}