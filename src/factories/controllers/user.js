import { PostgresGetUserByEmailRepository } from '../../repositories/postgres/user/get-user-by-email.js'
import { PostgresDeleteUserRepository } from '../../repositories/postgres/user/delete-user.js'
import { PostgresUpdateUserRepository } from '../../repositories/postgres/user/update-user.js'
import { PostgresGetUserRepository } from '../../repositories/postgres/user/get-user-by-id.js'
import { PostgresCreateUserRepository } from '../../repositories/postgres/user/create-user.js'
import { GetUserByIdUseCase } from '../../user-case/user/get-user-by-id.js'
import { DeleteUserUseCase } from '../../user-case/user/delete-user.js'
import { UpdateUserUseCase } from '../../user-case/user/update-user.js'
import { CreateUserUseCase } from '../../user-case/user/create-user.js'
import { GetUserByIdController } from '../../controllers/user/get-user-by-id.js'
import { CreateUserController } from '../../controllers/user/create-user.js'
import { DeleteUserController } from '../../controllers/user/delete-user.js'
import { UpdateUserController } from '../../controllers/user/update-user.js'
import { PostgresGetUserBalanceRepository } from '../../repositories/postgres/user/get-user-balance.js'
import { GetUserBalanceUseCase } from '../../user-case/user/get-user-balance.js'
import { GetUserBalanceController } from '../../controllers/user/get-user-balance.js'
import { PasswordHasherAdapter } from '../../adapters/password-hasher.js'
import { IdGeneratorAdapter } from '../../adapters/id-generator.js'

export const makerGetUserByIdController = () => {
    const postgresGetUserRepository = new PostgresGetUserRepository()

    const getUserByIdUseCase = new GetUserByIdUseCase(postgresGetUserRepository)

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    return getUserByIdController
}

export const makerCreateUserController = () => {
    const idGeneratorAdapter = new IdGeneratorAdapter()

    const passwordHasherAdapter = new PasswordHasherAdapter()

    const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository()

    const postgresCreateUserRepository = new PostgresCreateUserRepository()

    const createUserUseCase = new CreateUserUseCase(
        postgresGetUserByEmailRepository,
        postgresCreateUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
    )

    const createUserController = new CreateUserController(createUserUseCase)

    return createUserController
}

export const makerDeleteUserController = () => {
    const postgresDeleteUserRepository = new PostgresDeleteUserRepository()

    const deleteUserUsecase = new DeleteUserUseCase(
        postgresDeleteUserRepository,
    )

    const deleteUserController = new DeleteUserController(deleteUserUsecase)

    return deleteUserController
}

export const makerUpdateUserController = () => {
    const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository()
    const postgresUpdateUserRepository = new PostgresUpdateUserRepository()

    const updateUserUseCase = new UpdateUserUseCase(
        postgresUpdateUserRepository,
        postgresGetUserByEmailRepository,
    )

    const updateUserController = new UpdateUserController(updateUserUseCase)

    return updateUserController
}

export const makerGetUserBalanceController = () => {
    // Repositórios
    const postgresGetUserBalanceRepository =
        new PostgresGetUserBalanceRepository()

    // ATENÇÃO: instancie e injete o repo de usuário no use case o getUserByIdUseCase depende dele
    const postgresGetUserRepository = new PostgresGetUserRepository()
    const getUserByIdUseCase = new GetUserByIdUseCase(postgresGetUserRepository)

    // Use case de balance recebe ambos
    const getUserBalanceUseCase = new GetUserBalanceUseCase(
        postgresGetUserBalanceRepository,
        getUserByIdUseCase,
    )

    // Controller
    const getUserBalanceController = new GetUserBalanceController(
        getUserBalanceUseCase,
    )

    return getUserBalanceController
}
