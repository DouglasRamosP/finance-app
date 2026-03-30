import express from 'express'
import { usersRouter } from './routes/users.js'
import { transactionsRouter } from './routes/transaction.js'
import swaggerDocument from '../docs/swagger.json' with { type: 'json' }

export const app = express()

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

const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Finance App API Docs</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
    />
    <style>
      body {
        margin: 0;
        background: #fafafa;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/docs/swagger.json',
        dom_id: '#swagger-ui',
      })
    </script>
  </body>
</html>
`

app.get(['/docs', '/docs/'], (_request, response) => {
    response.type('html').send(swaggerHtml)
})

app.get('/docs/swagger.json', (_request, response) => {
    response.json(swaggerDocument)
})

export default app
