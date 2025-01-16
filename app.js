import express, { json } from 'express'
import { createMovieRouter } from './routes/moviesRoutes.js'
import { corsMiddleware } from './middlewares/cors.js'

export const createApp = ({ movieModel }) => {
    const app = express()
    app.disable('x-powered-by')
    app.use(json())
    app.use(corsMiddleware({acceptedOrigins: ['http://localhost:8080', 'http://localhost:3000']}))
    
    app.use('/movies', createMovieRouter({movieModel}))

    const PORT = process.env.PORT ?? 3000

    app.listen(PORT, () => {
        console.log(`server listening on Port http://localhost:${PORT}`)
    })
}


