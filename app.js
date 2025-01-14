import express, { json } from 'express'
import { moviesRouter } from './routes/moviesRoutes.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

const PORT = process.env.PORT ?? 3000

app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware({acceptedOrigins: ['http://localhost:8080', 'http://localhost:3000']}))
app.use('/movies', moviesRouter)

app.listen(PORT, () => {
    console.log(`server listening on Port http://localhost:${PORT}`)
})

