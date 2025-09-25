import 'dotenv/config.js'
import express from 'express'

const name = 'Diego'

const app = express()

app.use(express.json())

app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000')
})
