import 'dotenv/config.js'
import express from 'express'
import { CreateUserController } from './src/controllers/create-user.js'

const app = express()

app.use(express.json())

app.post('/api/users', async (request, response) => {
    const createUserController = new CreateUserController()

    const { statusCode, body } = await createUserController.execute(request)

    /* outro jeito de fazer
    const responseObject = await createUserController.execute(request);

    const statusCode = responseObject.statusCode;
    const body = responseObject.body */

    response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT} port`)
})
