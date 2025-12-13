import { Router } from 'express'
import {
    makerGetUserByIdController,
    makerCreateUserController,
    makerDeleteUserController,
    makerUpdateUserController,
    makerGetUserBalanceController,
    makerLoginUserController,
    makerRefreshTokenController,
} from '../factories/controllers/user.js'
import { auth } from '../middleweres/auth.js'

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

usersRouter.delete('/me', auth, async (request, response) => {
    const deleteUserController = makerDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute({
        ...request,
        params: { userId: request.userId },
    })

    response.status(statusCode).send(body)
})

usersRouter.patch('/me', auth, async (request, response) => {
    const updateUserController = makerUpdateUserController()

    const { statusCode, body } = await updateUserController.execute({
        ...request,
        params: { userId: request.userId },
    })

    response.status(statusCode).send(body)
})

usersRouter.get('/me', auth, async (request, response) => {
    const getUserByIdController = makerGetUserByIdController()

    console.log('Usuário autenticado:', request.userId)

    const { statusCode, body } = await getUserByIdController.execute({
        ...request,
        params: { userId: request.userId },
        query: {
            from: request.query.from,
            to: request.query.to,
        },
    })

    response.status(statusCode).send(body)
})

usersRouter.get('/me/balance', auth, async (request, response) => {
    const getUserBalanceController = makerGetUserBalanceController()

    const { statusCode, body } = await getUserBalanceController.execute({
        ...request,
        params: { userId: request.userId },
    })

    response.status(statusCode).send(body)
})

usersRouter.post('/login', async (request, response) => {
    const loginUserController = makerLoginUserController()

    const { statusCode, body } = await loginUserController.execute(request)

    response.status(statusCode).send(body)
})

usersRouter.post('/refresh-token', async (request, response) => {
    const refreshTokenController = makerRefreshTokenController()

    const { statusCode, body } = await refreshTokenController.execute(request)

    response.status(statusCode).send(body)
})
