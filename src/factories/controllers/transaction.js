import { CreateTransactionController } from '../../controllers/transaction/create-transaction.js'
import { GetTransactionByUserIdController } from '../../controllers/transaction/get-transaction-by-user-id.js'
import { PostgresCreateTransactionRepository } from '../../repositories/postgres/transaction/create-transaction.js'
import { PostgresGetTransactionByUserIdRepository } from '../../repositories/postgres/transaction/get-transaction-by-user-id.js'
import { PostgresGetUserRepository } from '../../repositories/postgres/user/get-user-by-id.js'
import { CreateTransactionUseCase } from '../../user-case/transaction/create-transaction.js'
import { GetTransactionByUserIdUseCase } from '../../user-case/transaction/get-transaction-by-use-case.js'

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

export const makerGetTransactionByUserIdController = () => {
    const getTransactionByUserIdRepository =
        new PostgresGetTransactionByUserIdRepository()

    const getUserRepository = new PostgresGetUserRepository()

    const getTransactionByUserIdUseCase = new GetTransactionByUserIdUseCase(
        getTransactionByUserIdRepository,
        getUserRepository,
    )

    const getTransactionByUserIdController = new GetTransactionByUserIdController(getTransactionByUserIdUseCase)

    return getTransactionByUserIdController
}
