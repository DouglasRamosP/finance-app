import {
    TransactionNotFoundError,
    UnauthorizedTransactionAccessError,
} from '../../errors/transaction.js'

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
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)

        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }

        if (transaction.user_id !== userId) {
            throw new UnauthorizedTransactionAccessError()
        }

        const deleteTransaction =
            await this.postgresDeleteTransactionRepository.execute(
                transactionId,
            )

        return deleteTransaction
    }
}
