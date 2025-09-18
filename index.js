import 'dotenv/config.js'
import exporess from 'express'

import { PostgresHelper } from './src/db/postgres/helper.js'

const app = exporess()

app.get('/', async (req, res) => {
    const results = await PostgresHelper.query('SELECT * FROM users;')
    res.send(JSON.stringify(results))
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
