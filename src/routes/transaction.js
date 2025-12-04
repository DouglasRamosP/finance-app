import { Router } from 'express'
import {
    makerCreateTransactionController,
    makerDeleteTransactionController,
    makerGetTransactionByUserIdController,
    makerUpdateTransactionController,
} from '../factories/controllers//transaction.js'
import { auth } from '../middleweres/auth.js'

export const transactionsRouter = Router()

transactionsRouter.delete('/:transactionId', async (request, response) => {
    const deleteTransactionController = makerDeleteTransactionController()

    const { statusCode, body } =
        await deleteTransactionController.execute(request)

    response.status(statusCode).send(body)
})

transactionsRouter.patch('/:transactionId', auth, async (request, response) => {
    const updateTransactionController = makerUpdateTransactionController()

    const { statusCode, body } = await updateTransactionController.execute({
        params: request.params,
        body: request.body,
        userId: request.userId,
    })

    response.status(statusCode).send(body)
})

transactionsRouter.get('/', auth, async (request, response) => {
    const getTransactionByIdController = makerGetTransactionByUserIdController()

    const { statusCode, body } = await getTransactionByIdController.execute({
        ...request,
        query: {
            ...request.query,
            userId: request.userId,
        },
    })

    response.status(statusCode).send(body)
})

transactionsRouter.post('/', auth, async (request, response) => {
    const createTransactionController = makerCreateTransactionController()

    const { statusCode, body } = await createTransactionController.execute({
        ...request,
        body: {
            ...request.body,
            user_id: request.userId,
        },
    })

    response.status(statusCode).send(body)
})
