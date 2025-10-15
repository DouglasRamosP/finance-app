import { CreateTransactionController } from '../../controllers/transaction/create-transaction.js'
import { PostgresCreateTransactionRepository } from '../../repositories/postgres/transaction/create-transaction.js'
import { PostgresGetUserRepository } from '../../repositories/postgres/user/get-user-by-id.js'
import { CreateTransactionUseCase } from '../../user-case/transaction/create-transaction.js'

export const makerCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()

    const getUserByIdRepository = new PostgresGetUserRepository()

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
    )

    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )

    return createTransactionController
}
