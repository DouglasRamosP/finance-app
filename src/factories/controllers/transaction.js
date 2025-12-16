import { CreateTransactionController } from '../../controllers/transaction/create-transaction.js'
import { GetTransactionByUserIdController } from '../../controllers/transaction/get-transaction-by-user-id.js'
import { PostgresCreateTransactionRepository } from '../../repositories/postgres/transaction/create-transaction.js'
import { PostgresGetTransactionByUserIdRepository } from '../../repositories/postgres/transaction/get-transaction-by-user-id.js'
import { PostgresGetUserRepository } from '../../repositories/postgres/user/get-user-by-id.js'
import { CreateTransactionUseCase } from '../../user-case/transaction/create-transaction.js'
import { GetTransactionByUserIdUseCase } from '../../user-case/transaction/get-transaction-by-use-case.js'
import { PostgresUpdateTransactionRepository } from '../../repositories/postgres/transaction/update-transaction.js'
import { UpdateTransactionUseCase } from '../../user-case/transaction/update-transaction.js'
import { UpdateTransactionController } from '../../controllers/transaction/update-transaction.js'
import { PostgresDeleteTransactionRepository } from '../../repositories/postgres/transaction/delete-transaction.js'
import { DeleteTransactionUseCase } from '../../user-case/transaction/delete-transaction.js'
import { DeleteTransactionController } from '../../controllers/transaction/delete-transaction.js'
import { IdGeneratorAdapter } from '../../adapters/id-generator.js'
import { PostgresGetTransactionByIdRepository } from '../../repositories/postgres/transaction/get-transaction-by-id.js'

export const makerCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()
    const idGeneratorAdapter = new IdGeneratorAdapter()
    const getUserByIdRepository = new PostgresGetUserRepository()

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
        idGeneratorAdapter,
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

    const getTransactionByUserIdController =
        new GetTransactionByUserIdController(getTransactionByUserIdUseCase)

    return getTransactionByUserIdController
}

export const makerUpdateTransactionController = () => {
    const postgresGetTransactionByIdRepository =
        new PostgresGetTransactionByIdRepository()
    const postgresUpdateTransactionRepository =
        new PostgresUpdateTransactionRepository()

    const updateTransactionUseCase = new UpdateTransactionUseCase(
        postgresUpdateTransactionRepository,
        postgresGetTransactionByIdRepository,
    )

    const updateTransactionController = new UpdateTransactionController(
        updateTransactionUseCase,
    )

    return updateTransactionController
}

export const makerDeleteTransactionController = () => {
    const postgresDeleteTransactionRepository =
        new PostgresDeleteTransactionRepository()

    const postgresGetTransactionByIdRepository =
        new PostgresGetTransactionByIdRepository()

    const deleteTransactionUseCase = new DeleteTransactionUseCase(
        postgresDeleteTransactionRepository,
        postgresGetTransactionByIdRepository,
    )

    const deleteTransactionController = new DeleteTransactionController(
        deleteTransactionUseCase,
    )

    return deleteTransactionController
}
