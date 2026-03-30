import express from 'express'
import { usersRouter } from './routes/users.js'
import { transactionsRouter } from './routes/transaction.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'

export const app = express()

const loadSwaggerDocument = () => {
    try {
        const swaggerPath = path.join(
            import.meta.dirname,
            '../docs/swagger.json',
        )

        return JSON.parse(fs.readFileSync(swaggerPath, 'utf8'))
    } catch (error) {
        console.warn('Swagger docs unavailable:', error.message)
        return null
    }
}

const allowedOrigins = (
    process.env.CORS_ALLOWED_ORIGINS ?? 'http://localhost:5173'
)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

app.use((request, response, next) => {
    const origin = request.headers.origin

    if (origin && allowedOrigins.includes(origin)) {
        response.setHeader('Access-Control-Allow-Origin', origin)
        response.setHeader('Vary', 'Origin')
    }

    response.setHeader(
        'Access-Control-Allow-Methods',
        'GET,POST,PATCH,DELETE,OPTIONS',
    )
    response.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
    )

    if (request.method === 'OPTIONS') {
        return response.sendStatus(204)
    }

    next()
})

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/transaction', transactionsRouter)

const swaggerDocument = loadSwaggerDocument()

if (swaggerDocument) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
} else {
    app.get('/docs', (_request, response) => {
        response.status(503).send({
            error: 'Swagger documentation is unavailable in this environment',
        })
    })
}
