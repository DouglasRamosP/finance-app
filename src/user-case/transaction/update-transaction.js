import {
    TransactionNotFoundError,
    UnauthorizedTransactionAccessError,
} from '../../errors/transaction.js'

export class UpdateTransactionUseCase {
    constructor(
        postgresUpdateTransactionRepository,
        postgresGetTransactionByIdRepository,
    ) {
        this.postgresUpdateTransactionRepository =
            postgresUpdateTransactionRepository
        this.postgresGetTransactionByIdRepository =
            postgresGetTransactionByIdRepository
    }
    async execute(transactionId, updateTransactionParams) {
        const transactionExists =
            await this.postgresGetTransactionByIdRepository.execute(
                transactionId,
            )

        if (!transactionExists) {
            throw new TransactionNotFoundError(transactionId)
        }

        if (transactionExists.user_id !== updateTransactionParams.user_id) {
            throw new UnauthorizedTransactionAccessError()
        }

        const updateTransaction =
            await this.postgresUpdateTransactionRepository.execute(
                transactionId,
                updateTransactionParams,
            )

        return updateTransaction
    }
}
