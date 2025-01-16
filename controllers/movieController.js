import { ValidatedMovie, ValidatedPartialMovie } from "../schemas/movieSchema.js"

export class MovieController {

    constructor({ movieModel }) {
        this.movieModel = movieModel;
    }

    getMovies = async (req, res) => {
        const { genre } = req.query
        const movies = await this.movieModel.getAll({ genre })
        res.json(movies)
    }

    getMovieById = async (req, res) => {
        const { id } = req.params
        const movie = await this.movieModel.getById({ id })

        if (movie) return res.json(movie)

        return res.status(404).json({ message: 'Movie not found' })
    }

    createMovie = async (req, res) => {
        const result = ValidatedMovie(req.body)

        if (result.error) {
            return res.status(422).json({ error: JSON.parse(result.error.message) })
        }

        const newMovie = await this.movieModel.create({ input: result.data })

        res.status(201).json(newMovie)
    }

    updateMovie = async (req, res) => {
        const result = ValidatedPartialMovie(req.body)

        if (result.error) {
            return res.status(404).json({ error: JSON.parse(result.error.message) })
        }

        const { id } = req.params
        const updatedMovie = await this.movieModel.update({ id, input: result.data })

        if (updatedMovie) {
            return res.json(updatedMovie)
        }

        return res.status(404).json({ message: 'Movie not found' })
    }

    deleteMovie = async (req, res) => {
        const deleted = await this.movieModel.delete({ id: req.params.id })

        if (deleted === false) return res.status(404).json({ message: 'Movie not found' })

        return res.json({ message: 'Movie Deleted' })
    }
}