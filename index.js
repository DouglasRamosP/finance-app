import 'dotenv/config.js'
import express from 'express'

import {
    makerCreateTransactionController,
    makerDeleteTransactionController,
    makerGetTransactionByUserIdController,
    makerUpdateTransactionController,
} from './src/factories/controllers/transaction.js'
import { usersRouter } from './src/routes/users.js'

const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)

app.delete('/api/transaction/:transactionId', async (request, response) => {
    const deleteTransactionController = makerDeleteTransactionController()

    const { statusCode, body } =
        await deleteTransactionController.execute(request)

    response.status(statusCode).send(body)
})

app.patch('/api/transaction/:transactionId', async (request, response) => {
    const updateTransactionController = makerUpdateTransactionController()

    const { statusCode, body } =
        await updateTransactionController.execute(request)

    response.status(statusCode).send(body)
})

app.get('/api/transaction', async (request, response) => {
    const getTransactionByIdController = makerGetTransactionByUserIdController()

    const { statusCode, body } =
        await getTransactionByIdController.execute(request)

    response.status(statusCode).send(body)
})

app.post('/api/transaction', async (request, response) => {
    const createTransactionController = makerCreateTransactionController()

    const { statusCode, body } =
        await createTransactionController.execute(request)

    response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT} port`)
})
