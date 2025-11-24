import { Router } from 'express'
import {
    makerGetUserByIdController,
    makerCreateUserController,
    makerDeleteUserController,
    makerUpdateUserController,
    makerGetUserBalanceController,
} from '../factories/controllers/user.js'

export const usersRouter = Router()

usersRouter.post('/', async (request, response) => {
    const createUserController = makerCreateUserController()

    const { statusCode, body } = await createUserController.execute(request)

    /* outro jeito de fazer (Destructuring)
    const responseObject = await createUserController.execute(request);

    const statusCode = responseObject.statusCode;
    const body = responseObject.body */

    response.status(statusCode).send(body)
})

usersRouter.delete('/:userId', async (request, response) => {
    const deleteUserController = makerDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute(request)

    response.status(statusCode).send(body)
})

usersRouter.patch('/:userId', async (request, response) => {
    const updateUserController = makerUpdateUserController()

    const { statusCode, body } = await updateUserController.execute(request)

    response.status(statusCode).send(body)
})

usersRouter.get('/:userId', async (request, response) => {
    const getUserByIdController = makerGetUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute(request)

    response.status(statusCode).send(body)
})

usersRouter.get('/:userId/balance', async (request, response) => {
    const getUserBalanceController = makerGetUserBalanceController()

    const { statusCode, body } = await getUserBalanceController.execute(request)

    response.status(statusCode).send(body)
})
