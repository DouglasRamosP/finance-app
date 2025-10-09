import 'dotenv/config.js'
import express from 'express'
import { CreateUserController } from './src/controllers/create-user.js'
import { GetUserByIdController } from './src/controllers/get-user-by-id.js'
import { UpdateUserController } from './src/controllers/update-user.js'
import { DeleteUserController } from './src/controllers/delete-user.js'
import { PostgresCreateUserRepository } from './src/repositories/postgres/create-user.js'
import { CreateUserUseCase } from './src/user-case/create-user.js'
import { DeleteUserUseCase } from './src/user-case/delete-user.js'
import { PostgresDeleteUserRepository } from './src/repositories/postgres/delete-user.js'
import { PostgresUpdateUserRepository } from './src/repositories/postgres/update-user.js'
import { UpdateUserUseCase } from './src/user-case/update-user.js'
import { GetUserByIdUseCase } from './src/user-case/get-user-by-id.js'
import { PostgresGetUserRepository } from './src/repositories/postgres/get-user-by-id.js'
import { PostgresGetUserByEmailRepository } from './src/repositories/postgres/get-user-by-email.js'

const app = express()

app.use(express.json())

app.post('/api/users', async (request, response) => {
    const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository()

    const postgresCreateUserRepository = new PostgresCreateUserRepository()

    const createUserUseCase = new CreateUserUseCase(
        postgresCreateUserRepository,
    )

    const createUserController = new CreateUserController(
        postgresGetUserByEmailRepository,
        createUserUseCase,
    )

    const { statusCode, body } = await createUserController.execute(request)

    /* outro jeito de fazer
    const responseObject = await createUserController.execute(request);

    const statusCode = responseObject.statusCode;
    const body = responseObject.body */

    response.status(statusCode).send(body)
})

app.delete('/api/users/:userId', async (request, response) => {
    const postgresDeleteUserRepository = new PostgresDeleteUserRepository()

    const deleteUserUsecase = new DeleteUserUseCase(
        postgresDeleteUserRepository,
    )

    const deleteUserController = new DeleteUserController(deleteUserUsecase)

    const { statusCode, body } = await deleteUserController.execute(request)

    response.status(statusCode).send(body)
})

app.patch('/api/users/:userId', async (request, response) => {
    const postgresUpdateUserRepository = new PostgresUpdateUserRepository()

    const updateUserUseCase = new UpdateUserUseCase(
        postgresUpdateUserRepository,
    )

    const updateUserController = new UpdateUserController(updateUserUseCase)

    const { statusCode, body } = await updateUserController.execute(request)

    response.status(statusCode).send(body)
})

app.get('/api/users/:userId', async (request, response) => {
    const postgresGetUserRepository = new PostgresGetUserRepository()

    const getUserByIdUseCase = new GetUserByIdUseCase(postgresGetUserRepository)

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    const { statusCode, body } = await getUserByIdController.execute(request)

    response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT} port`)
})
