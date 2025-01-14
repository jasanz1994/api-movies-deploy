const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const movies = require('./movies.json')
const { ValidatedMovie, ValidatedPartialMovie } = require('./Schemas/movie')

const app = express()

const PORT = process.env.PORT ?? 3000
app.disable('x-powered-by')

app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:3000',
        'https://movies.com',
        'https://midu.dev'
      ]
  
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }
  
      if (!origin) {
        return callback(null, true)
      }
  
      return callback(new Error('Not allowed by CORS'))
    }
  }))

app.get('/movies', (req, res) => {
    const { genre } = req.query

    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() == genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }

    res.json(movies)
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id == id)

    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {

    const result = ValidatedMovie(req.body)

    if (result.error) {
        return res.status(422).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }
    movies.push(newMovie)

    res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
    const result = ValidatedPartialMovie(req.body)

    if (result.error) {
        return res.status(404).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id == id)

    if (movieIndex == -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    const movieUpdated = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = movieUpdated

    return res.json(movieUpdated)
})

app.delete('/movies/:id', (req, res) => {

    const movieIndex = movies.findIndex(movie => movie.id == req.params.id)

    if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' })

    movies.splice(movieIndex, 1)

    return res.json({message: 'Movie Deleted'})
})

app.listen(PORT, () => {
    console.log(`server listening on Port http://localhost:${PORT}`)
})

