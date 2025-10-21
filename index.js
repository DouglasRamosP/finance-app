import 'dotenv/config.js'
import express from 'express'
import {
    makerGetUserByIdController,
    makerCreateUserController,
    makerDeleteUserController,
    makerUpdateUserController,
} from './src/factories/controllers/user.js'
import {
    makerCreateTransactionController,
    makerGetTransactionByUserIdController,
    makerUpdateTransactionController,
} from './src/factories/controllers/transaction.js'

const app = express()

app.use(express.json())

app.post('/api/users', async (request, response) => {
    const createUserController = makerCreateUserController()

    const { statusCode, body } = await createUserController.execute(request)

    /* outro jeito de fazer (Destructuring)
    const responseObject = await createUserController.execute(request);

    const statusCode = responseObject.statusCode;
    const body = responseObject.body */

    response.status(statusCode).send(body)
})

app.delete('/api/users/:userId', async (request, response) => {
    const deleteUserController = makerDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute(request)

    response.status(statusCode).send(body)
})

app.patch('/api/users/:userId', async (request, response) => {
    const updateUserController = makerUpdateUserController()

    const { statusCode, body } = await updateUserController.execute(request)

    response.status(statusCode).send(body)
})

app.patch('/api/users/:transactionId', async (request, response) => {
    const updateTransactionController = makerUpdateTransactionController()

    const { statusCode, body } =
        await updateTransactionController.execute(request)

    response.status(statusCode).send(body)
})

app.get('/api/users/:userId', async (request, response) => {
    const getUserByIdController = makerGetUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute(request)

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
