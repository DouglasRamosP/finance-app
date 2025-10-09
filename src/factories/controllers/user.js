import { PostgresGetUserByEmailRepository } from '../../repositories/postgres/get-user-by-email.js'
import { PostgresDeleteUserRepository } from '../../repositories/postgres/delete-user.js'
import { PostgresUpdateUserRepository } from '../../repositories/postgres/update-user.js'
import { PostgresGetUserRepository } from '../../repositories/postgres/get-user-by-id.js'
import { PostgresCreateUserRepository } from '../../repositories/postgres/create-user.js'
import { GetUserByIdUseCase } from '../../user-case/get-user-by-id.js'
import { DeleteUserUseCase } from '../../user-case/delete-user.js'
import { UpdateUserUseCase } from '../../user-case/update-user.js'
import { CreateUserUseCase } from '../../user-case/create-user.js'
import { GetUserByIdController } from '../../controllers/get-user-by-id.js'
import { CreateUserController } from '../../controllers/create-user.js'
import { DeleteUserController } from '../../controllers/delete-user.js'
import { UpdateUserController } from '../../controllers/update-user.js'

export const makerGetUserByIdController = () => {
    const postgresGetUserRepository = new PostgresGetUserRepository()

    const getUserByIdUseCase = new GetUserByIdUseCase(postgresGetUserRepository)

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    return getUserByIdController
}

export const makerCreateUserController = () => {
    const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository()

    const postgresCreateUserRepository = new PostgresCreateUserRepository()

    const createUserUseCase = new CreateUserUseCase(
        postgresGetUserByEmailRepository,
        postgresCreateUserRepository,
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
    const postgresUpdateUserRepository = new PostgresUpdateUserRepository()

    const updateUserUseCase = new UpdateUserUseCase(
        postgresUpdateUserRepository,
    )

    const updateUserController = new UpdateUserController(updateUserUseCase)

    return updateUserController
}
