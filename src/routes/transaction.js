import { Router } from 'express'
import {
    makerCreateTransactionController,
    makerDeleteTransactionController,
    makerGetTransactionByUserIdController,
    makerUpdateTransactionController,
} from '../factories/controllers/transaction.js'
import { auth } from '../middleweres/auth.js'

export const transactionsRouter = Router()

const getTransactionIdFromParams = (params) => {
    return params.id ?? params.transactionId
}

transactionsRouter.delete(
    ['/me/:id', '/me/:transactionId'],
    auth,
    async (request, response) => {
        const deleteTransactionController = makerDeleteTransactionController()

        const { statusCode, body } = await deleteTransactionController.execute({
            params: {
                transactionId: getTransactionIdFromParams(request.params),
                userId: request.userId,
            },
        })

        response.status(statusCode).send(body)
    },
)

transactionsRouter.patch(
    ['/me/:id', '/me/:transactionId'],
    auth,
    async (request, response) => {
        const updateTransactionController = makerUpdateTransactionController()

        const { statusCode, body } = await updateTransactionController.execute({
            params: {
                transactionId: getTransactionIdFromParams(request.params),
            },
            body: request.body,
            userId: request.userId,
        })

        response.status(statusCode).send(body)
    },
)

transactionsRouter.get('/me', auth, async (request, response) => {
    const getTransactionByIdController = makerGetTransactionByUserIdController()

    const { statusCode, body } = await getTransactionByIdController.execute({
        query: {
            userId: request.userId,
            from: request.query.from,
            to: request.query.to,
        },
    })

    response.status(statusCode).send(body)
})

transactionsRouter.post('/me', auth, async (request, response) => {
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
