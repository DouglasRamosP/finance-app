import 'dotenv/config.js'
import express from 'express'

import { usersRouter } from './src/routes/users.js'
import { transactionsRouter } from './src/routes/transaction.js'

const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/transaction', transactionsRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT} port`)
})
