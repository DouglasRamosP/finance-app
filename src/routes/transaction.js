import { Router } from 'express'
import {
    makerCreateTransactionController,
    makerDeleteTransactionController,
    makerGetTransactionByUserIdController,
    makerUpdateTransactionController,
} from '../factories/controllers//transaction.js'

export const transactionsRouter = Router()

transactionsRouter.delete('/:transactionId', async (request, response) => {
    const deleteTransactionController = makerDeleteTransactionController()

    const { statusCode, body } =
        await deleteTransactionController.execute(request)

    response.status(statusCode).send(body)
})

transactionsRouter.patch('/:transactionId', async (request, response) => {
    const updateTransactionController = makerUpdateTransactionController()

    const { statusCode, body } =
        await updateTransactionController.execute(request)

    response.status(statusCode).send(body)
})

transactionsRouter.get('/', async (request, response) => {
    const getTransactionByIdController = makerGetTransactionByUserIdController()

    const { statusCode, body } =
        await getTransactionByIdController.execute(request)

    response.status(statusCode).send(body)
})

transactionsRouter.post('/', async (request, response) => {
    const createTransactionController = makerCreateTransactionController()

    const { statusCode, body } =
        await createTransactionController.execute(request)

    response.status(statusCode).send(body)
})
